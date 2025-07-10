'use server'
import { cookies } from 'next/headers'
import type { Analytics } from './validation/types/analytics'
import { api } from './api-wrapper'

export const getAnalytics = async (): Promise<Analytics> => {
  const token = (await cookies()).get('access_token')
  if (!token) throw new Error('Unauthorized')

  const analytics = await api('analytics', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((data) => data.json())
  if (!analytics) throw new Error('Unable to get analytics.')

  return analytics
}
