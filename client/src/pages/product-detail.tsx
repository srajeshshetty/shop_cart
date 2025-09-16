import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/cart-context";
import { Product } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { addItem } = useCart();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['/api/products', id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error('Failed to fetch product');
      }
      return response.json();
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" data-testid="text-error-title">
            Product Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/")} data-testid="button-back-home">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate("/")}
        className="mb-6"
        data-testid="button-back"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Button>

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
            data-testid="img-product-detail"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" data-testid="badge-category">
                {product.category}
              </Badge>
              <Badge variant="outline" data-testid="badge-brand">
                {product.brand}
              </Badge>
            </div>
            
            <h1 className="text-3xl font-bold mb-2" data-testid="text-product-name">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-1 font-medium" data-testid="text-product-rating">
                  {product.rating}
                </span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`} data-testid="text-stock-status">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            
            <p className="text-4xl font-bold text-primary mb-6" data-testid="text-product-price">
              ${product.price}
            </p>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-product-description">
              {product.description}
            </p>
          </div>

          {/* Specifications */}
          {product.specifications && (
            <>
              <Separator />
              <div>
                <h2 className="text-xl font-semibold mb-3">Specifications</h2>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-product-specifications">
                      {product.specifications}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          <Separator />

          {/* Add to Cart */}
          <div className="space-y-4">
            <Button 
              onClick={handleAddToCart}
              disabled={!product.inStock}
              size="lg"
              className="w-full"
              data-testid="button-add-to-cart"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            
            {!product.inStock && (
              <p className="text-sm text-muted-foreground text-center">
                This product is currently unavailable.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
