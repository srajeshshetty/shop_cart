import { type User, type InsertUser, type Product, type InsertProduct, type Order, type InsertOrder, type OrderItem, type InsertOrderItem, users, products, orders, orderItems } from "@shared/schema";
import { db } from "./db";
import { eq, like, or, ilike } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  
  // Order methods
  getOrdersByUser(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(ilike(products.category, category));
  }

  async searchProducts(query: string): Promise<Product[]> {
    const searchPattern = `%${query}%`;
    return await db.select().from(products).where(
      or(
        ilike(products.name, searchPattern),
        ilike(products.description, searchPattern),
        ilike(products.category, searchPattern),
        ilike(products.brand, searchPattern)
      )
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values({
        ...insertProduct,
        rating: insertProduct.rating || null,
        inStock: insertProduct.inStock ?? true,
        stockQuantity: insertProduct.stockQuantity || 0,
        specifications: insertProduct.specifications || null
      })
      .returning();
    return product;
  }

  async updateProduct(id: string, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(productUpdate)
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  // Order methods
  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const [orderItem] = await db
      .insert(orderItems)
      .values(insertOrderItem)
      .returning();
    return orderItem;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  // Initialize sample products
  async initializeProducts(): Promise<void> {
    const existingProducts = await this.getProducts();
    if (existingProducts.length > 0) {
      return; // Products already exist
    }

    const sampleProducts: InsertProduct[] = [
      {
        name: "MacBook Pro 14\"",
        description: "Apple M2 chip, 16GB RAM, 512GB SSD - Professional laptop for creative work and development",
        price: "1999.00",
        image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Laptops",
        brand: "Apple",
        rating: "4.8",
        inStock: true,
        stockQuantity: 25,
        specifications: "Apple M2 chip with 8-core CPU and 10-core GPU, 16GB unified memory, 512GB SSD storage, 14.2-inch Liquid Retina XDR display"
      },
      {
        name: "iPhone 15 Pro",
        description: "128GB, Titanium Blue, A17 Pro chip - Latest iPhone with advanced camera system",
        price: "999.00",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Smartphones",
        brand: "Apple",
        rating: "4.9",
        inStock: true,
        stockQuantity: 50,
        specifications: "A17 Pro chip, 128GB storage, Pro camera system with 48MP Main camera, Titanium design"
      },
      {
        name: "Sony WH-1000XM4",
        description: "Wireless Noise Canceling Headphones - Industry-leading noise cancellation",
        price: "349.00",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Audio",
        brand: "Sony",
        rating: "4.7",
        inStock: true,
        stockQuantity: 30,
        specifications: "30 hour battery life, Quick Charge, Premium noise canceling, Speak-to-chat technology"
      },
      {
        name: "PlayStation 5",
        description: "Gaming Console with DualSense Controller - Next-gen gaming experience",
        price: "499.00",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Gaming",
        brand: "Sony",
        rating: "4.6",
        inStock: true,
        stockQuantity: 15,
        specifications: "Custom AMD Zen 2 CPU, AMD RDNA 2 GPU, 16GB GDDR6 RAM, 825GB SSD, 4K gaming support"
      },
      {
        name: "iPad Pro 12.9\"",
        description: "M2 chip, 256GB, Wi-Fi + Cellular - Pro tablet for productivity and creativity",
        price: "1099.00",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Tablets",
        brand: "Apple",
        rating: "4.8",
        inStock: true,
        stockQuantity: 20,
        specifications: "Apple M2 chip, 12.9-inch Liquid Retina XDR display, 256GB storage, 5G connectivity"
      },
      {
        name: "Logitech MX Master 3",
        description: "Advanced Wireless Mouse - Precision and comfort for professionals",
        price: "99.00",
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Accessories",
        brand: "Logitech",
        rating: "4.5",
        inStock: true,
        stockQuantity: 100,
        specifications: "Darkfield tracking, 70-day battery, Flow cross-computer control, Ergonomic design"
      },
      {
        name: "Apple Watch Ultra",
        description: "GPS + Cellular, 49mm Titanium Case - Ultimate smartwatch for athletes",
        price: "799.00",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Wearables",
        brand: "Apple",
        rating: "4.7",
        inStock: true,
        stockQuantity: 40,
        specifications: "49mm titanium case, GPS + Cellular, Action Button, 36-hour battery life, Water resistant to 100 meters"
      },
      {
        name: "Canon EOS R5",
        description: "Full-Frame Mirrorless Camera Body - Professional photography and videography",
        price: "3899.00",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Cameras",
        brand: "Canon",
        rating: "4.9",
        inStock: true,
        stockQuantity: 10,
        specifications: "45MP full-frame CMOS sensor, 8K video recording, Dual Pixel CMOS AF II, In-body image stabilization"
      }
    ];

    for (const product of sampleProducts) {
      await this.createProduct(product);
    }
  }
}

export const storage = new DatabaseStorage();