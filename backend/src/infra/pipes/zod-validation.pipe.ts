import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidatorPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      // const validation = this.schema.safeParse(value)
      const validation = this.schema.parse(value)
      return validation
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          error: fromZodError(error as any),
        })
      }
      throw new BadRequestException('Data validation failed')
    }
  }
}
