import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** 用于测试 prisma 语法 */
async function main() {
  const result = await prisma.sysUser.findUnique({
    where: { user_id: 2 },
    include: {
      roles: {
        include: {
          role: {
            include: {
              menus: {
                include: {
                  menu: {
                    select: {
                      perms: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  console.log(result);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
