import { db } from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Updating admin password...");

  if (!process.env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_PASSWORD environment variable must be defined.");
  }

  const adminEmail = "admin@meal-master.com";
  const newPassword = process.env.ADMIN_PASSWORD;
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  try {
    const user = await db.user.update({
      where: { email: adminEmail },
      data: {
        password: hashedPassword,
      },
    });
    console.log(`✅ Password updated successfully for user: ${user.email}`);
  } catch (error) {
    console.error("❌ Error updating password:", error);
    // @ts-ignore
    if (error.code === "P2025") {
      console.log(
        "  -> The admin user (admin@meal-master.com) was not found in the database."
      );
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
