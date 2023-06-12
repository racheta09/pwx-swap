import {
  useContractRead,
  useContract,
  Web3Button,
  useAddress,
} from "@thirdweb-dev/react"
import { Erc20 } from "@thirdweb-dev/sdk"
import { parseEther } from "ethers/lib/utils"
// import { ThirdwebSDK } from "@thirdweb-dev/sdk"
import millify from "millify"
import Link from "next/link"
import { useState } from "react"

interface SwapProps {
  swapContractAddress: string
  rate: string
}
const erc20abi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address",
      },
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
]
export default function Swap({ swapContractAddress, rate }: SwapProps) {
  const address = useAddress()
  const [amount, setAmount] = useState("0")
  const { data: swapContract } = useContract(swapContractAddress)
  const { data: tokenAddress } = useContractRead(swapContract, "token")
  const { data: tokenContract } = useContract(tokenAddress, "token")
  const { data: symbol } = useContractRead(tokenContract, "symbol")
  const { data: tokenBalance } = useContractRead(tokenContract, "balanceOf", [
    address,
  ])
  const { data: tokenAllowance } = useContractRead(tokenContract, "allowance", [
    address,
    swapContractAddress,
  ])
  const [txhash, setTxhash] = useState("")
  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-center text-2xl m-2 p-2">Swap PWX to USDT</h1>
      <div className="flex flex-col justify-center">
        <p className="m-2 p-2">
          {`You will get ${millify(
            (parseInt(amount) * parseInt(rate)) / 10000000
          )} USDT `}
          Balance: {`${tokenBalance / 1e18} ${symbol}`}
          <br />
          Enter amount of PWX to sell
        </p>
        <input
          type="text"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="rounded m-2 p-2"
        />
        {parseInt(tokenAllowance) < parseFloat(amount) * 1e18 ? (
          <Web3Button
            contractAddress={tokenAddress}
            contractAbi={erc20abi}
            action={(contract) => {
              contract.call("approve", [
                swapContractAddress,
                parseEther(amount),
              ])
            }}
            theme="light"
          >
            Approve Token
          </Web3Button>
        ) : (
          <Web3Button
            contractAddress={swapContractAddress}
            action={async (contract) => {
              const tx = await contract.call("swapToBUSD", [parseEther(amount)])
              setTxhash(tx?.receipt?.transactionHash)
            }}
            theme="light"
          >
            Swap to USDT
          </Web3Button>
        )}
        {txhash && (
          <div className="alert alert-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              <Link
                href={`https://www.bscscan.com/tx/${txhash}`}
                target="_blank"
              >
                Transaction Success
              </Link>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
