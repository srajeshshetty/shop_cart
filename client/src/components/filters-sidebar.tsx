import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";

interface FiltersSidebarProps {
  onFiltersChange: (filters: {
    categories: string[];
    minPrice: string;
    maxPrice: string;
    brands: string[];
  }) => void;
}

export function FiltersSidebar({ onFiltersChange }: FiltersSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ['/api/categories'],
  });

  const { data: brands = [] } = useQuery<string[]>({
    queryKey: ['/api/brands'],
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  useEffect(() => {
    onFiltersChange({
      categories: selectedCategories,
      minPrice,
      maxPrice,
      brands: selectedBrands,
    });
  }, [selectedCategories, minPrice, maxPrice, selectedBrands, onFiltersChange]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    }
  };

  const handlePriceFilter = () => {
    onFiltersChange({
      categories: selectedCategories,
      minPrice,
      maxPrice,
      brands: selectedBrands,
    });
  };

  const getCategoryCount = (category: string) => {
    return products.filter((p: Product) => p.category === category).length;
  };

  return (
    <aside className="lg:w-64 space-y-6">
      {/* Categories */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-card-foreground mb-4">Categories</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox
                id="all-products"
                checked={selectedCategories.length === 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCategories([]);
                  }
                }}
                data-testid="checkbox-all-categories"
              />
              <Label htmlFor="all-products" className="ml-2 text-sm cursor-pointer">
                All Products
              </Label>
              <span className="ml-auto text-xs text-muted-foreground">
                ({products.length})
              </span>
            </div>
            {categories.map((category: string) => (
              <div key={category} className="flex items-center">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, !!checked)}
                  data-testid={`checkbox-category-${category}`}
                />
                <Label htmlFor={`category-${category}`} className="ml-2 text-sm cursor-pointer">
                  {category}
                </Label>
                <span className="ml-auto text-xs text-muted-foreground">
                  ({getCategoryCount(category)})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-card-foreground mb-4">Price Range</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="flex-1"
                data-testid="input-min-price"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="flex-1"
                data-testid="input-max-price"
              />
            </div>
            <Button
              onClick={handlePriceFilter}
              className="w-full"
              data-testid="button-apply-price-filter"
            >
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Brand Filter */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-card-foreground mb-4">Brands</h3>
          <div className="space-y-2">
            {brands.map((brand: string) => (
              <div key={brand} className="flex items-center">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={(checked) => handleBrandChange(brand, !!checked)}
                  data-testid={`checkbox-brand-${brand}`}
                />
                <Label htmlFor={`brand-${brand}`} className="ml-2 text-sm cursor-pointer">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
