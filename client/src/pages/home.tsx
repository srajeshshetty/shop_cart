import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/product-card";
import { FiltersSidebar } from "@/components/filters-sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@shared/schema";

interface Filters {
  categories: string[];
  minPrice: string;
  maxPrice: string;
  brands: string[];
}

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    minPrice: "",
    maxPrice: "",
    brands: [],
  });
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");

  // Build query parameters
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    
    if (filters.categories.length > 0) {
      params.set('category', filters.categories[0]); // For simplicity, use first category
    }
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    if (filters.minPrice) {
      params.set('minPrice', filters.minPrice);
    }
    if (filters.maxPrice) {
      params.set('maxPrice', filters.maxPrice);
    }
    if (filters.brands.length > 0) {
      params.set('brand', filters.brands[0]); // For simplicity, use first brand
    }
    
    return params.toString();
  }, [filters, searchQuery]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products', buildQueryParams()],
    queryFn: async () => {
      const params = buildQueryParams();
      const url = params ? `/api/products?${params}` : '/api/products';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  // Sort products
  const sortedProducts = [...products].sort((a: Product, b: Product) => {
    switch (sortBy) {
      case "price-low-high":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high-low":
        return parseFloat(b.price) - parseFloat(a.price);
      case "rating":
        return parseFloat(b.rating || '0') - parseFloat(a.rating || '0');
      case "newest":
        return a.name.localeCompare(b.name); // Simple fallback
      default:
        return 0; // featured
    }
  });

  // Handle search from header
  useEffect(() => {
    const handleSearch = (event: CustomEvent) => {
      setSearchQuery(event.detail.query);
    };

    window.addEventListener('search-products', handleSearch as EventListener);
    return () => window.removeEventListener('search-products', handleSearch as EventListener);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="text-hero-title">
              Latest Tech Products
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90" data-testid="text-hero-subtitle">
              Discover cutting-edge electronics and gadgets
            </p>
            <Button 
              className="bg-background text-foreground hover:bg-muted px-8 py-3 text-lg"
              data-testid="button-hero-shop-now"
            >
              Shop Now
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="products-section">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <FiltersSidebar onFiltersChange={setFilters} />

          {/* Main Product Area */}
          <main className="flex-1">
            {/* Sort and Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold" data-testid="text-products-title">Products</h2>
                <p className="text-muted-foreground" data-testid="text-results-count">
                  Showing 1-{sortedProducts.length} of {sortedProducts.length} results
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]" data-testid="select-sort">
                  <SelectValue placeholder="Sort by: Featured" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Sort by: Featured</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Best Rating</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-12" data-testid="no-products">
                <p className="text-muted-foreground text-lg">No products found.</p>
                {(searchQuery || filters.categories.length > 0 || filters.brands.length > 0) && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your filters or search terms.
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="products-grid">
                {sortedProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {sortedProducts.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" disabled data-testid="button-previous">
                    Previous
                  </Button>
                  <Button className="bg-primary text-primary-foreground" data-testid="button-page-1">
                    1
                  </Button>
                  <Button variant="outline" disabled data-testid="button-next">
                    Next
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
