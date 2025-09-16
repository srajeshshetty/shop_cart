import { useState } from "react";
import { Link } from "wouter";
import { Search, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";

interface HeaderProps {
  onSearchChange: (query: string) => void;
  onCartToggle: () => void;
}

export function Header({ onSearchChange, onCartToggle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount } = useCart();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <span className="ml-2 text-xl font-bold text-foreground">TechStore</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {/* Navigation & Cart */}
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-foreground hover:text-primary font-medium" data-testid="link-home">
                Home
              </Link>
              <Link href="/" className="text-muted-foreground hover:text-foreground" data-testid="link-products">
                Products
              </Link>
              <Link href="/" className="text-muted-foreground hover:text-foreground" data-testid="link-about">
                About
              </Link>
              <Link href="/" className="text-muted-foreground hover:text-foreground" data-testid="link-contact">
                Contact
              </Link>
            </nav>
            
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartToggle}
              className="relative"
              data-testid="button-cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center" data-testid="text-cart-count">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
