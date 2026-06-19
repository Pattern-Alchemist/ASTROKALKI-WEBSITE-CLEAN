// Create a test NextAuth database session for testing /api/account/progress
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';

const db = new PrismaClient();
const email = 'progress-test@astrokalki.local';
const name = 'Progress Test';

async function main() {
  let user = await db.user.findUnique({ where: { email } });
  if (!user) {
    user = await db.user.create({
      data: { email, name, emailVerified: new Date() },
    });
    console.log('Created user', user.id);
  } else {
    console.log('Existing user', user.id);
  }

  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  await db.session.create({
    data: { sessionToken: token, userId: user.id, expires },
  });
  console.log('SESSION_TOKEN=' + token);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
