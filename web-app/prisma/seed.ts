import { OrderStatus, PrismaClient, ProductStatus } from "@/generated/prisma/client";
import { ProductCreateInput } from "@/generated/prisma/models";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// const userData: Prisma.UserCreateInput[] = [
//   {
//     name: "Alice",
//     email: "alice@prisma.io",
//     posts: {
//       create: [
//         {
//           title: "Join the Prisma Discord",
//           content: "https://pris.ly/discord",
//           published: true,
//         },
//         {
//           title: "Prisma on YouTube",
//           content: "https://pris.ly/youtube",
//         },
//       ],
//     },
//   },
//   {
//     name: "Bob",
//     email: "bob@prisma.io",
//     posts: {
//       create: [
//         {
//           title: "Follow Prisma on Twitter",
//           content: "https://www.twitter.com/prisma",
//           published: true,
//         },
//       ],
//     },
//   },
// ];
const product:ProductCreateInput[] =[
{
    name: "Minimal Leather Wallet",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=1200&q=80",
    ],
    price: 39.99,
    sales: 124,
    status: ProductStatus.Active,
  },
  {
    name: "Wireless Mechanical Keyboard",
    images: [
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=1200&q=80",
    ],
    price: 129.99,
    sales: 87,
    status: ProductStatus.Active,
  },
  {
    name: "Premium Ceramic Mug",
    images: [
      "https://images.unsplash.com/photo-1516390118834-21602d501886?q=80&w=1536&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    price: 24.99,
    sales: 231,
    status: ProductStatus.Active,
  },
  {
    name: "Noise Cancelling Headphones",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80",
    ],
    price: 199.99,
    sales: 65,
    status: ProductStatus.Active,
  },
  {
    name: "Modern Desk Lamp",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
    ],
    price: 54.99,
    sales: 42,
    status: ProductStatus.Draft,
  },
  {
    name: "Classic Canvas Backpack",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
    ],
    price: 79.99,
    sales: 153,
    status: ProductStatus.Active,
  },
]
const orders = [
  {
    customer: "John Smith",
    email: "john@example.com",
    amount: 39.99,
    status: OrderStatus.PAID,
    productId: 'cmr590jna0002s8v8g5b53l5e',
  },
  {
    customer: "Emma Wilson",
    email: "emma@example.com",
    amount: 129.99,
    status: OrderStatus.SHIPPED,
    productId: 'cmr590jna0002s8v8g5b53l5e'
  },
  {
    customer: "Michael Brown",
    email: "michael@example.com",
    amount: 24.99,
    status: OrderStatus.DELIVERED,
    productId: 'cmr590jnk0004s8v8ghi2m3pg',
  },
  {
    customer: "Sophia Davis",
    email: "sophia@example.com",
    amount: 199.99,
    status: OrderStatus.PENDING,
    productId: 'cmr590jna0002s8v8g5b53l5e'
  },
  {
    customer: "Daniel Garcia",
    email: "daniel@example.com",
    amount: 54.99,
    status: OrderStatus.CANCELLED,
    productId: 'cmr590jnk0004s8v8ghi2m3pg',
  },
  {
    customer: "Olivia Martinez",
    email: "olivia@example.com",
    amount: 79.99,
    status: OrderStatus.PAID,
    productId: 'cmr590jhk0000s8v8sh2gbd17',
  },
  {
    customer: "Noah Taylor",
    email: "noah@example.com",
    amount: 39.99,
    status: OrderStatus.DELIVERED,
    productId: 'cmr590jhk0000s8v8sh2gbd17',
  },
  {
    customer: "Isabella Thomas",
    email: "isabella@example.com",
    amount: 129.99,
    status: OrderStatus.SHIPPED,
    productId: 'cmr590jna0002s8v8g5b53l5e',
  },
];
export async function main() {
  for (const u of orders) {
    await prisma.order.create({ data: u });
  }
}

main();