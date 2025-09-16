import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/cart-context";
import { Header } from "@/components/header";
import { CartSidebar } from "@/components/cart-sidebar";
import Home from "@/pages/home";
import ProductDetail from "@/pages/product-detail";
import NotFound from "@/pages/not-found";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('search-products', { detail: { query } }));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Header 
              onSearchChange={handleSearchChange}
              onCartToggle={() => setCartOpen(true)}
            />
            <Router />
            <CartSidebar 
              isOpen={cartOpen}
              onClose={() => setCartOpen(false)}
            />
          </div>
          <Toaster />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
