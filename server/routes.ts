import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search, minPrice, maxPrice, brand } = req.query;
      
      let products = await storage.getProducts();
      
      // Apply filters
      if (category && category !== 'all') {
        products = products.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
      }
      
      if (search) {
        const searchQuery = search as string;
        products = products.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (minPrice) {
        products = products.filter(p => parseFloat(p.price) >= parseFloat(minPrice as string));
      }
      
      if (maxPrice) {
        products = products.filter(p => parseFloat(p.price) <= parseFloat(maxPrice as string));
      }
      
      if (brand) {
        products = products.filter(p => p.brand.toLowerCase() === (brand as string).toLowerCase());
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Get products by category
  app.get("/api/categories/:category/products", async (req, res) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products by category" });
    }
  });

  // Search products
  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const products = await storage.searchProducts(q);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to search products" });
    }
  });

  // Get unique categories
  app.get("/api/categories", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const categories = Array.from(new Set(products.map(p => p.category)));
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Get unique brands
  app.get("/api/brands", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const brands = Array.from(new Set(products.map(p => p.brand)));
      res.json(brands);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brands" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
