/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EthersPage from './page'
import { waitFor } from '@/__test__/utils/whait-for'

vi.mock('ethers', () => {
  const signerMock = {
    getAddress: vi.fn().mockResolvedValue('0xABCDEF1234567890'),
    sendTransaction: vi.fn().mockResolvedValue({
      wait: vi.fn().mockResolvedValue({}),
    }),
  }

  class BrowserProviderMock {
    getSigner = vi.fn().mockResolvedValue(signerMock)
    getBalance = vi.fn().mockResolvedValue(BigInt('1000000000000000000')) // 1 ETH
  }

  return {
    ethers: {
      BrowserProvider: BrowserProviderMock,
      formatEther: (value: bigint) => '1',
      parseEther: (val: string) => BigInt('1000000000000000'), // 0.001 ETH
    },
  }
})

describe('EthersPage component', () => {
  let mockRequest: any

  beforeEach(() => {
    mockRequest = vi.fn().mockResolvedValue(['0xABCDEF1234567890'])
    ;(window as any).ethereum = { request: mockRequest }
  })

  it('renders connect button', () => {
    render(<EthersPage />)
    expect(screen.getByText('Connect Wallet')).toBeDefined()
  })

  it('connects wallet and shows account + balance', async () => {
    render(<EthersPage />)

    fireEvent.click(screen.getByText('Connect Wallet'))

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalledWith({
        method: 'eth_requestAccounts',
      })
      expect(screen.getByText('Account: 0xABCDEF1234567890')).toBeDefined()
      expect(screen.getByText('Balance ETH: 1')).toBeDefined()
    })
  })
})
