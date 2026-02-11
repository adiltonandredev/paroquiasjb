// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Criando dados iniciais...')

  // Configurações Iniciais
  await prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nome_paroquia: "Paróquia São João Batista",
      email_geral: "contato@paroquiasjb.org.br",
    },
  })

  // Usuário Admin
  await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      name: 'Administrador',
      password: '123456', // Senha simples para começar
      role: 'admin',
    },
  })

  console.log('Sucesso! Usuário admin@admin.com criado.')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })