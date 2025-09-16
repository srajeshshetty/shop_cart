import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/schema";
import { useCart } from "@/contexts/cart-context";
import { Link } from "wouter";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="product-card bg-card border border-border rounded-lg overflow-hidden cursor-pointer" data-testid={`card-product-${product.id}`}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover"
          data-testid={`img-product-${product.id}`}
        />
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs" data-testid={`badge-category-${product.id}`}>
              {product.category}
            </Badge>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-xs text-muted-foreground ml-1" data-testid={`text-rating-${product.id}`}>
                {product.rating}
              </span>
            </div>
          </div>
          <h3 className="font-semibold text-card-foreground mb-1" data-testid={`text-name-${product.id}`}>
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2" data-testid={`text-description-${product.id}`}>
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-card-foreground" data-testid={`text-price-${product.id}`}>
              ${product.price}
            </span>
            <Button
              onClick={handleAddToCart}
              className="bg-primary text-primary-foreground hover:opacity-90"
              data-testid={`button-add-to-cart-${product.id}`}
            >
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
