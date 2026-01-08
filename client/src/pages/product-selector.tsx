import { Link } from "wouter";
import { Package, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const products = [
  { id: 1276, name: "Jack Daniel's Single Barrel" },
  { id: 1280, name: "Johnnie Walker Blue Label" },
  { id: 1283, name: "Macallan 18 Year" },
  { id: 1290, name: "Grey Goose Vodka" },
  { id: 1295, name: "Patron Silver Tequila" },
  { id: 1301, name: "Hendrick's Gin" },
  { id: 1308, name: "Rémy Martin XO" },
  { id: 1315, name: "Don Julio 1942" },
];

export default function ProductSelector() {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-lg" data-testid="text-page-title">
                Product Change Approval
              </h1>
              <p className="text-sm text-muted-foreground">Select a product to view change requests</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              data-testid="input-search-products"
            />
          </div>
        </div>

        <Card className="divide-y divide-border overflow-hidden shadow-sm">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href="/change-requests"
              data-testid={`link-product-${product.id}`}
            >
              <div className="flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary/70" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors" data-testid={`text-product-name-${product.id}`}>
                      {product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ID: {product.id}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}

          {filteredProducts.length === 0 && (
            <div className="px-5 py-12 text-center">
              <p className="text-muted-foreground">No products found matching "{search}"</p>
            </div>
          )}
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} available
        </p>
      </main>
    </div>
  );
}