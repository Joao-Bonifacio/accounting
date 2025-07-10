import { faker } from '@faker-js/faker'
import { PrismaClient } from '../generated/mongo'

const prisma = new PrismaClient()
export async function seed() {
  console.log('Cleaning balances...')
  await prisma.balance.deleteMany()

  const productsCount = 5

  for (let i = 0; i < productsCount; i++) {

    const balance = await prisma.balance.create({
      data: {
        userId: crypto.randomUUID(),
        incomes: [{
          category: faker.helpers.arrayElement(['Salary', 'Freelance', 'Investments']).toLowerCase(),
          value: faker.number.float(),
          date: faker.date.recent({ days: 90 }),
        }],
        expenses: [{
          category: faker.helpers.arrayElement(['Rent', 'Transport', 'Food', 'Leisure']).toLowerCase(),
          value: faker.number.float(),
          date: faker.date.recent({ days: 90 }),
        }],
        wallets: [{
          category: faker.helpers.arrayElement(['Crypto', 'Stocks']).toLowerCase(),
          total: faker.number.float({ min: 100, max: 20000, fractionDigits: 2 })
        }],
      },
    })

    console.log(`Balance created => ${balance.id}`)
  }

  await prisma.$disconnect()
}
