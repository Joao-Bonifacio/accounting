/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { ethers } from 'ethers'

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function EthersPage() {
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)

  async function connectWallet() {
    if (!window.ethereum) return alert('Install MetaMask!')

    await window.ethereum.request({ method: 'eth_requestAccounts' })
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    setAccount(address)

    const bal = await provider.getBalance(address)
    setBalance(ethers.formatEther(bal))
  }

  return (
    <div>
      <h1>Ethers.js + MetaMask</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
      {account && <p>Account: {account}</p>}
      {balance && <p>Balance ETH: {balance}</p>}
      {/*
        <button onClick={sendTransaction} disabled={!account}>
          Send 0.001 ETH to myself
        </button>
      */}
    </div>
  )
}
