import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()
const rows = await db.$queryRaw`SELECT status, pattern, COUNT(*) as cnt FROM Testimonial GROUP BY status, pattern`
console.log(JSON.stringify(rows, null, 2))
const samples = await db.testimonial.findMany({ take: 10, select: { pattern: true, status: true, quote: true, initials: true } })
console.log('Samples:', JSON.stringify(samples, null, 2))
await db.$disconnect()
