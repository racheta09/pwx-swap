"use client"
import Image from "next/image"
import { useContractRead, useContract, useAddress } from "@thirdweb-dev/react"

import Auth from "@/components/auth"
import AdminSection from "@/components/adminSection"
import Swap from "@/components/swap"

export default function Home() {
  const address = useAddress()
  const usdtAddress = "0x55d398326f99059fF775485246999027B3197955" // USDT Address
  const swapContractAddress = "0x8569b5A0f09f3494F091992086c940c288400ECA"
  const { data: swapContract } = useContract(swapContractAddress)
  const { data: owner } = useContractRead(swapContract, "owner")
  const { data: rate } = useContractRead(swapContract, "rate")
  const { data: ended } = useContractRead(swapContract, "saleEnded")

  return (
    <>
    <div className="navbar bg-base-300">
      <a className="btn btn-ghost normal-case text-xl">PWX Swap</a>
      </div>
      <Auth>
      <main className="flex flex-col m-2 p-2 align-middle justify-center items-center bg-[url(/bg2.jpg)] min-h-screen bg-cover bg-center">
                <div className="bg-slate-700 m-4 p-8 rounded-xl bg-[url(/bg1.jpg)] bg-cover bg-center">
                    <h1 className="text-4xl text-center m-2 p-2">
                        Welcome to The PWX Swap
                    </h1>
                    <h4 className="text-xl text-center m-2 p-2">
                        Current PWX Rate: ${rate && rate/10000000}
                    </h4>
                    {ended ? (
                        <h2 className="text2xl text-center m-2 p-2">
                            Swap Ended
                        </h2>
                    ) : (
                        <Swap
                            swapContractAddress={swapContractAddress}
                            rate={rate}
                        />
                    )}

                    {owner && owner == address ? (
                        <AdminSection
                            swapContractAddress={swapContractAddress}
                            usdtContractAddress={usdtAddress}
                        />
                    ) : (
                        ""
                    )}
                </div>
            </main>
      </Auth>
    </>
  )
}
