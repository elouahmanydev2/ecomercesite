import { OrderStatus, PrismaClient, ProductStatus } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// 1. Define the products to seed (We must seed them first!)
const productsToSeed = [
  {
    name: "Minimal Leather Wallet",
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=1200&q=80"],
    price: 39.99,
    sales: 124,
    stock: 50,
    thumbnail: 0,
    status: ProductStatus.Active,
  },
  {
    name: "Wireless Mechanical Keyboard",
    images: ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=1200&q=80"],
    price: 129.99,
    sales: 87,
    stock: 30,
    thumbnail: 0,
    status: ProductStatus.Active,
  },
  {
    name: "Premium Ceramic Mug",
    images: ["https://images.unsplash.com/photo-1516390118834-21602d501886?q=80&w=1536&auto=format&fit=crop"],
    price: 24.99,
    sales: 231,
    stock: 100,
    thumbnail: 0,
    status: ProductStatus.Active,
  },
];

// 2. Define standard order templates (without hardcoded productIds)
const orderTemplates = [
  { customer: "John Smith", email: "john@example.com", amount: 39.99, status: OrderStatus.PAID },
  { customer: "Emma Wilson", email: "emma@example.com", amount: 129.99, status: OrderStatus.SHIPPED },
  { customer: "Michael Brown", email: "michael@example.com", amount: 24.99, status: OrderStatus.DELIVERED },
  { customer: "Sophia Davis", email: "sophia@example.com", amount: 199.99, status: OrderStatus.PENDING },
  { customer: "Daniel Garcia", email: "daniel@example.com", amount: 54.99, status: OrderStatus.CANCELLED },
];

export async function main() {
  console.log("🧹 Cleaning up old database entries...");
  // Delete orders first, then products to avoid breaking constraints during cleanup
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});

  console.log("📦 Seeding products...");
  const createdProducts = [];
  for (const item of productsToSeed) {
    const product = await prisma.product.create({ data: item });
    createdProducts.push(product);
  }

  console.log(`✅ Seeded ${createdProducts.length} products successfully!`);

  console.log("🛒 Seeding orders dynamically matching product IDs...");
  for (const template of orderTemplates) {
    // Pick a random product from the newly created products list
    const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];

    await prisma.order.create({
      data: {
        ...template,
        productId: randomProduct.id, // Dynamically maps the genuine, newly-minted ID!
      },
    });
  }

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });