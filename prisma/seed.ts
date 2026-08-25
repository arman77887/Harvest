import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create Default Admin User
  const adminEmail = process.env.ADMIN_SEED_EMAIL || "admin@harvest.com";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "AdminSecurePassword123!";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: "Harvest System Administrator",
        email: adminEmail,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });
    console.log(`Created default Admin user: ${adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  // 2. Create Categories
  const categoriesData = [
    {
      name: "Fresh Vegetables",
      slug: "fresh-vegetables",
      description: "Farm-fresh organic vegetables harvested daily.",
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800",
    },
    {
      name: "Organic Fruits",
      slug: "organic-fruits",
      description: "Sweet and natural seasonal fruits directly from orchards.",
      imageUrl: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=800",
    },
    {
      name: "Grains & Pulses",
      slug: "grains-pulses",
      description: "High quality wholesome grains, lentils, and pulses.",
      imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800",
    },
    {
      name: "Dairy & Honey",
      slug: "dairy-honey",
      description: "Pure grass-fed dairy products and natural raw honey.",
      imageUrl: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?q=80&w=800",
    },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("Categories seeded successfully.");

  // Get Created Categories
  const vegCategory = await prisma.category.findUnique({ where: { slug: "fresh-vegetables" } });
  const fruitCategory = await prisma.category.findUnique({ where: { slug: "organic-fruits" } });
  const grainCategory = await prisma.category.findUnique({ where: { slug: "grains-pulses" } });
  const dairyCategory = await prisma.category.findUnique({ where: { slug: "dairy-honey" } });

  // 3. Create Sample Products
  if (vegCategory && fruitCategory && grainCategory && dairyCategory) {
    const productsData = [
      {
        name: "Organic Fresh Spinach",
        slug: "organic-fresh-spinach",
        description: "Nutrient-rich green spinach leaves grown without pesticides.",
        price: 2.99,
        stock: 50,
        imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=800",
        categoryId: vegCategory.id,
      },
      {
        name: "Farm Tomatoes (1kg)",
        slug: "farm-tomatoes-1kg",
        description: "Juicy vine-ripened red tomatoes ideal for salads and cooking.",
        price: 3.49,
        stock: 100,
        imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800",
        categoryId: vegCategory.id,
      },
      {
        name: "Fresh Red Apples",
        slug: "fresh-red-apples",
        description: "Crisp and juicy hand-picked red apples from local orchards.",
        price: 4.99,
        stock: 75,
        imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=800",
        categoryId: fruitCategory.id,
      },
      {
        name: "Organic Bananas (Bunch)",
        slug: "organic-bananas-bunch",
        description: "Naturally ripened sweet bananas packed with potassium.",
        price: 1.99,
        stock: 120,
        imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=800",
        categoryId: fruitCategory.id,
      },
      {
        name: "Premium Basmati Rice (5kg)",
        slug: "premium-basmati-rice-5kg",
        description: "Aromatic long-grain basmati rice harvested and aged to perfection.",
        price: 18.50,
        stock: 40,
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800",
        categoryId: grainCategory.id,
      },
      {
        name: "Pure Wildflower Raw Honey (500g)",
        slug: "pure-wildflower-raw-honey-500g",
        description: "Unfiltered and unpasteurized 100% natural organic honey.",
        price: 9.99,
        stock: 30,
        imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800",
        categoryId: dairyCategory.id,
      },
    ];

    for (const prod of productsData) {
      await prisma.product.upsert({
        where: { slug: prod.slug },
        update: {},
        create: prod,
      });
    }
    console.log("Products seeded successfully.");
  }

  console.log("Database seeding completed.");
}

main()
  .catch((e) => {
    console.error("Error during database seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
      
