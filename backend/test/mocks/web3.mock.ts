export default class Web3Mock {
  static utils = {
    fromWei: (wei: string) => (Number(wei) / 1e18).toString(),
  }

  static eth = {
    getBalance: vi.fn().mockResolvedValue('1000000000000000000'), // 1 ETH
    getBlockNumber: vi.fn().mockResolvedValue(123456),
    getGasPrice: vi.fn().mockResolvedValue('20000000000'),
    accounts: {
      wallet: { add: vi.fn(), 0: { address: '0xTEST' } },
      defaultAccount: '0xTEST',
    },
  }

  utils = Web3Mock.utils
  eth = Web3Mock.eth

  constructor(public provider: string) {}

  Contract = class {
    methods = {
      decimals: () => ({ call: vi.fn().mockResolvedValue(18) }),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      balanceOf: (addr: string) => ({
        call: vi.fn().mockResolvedValue('50000000000000000000'),
      }), // 50 tokens
    }

    events = {
      Transfer: vi.fn().mockReturnValue({
        on: vi.fn().mockReturnThis(),
      }),
    }
  }
}
