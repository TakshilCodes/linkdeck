const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      collections: {
        orderBy: { position: "asc" },
        select: { id: true, position: true },
      },
      links: {
        where: { collectionId: null },
        orderBy: { position: "asc" },
        select: { id: true, position: true },
      },
    },
  });

  for (const user of users) {
    const existing = await prisma.boardItem.findMany({
      where: { userId: user.id },
      select: { id: true },
    });

    if (existing.length > 0) continue;

    let nextPosition = 0;

    for (const link of user.links) {
      await prisma.boardItem.create({
        data: {
          userId: user.id,
          type: "LINK",
          position: nextPosition,
          linkId: link.id,
        },
      });
      nextPosition += 1;
    }

    for (const collection of user.collections) {
      await prisma.boardItem.create({
        data: {
          userId: user.id,
          type: "COLLECTION",
          position: nextPosition,
          collectionId: collection.id,
        },
      });
      nextPosition += 1;
    }
  }

  console.log("Board items backfilled");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });