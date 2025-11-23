import { useReadContract } from 'wagmi'
import { parseAbi } from 'viem'

const EVVM_ADDRESS = '0xfb505ae3d70ca90c90c4dd48d0d19f3686dfd682'

const EVVM_ABI = parseAbi([
  'function getBalance(address user, address token) external view returns (uint256)'
])

export const useEvvmBalance = (user: string | undefined, token: string | undefined) => {
  const { data: balance, isLoading, error, refetch } = useReadContract({
    address: EVVM_ADDRESS,
    abi: EVVM_ABI,
    functionName: 'getBalance',
    args: user && token ? [user as `0x${string}`, token as `0x${string}`] : undefined,
    query: {
      enabled: !!user && !!token,
    }
  })

  return { balance, isLoading, error, refetch }
}
