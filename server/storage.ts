import { type User, type InsertUser, type Product, type InsertProduct } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: Omit<Product, 'id'>[] = [
      {
        name: "MacBook Pro 14\"",
        description: "Apple M2 chip, 16GB RAM, 512GB SSD - Professional laptop for creative work and development",
        price: "1999.00",
        image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Laptops",
        brand: "Apple",
        rating: "4.8",
        inStock: true,
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
        specifications: "45MP full-frame CMOS sensor, 8K video recording, Dual Pixel CMOS AF II, In-body image stabilization"
      }
    ];

    sampleProducts.forEach(product => {
      const id = randomUUID();
      this.products.set(id, { ...product, id });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      product => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery) ||
        product.brand.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      rating: insertProduct.rating || null,
      inStock: insertProduct.inStock ?? true,
      specifications: insertProduct.specifications || null
    };
    this.products.set(id, product);
    return product;
  }
}

export const storage = new MemStorage();
