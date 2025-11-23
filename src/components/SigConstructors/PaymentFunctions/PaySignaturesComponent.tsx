"use client";
import React from "react";
import { config } from "@/config/index";
import {
  TitleAndLink,
  NumberInputWithGenerator,
  AddressInputField,
  PrioritySelector,
  ExecutorSelector,
  DataDisplayWithClear,
  HelperInfo,
} from "@/components/SigConstructors/InputsAndModules";

import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import { executePay } from "@/utils/TransactionExecuter/useEVVMTransactionExecuter";

import {
  EVVMSignatureBuilder,
  PayInputData,
} from "@evvm/viem-signature-library";

import { getWalletClient } from "wagmi/actions";

interface PaySignaturesComponentProps {
  evvmID: string;
  evvmAddress: string;
}

export const PaySignaturesComponent = ({
  evvmID,
  evvmAddress,
}: PaySignaturesComponentProps) => {
  const [isUsingUsernames, setIsUsingUsernames] = React.useState(false);
  const [isUsingExecutor, setIsUsingExecutor] = React.useState(false);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<PayInputData | null>(null);
  const [savedTransactions, setSavedTransactions] = React.useState<Array<{
    timestamp: string;
    data: PayInputData;
  }>>([]);

  React.useEffect(() => {
    loadSavedTransactions();
  }, []);

  const loadSavedTransactions = async () => {
    try {
      const saved = await window.fs.readFile('signed_transactions.json', { encoding: 'utf8' });
      const transactions = JSON.parse(saved);
      setSavedTransactions(transactions);
    } catch {
      setSavedTransactions([]);
    }
  };

  const saveTransactionToFile = async (transaction: PayInputData) => {
    try {
      const newTransaction = {
        timestamp: new Date().toISOString(),
        data: transaction,
      };
      const updatedTransactions = [...savedTransactions, newTransaction];
      
      const blob = new Blob([JSON.stringify(updatedTransactions, null, 2)], {
        type: 'application/json',
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'signed_transactions.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSavedTransactions(updatedTransactions);
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Failed to save transaction to file');
    }
  };

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const formData = {
      evvmID: evvmID,
      nonce: getValue("nonceInput_Pay"),
      tokenAddress: getValue("tokenAddress_Pay"),
      to: getValue(isUsingUsernames ? "toUsername" : "toAddress"),
      executor: isUsingExecutor
        ? getValue("executorInput_Pay")
        : "0x0000000000000000000000000000000000000000",
      amount: getValue("amountTokenInput_Pay"),
      priorityFee: getValue("priorityFeeInput_Pay"),
    };

    try {
      const walletClient = await getWalletClient(config);
      const signatureBuilder = new (EVVMSignatureBuilder as any)(
        walletClient,
        walletData
      );

      const signature = await signatureBuilder.signPay(
        BigInt(formData.evvmID),
        formData.to,
        formData.tokenAddress as `0x${string}`,
        BigInt(formData.amount),
        BigInt(formData.priorityFee),
        BigInt(formData.nonce),
        priority === "high",
        formData.executor as `0x${string}`
      );

      const paymentData: PayInputData = {
        from: walletData.address as `0x${string}`,
        to_address: (formData.to.startsWith("0x")
          ? formData.to
          : "0x0000000000000000000000000000000000000000") as `0x${string}`,
        to_identity: formData.to.startsWith("0x") ? "" : formData.to,
        token: formData.tokenAddress as `0x${string}`,
        amount: BigInt(formData.amount),
        priorityFee: BigInt(formData.priorityFee),
        nonce: BigInt(formData.nonce),
        priority: priority === "high",
        executor: formData.executor,
        signature,
      };

      setDataToGet(paymentData);
    } catch (error) {
      console.error("Error creating signature:", error);
      alert("Error creating signature: " + (error as Error).message);
    }
  };

  const executePayment = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }

    if (!evvmAddress) {
      console.error("EVVM address is not provided");
      return;
    }

    try {
      await executePay(dataToGet, evvmAddress as `0x${string}`);
      console.log("Payment executed successfully");
      await saveTransactionToFile(dataToGet);
    } catch (error) {
      console.error("Error executing payment:", error);
      alert("Error executing payment: " + (error as Error).message);
    }
  };

  const downloadSignedTransaction = () => {
    if (!dataToGet) {
      alert("No transaction to download");
      return;
    }
    saveTransactionToFile(dataToGet);
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Single payment"
        link="https://www.evvm.info/docs/SignatureStructures/EVVM/SinglePaymentSignatureStructure"
      />
      <br />

      {/* Recipient configuration section */}
      <div style={{ marginBottom: "1rem" }}>
        <p>
          To:{" "}
          <select
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "6rem",
            }}
            onChange={(e) => setIsUsingUsernames(e.target.value === "true")}
          >
            <option value="false">Address</option>
            <option value="true">Username</option>
          </select>
          <input
            type="text"
            placeholder={isUsingUsernames ? "Enter username" : "Enter address"}
            id={isUsingUsernames ? "toUsername" : "toAddress"}
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "25rem",
              marginLeft: "0.5rem",
            }}
          />
        </p>
      </div>

      <AddressInputField
        label="Token address"
        inputId="tokenAddress_Pay"
        placeholder="Enter token address"
      />

      {/* Basic input fields */}
      {[
        { label: "Amount", id: "amountTokenInput_Pay", type: "number" },
        { label: "Priority fee", id: "priorityFeeInput_Pay", type: "number" },
      ].map(({ label, id, type }) => (
        <div key={id} style={{ marginBottom: "1rem" }}>
          <p>{label}</p>
          <input
            type={type}
            placeholder={`Enter ${label.toLowerCase()}`}
            id={id}
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "25rem",
            }}
          />
        </div>
      ))}

      {/* Executor configuration */}
      <ExecutorSelector
        inputId="executorInput_Pay"
        placeholder="Enter executor address"
        onExecutorToggle={setIsUsingExecutor}
        isUsingExecutor={isUsingExecutor}
      />

      {/* Priority configuration */}
      <PrioritySelector onPriorityChange={setPriority} />

      {/* Nonce section with automatic generator */}
      <NumberInputWithGenerator
        label="Nonce"
        inputId="nonceInput_Pay"
        placeholder="Enter nonce"
        showRandomBtn={priority !== "low"}
      />

      <div>
        {priority === "low" && (
          <HelperInfo label="How to find my sync nonce?">
            <div>
              You can retrieve your next sync nonce from the EVVM contract using
              the <code>getNextCurrentSyncNonce</code> function.
            </div>
          </HelperInfo>
        )}
      </div>

      {/* Create signature button */}
      <button
        onClick={makeSig}
        style={{
          padding: "0.5rem",
          marginTop: "1rem",
        }}
      >
        Create signature
      </button>

      {/* Results section */}
      {dataToGet && (
        <div style={{ marginTop: "2rem", width: "100%" }}>
          <DataDisplayWithClear
            dataToGet={dataToGet}
            onClear={() => setDataToGet(null)}
            onExecute={executePayment}
          />
          <button
            onClick={downloadSignedTransaction}
            style={{
              padding: "0.5rem 1rem",
              marginTop: "1rem",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Download Signed Transaction
          </button>
        </div>
      )}

      {/* Saved transactions history */}
      {savedTransactions.length > 0 && (
        <div style={{ marginTop: "2rem", width: "100%" }}>
          <h3>Saved Transactions ({savedTransactions.length})</h3>
          <div style={{
            maxHeight: "200px",
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "1rem",
            borderRadius: "5px",
          }}>
            {savedTransactions.map((tx, idx) => (
              <div key={idx} style={{
                padding: "0.5rem",
                borderBottom: idx < savedTransactions.length - 1 ? "1px solid #eee" : "none",
                fontSize: "0.9rem",
              }}>
                <strong>{tx.timestamp}</strong><br />
                To: {tx.data.to_identity || tx.data.to_address}<br />
                Amount: {tx.data.amount.toString()}<br />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};