import { prisma } from './apps/rps-frontend/src/lib/prisma';

async function main() {
  const users = await prisma.user.findMany();
  console.log('Prisma initialized! Users:', users.length);
}

main().catch(console.error);
