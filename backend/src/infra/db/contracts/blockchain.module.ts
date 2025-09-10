import { Module } from '@nestjs/common'
import { BlockchainService } from './blockchain.service'
import { BlockchainController } from '../../http/blockchain/blockchain.controller'
import { BlockchainStorage } from './transactions/blockchain.storage'

@Module({
  providers: [BlockchainService, BlockchainStorage],
  controllers: [BlockchainController],
  exports: [BlockchainStorage],
})
export class BlockchainModule {}
