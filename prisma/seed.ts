import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Criptografando a senha por segurança
  const hashedPassword = await bcrypt.hash('AEC@01623', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'adiltonandre@gmail.com' },
    update: {},
    create: {
      email: 'adiltonandre@gmail.com',
      name: 'Adilton André',
      password: hashedPassword,
      role: 'ADMIN', // Certifique-se que seu enum no schema tem ADMIN
    },
  })

  console.log({ admin })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })