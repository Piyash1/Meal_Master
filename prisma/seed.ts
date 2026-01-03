import { db } from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  if (!process.env.ADMIN_PASSWORD || !process.env.MEMBER_PASSWORD) {
    throw new Error(
      "ADMIN_PASSWORD and MEMBER_PASSWORD environment variables must be defined."
    );
  }

  // Clean the database
  await db.meal.deleteMany();
  await db.deposit.deleteMany();
  await db.expense.deleteMany();
  await db.monthSummary.deleteMany();
  await db.member.deleteMany();
  await db.session.deleteMany();
  await db.account.deleteMany();
  await db.user.deleteMany();

  const adminPassword = process.env.ADMIN_PASSWORD;
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await db.user.upsert({
    where: { email: "admin@meal-master.com" },
    update: {
      password: hashedPassword,
    },
    create: {
      email: "admin@meal-master.com",
      name: "Apartment Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const memberPasswordPlain = process.env.MEMBER_PASSWORD;
  const memberPassword = await bcrypt.hash(memberPasswordPlain, 10);
  await db.user.upsert({
    where: { email: "member@meal-master.com" },
    update: {
      password: memberPassword,
    },
    create: {
      email: "member@meal-master.com",
      name: "Common Member",
      password: memberPassword,
      role: "MEMBER",
    },
  });

  const members = [
    {
      id: "piyash",
      name: "Piyash",
      isActive: true,
      email: "admin@meal-master.com",
    },
    { id: "sakil", name: "Sakil", isActive: true },
    { id: "miraj", name: "Miraj", isActive: true },
    { id: "mojahid", name: "Mojahid", isActive: true },
    { id: "shanto", name: "Shanto", isActive: true },
    { id: "mominul", name: "Mominul", isActive: true },
    { id: "tonmoy", name: "Tonmoy", isActive: true },
  ];

  for (const member of members) {
    const { email, ...memberData } = member;
    await db.member.upsert({
      where: { id: memberData.id },
      update: {
        ...memberData,
        userId: email ? adminUser.id : undefined,
      },
      create: {
        ...memberData,
        userId: email ? adminUser.id : undefined,
      },
    });
  }

  console.log("Seeding complete. Admin: admin@meal-master.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
