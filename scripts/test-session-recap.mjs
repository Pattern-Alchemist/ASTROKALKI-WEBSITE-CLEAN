import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('SessionRecap delegate exists:', typeof db.sessionRecap);
  const count = await db.sessionRecap.count();
  console.log('SessionRecap count:', count);

  const test = await db.sessionRecap.upsert({
    where: { bookingId: 'test-m7c-debug' },
    create: { bookingId: 'test-m7c-debug', email: 'test@example.com' },
    update: {},
  });
  console.log('Upsert OK:', test.id, test.bookingId, test.email);

  await db.sessionRecap.delete({ where: { bookingId: 'test-m7c-debug' } });
  console.log('Cleanup OK');
}

main().then(() => db.$disconnect()).catch((e) => { console.error(e); process.exit(1); });
