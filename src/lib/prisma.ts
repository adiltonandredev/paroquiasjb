import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

// AQUI ESTÁ O PONTO: export default
export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma