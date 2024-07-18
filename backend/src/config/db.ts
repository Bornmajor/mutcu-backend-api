import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// Function to disconnect PrismaClient client: 
// THIS IS FOR LONG RUNNING PROCESSES ONLY LIKE CRONE JOBS
export async function disconnectClient() {
  await prisma.$disconnect();
  console.log("PrismaClient client disconnected!");
  // process.exit(1);
}
