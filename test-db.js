const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Connecting to database...');
    const users = await prisma.adminUser.findMany();
    console.log('Success! Users count:', users.length);
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
