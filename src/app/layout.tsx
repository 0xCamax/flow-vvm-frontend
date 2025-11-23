import type { Metadata } from "next";
import './globals.css'
import { Press_Start_2P, VT323 } from 'next/font/google'
import { headers } from 'next/headers'
import { cookieToInitialState } from 'wagmi'
import { config } from '@/config'
import ContextProvider from '@/context'

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
})

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
})

export const metadata = {
  title: 'Flow VVM - Retro Edition',
  description: 'A cozy pixel art crypto experience',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersObj = await headers()
  const cookies = headersObj.get('cookie')
  const initialState = cookieToInitialState(config, cookies)

  return (
    <html lang="en">
      <body className={`${pressStart2P.variable} ${vt323.variable}`}>
        <ContextProvider initialState={initialState}>{children}</ContextProvider>
      </body>
    </html>
  )
}
