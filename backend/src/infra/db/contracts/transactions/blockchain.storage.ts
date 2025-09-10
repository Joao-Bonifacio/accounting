import { BlockchainService } from '../blockchain.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BlockchainStorage {
  constructor(private readonly blockChain: BlockchainService) {}

  async getBalance(address: string) {
    const data = await this.blockChain.getBalance(address)
    return data
  }

  async getERC20Balance(address: string, contractAddress: string) {
    const data = await this.blockChain.getERC20Balance(address, contractAddress)
    return data
  }
}
