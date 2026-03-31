#!/usr/bin/env tsx
// Usage: npx tsx scripts/make-admin.ts user@email.com

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: npx tsx scripts/make-admin.ts user@email.com');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`User not found: ${email}`);
    process.exit(1);
  }

  await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
  });

  console.log(`✅ ${email} is now ADMIN (was ${user.role})`);
  await prisma.$disconnect();
}

main().catch(console.error);
