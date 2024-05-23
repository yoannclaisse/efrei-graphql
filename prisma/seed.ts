import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    username: 'Alice',
    email: 'alice@prisma.io',
    todos: {
      create: [
        {
          title: 'Join the Prisma Discord',
          description: 'https://pris.ly/discord',
          completed: true,
        },
      ],
    },
  },
  {
    username: 'Nilu',
    email: 'nilu@prisma.io',
    todos: {
      create: [
        {
          title: 'Follow Prisma on Twitter',
          description: 'https://www.twitter.com/prisma',
          completed: true,
        },
      ],
    },
  },
  {
    username: 'Mahmoud',
    email: 'mahmoud@prisma.io',
    todos: {
      create: [
        {
          title: 'Ask a question about Prisma on GitHub',
          description: 'https://www.github.com/prisma/prisma/discussions',
          completed: true,
        },
        {
          title: 'Prisma on YouTube',
          description: 'https://pris.ly/youtube',
          completed: false,
        },
      ],
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
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
