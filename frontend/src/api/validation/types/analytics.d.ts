import z from 'zod'
import { analyticsSchema } from '../analytics-validate'

export type Analytics = z.infer<typeof analyticsSchema>
