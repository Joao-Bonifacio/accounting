import { EnvService } from '@/core/env/env.service'
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import Web3 from 'web3'

@Injectable()
export class BlockchainService implements OnModuleInit, OnModuleDestroy {
  private web3http: Web3
  private web3ws: Web3

  private readonly erc20Abi = [
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [{ name: '', type: 'uint8' }],
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: 'owner', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: '', type: 'uint256' }],
      type: 'function',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: 'from', type: 'address' },
        { indexed: true, name: 'to', type: 'address' },
        { indexed: false, name: 'value', type: 'uint256' },
      ],
      name: 'Transfer',
      type: 'event',
    },
  ] as const

  constructor(private env: EnvService) {
    this.web3http = new Web3(this.env.get('RPC_HTTP_URL')!)
    this.web3ws = new Web3(this.env.get('RPC_WS_URL')!)

    if (this.env.get('PRIVATE_KEY')) {
      this.web3http.eth.accounts.wallet.add(this.env.get('PRIVATE_KEY'))
      this.web3http.eth.defaultAccount =
        this.web3http.eth.accounts.wallet[0].address
    }
  }

  async onModuleInit() {
    console.log('BlockchainService iniciado.')
    const block = await this.web3http.eth.getBlockNumber()
    console.log(`Actual block: ${block}`)
  }

  async onModuleDestroy() {
    console.log('BlockchainService destruído.')
    ;(this.web3ws.currentProvider as any)?.disconnect?.()
  }

  async getBalance(address: string) {
    const wei = await this.web3http.eth.getBalance(address)
    return this.web3http.utils.fromWei(wei, 'ether')
  }

  async getERC20Balance(address: string, tokenAddress: string) {
    const contract = new this.web3http.eth.Contract(
      this.erc20Abi as any,
      tokenAddress,
    )
    const [decimals, balance] = await Promise.all([
      contract.methods.decimals().call(),
      contract.methods.balanceOf(address).call(),
    ])
    return Number(balance) / 10 ** Number(decimals)
  }

  subscribeTransfers(tokenAddress: string, cb: (ev: any) => void) {
    const contract = new this.web3ws.eth.Contract(
      this.erc20Abi as any,
      tokenAddress,
    )
    const transferEvent = contract.events.Transfer({})
    transferEvent.on('data', cb)
    // .on('error', (err: any) => console.error('Transfer error:', err))
    return transferEvent
  }
}
