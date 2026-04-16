import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    // Test the database connection
    await prisma.$connect();
    console.log('Database Connected: MySQL');
    return prisma;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default prisma;
