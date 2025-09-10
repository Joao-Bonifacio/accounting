import { Controller, Get, Query } from '@nestjs/common'
import { BlockchainStorage } from '@/infra/db/contracts/transactions/blockchain.storage'
import { EnvService } from '@/core/env/env.service'

@Controller('blockchain')
export class BlockchainController {
  constructor(
    private readonly blockchain: BlockchainStorage,
    private env: EnvService,
  ) {}

  @Get('balance')
  async balance(@Query('address') address?: string) {
    const acct = address ?? this.env.get('ACCOUNT_ADDRESS')!
    return {
      address: acct,
      ethBalance: await this.blockchain.getBalance(acct),
      erc20Balance: await this.blockchain.getERC20Balance(
        acct,
        this.env.get('ERC20_ADDRESS')!,
      ),
    }
  }
}
