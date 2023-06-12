"use client"
import "./globals.css"
import { Inter } from "next/font/google"
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Pocket Wallet Swap",
  description: "Swap your PWX Tokens",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const activeChainId = ChainId.BinanceSmartChainMainnet

  return (
    <html lang="en">
      <head>
        <title>Pocket Wallet Swap</title>
      </head>
      <ThirdwebProvider activeChain={activeChainId}>
        <body className={inter.className}>{children}</body>
      </ThirdwebProvider>
    </html>
  )
}
