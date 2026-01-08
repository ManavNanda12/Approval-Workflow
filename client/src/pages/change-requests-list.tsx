import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { 
  Package, 
  ChevronLeft, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  Check,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductChangeRequest {
  id: number;
  name: string;
  totalItems: number;
  pendingItems: number;
  approvedItems: number;
  rejectedItems: number;
  needsReview: boolean;
}

const mockData: ProductChangeRequest[] = [
  { id: 1276, name: "Jack Daniel's Single Barrel", totalItems: 8, pendingItems: 3, approvedItems: 4, rejectedItems: 1, needsReview: false },
  { id: 1280, name: "Johnnie Walker Blue Label", totalItems: 5, pendingItems: 2, approvedItems: 2, rejectedItems: 1, needsReview: true },
  { id: 1283, name: "Macallan 18 Year", totalItems: 6, pendingItems: 0, approvedItems: 5, rejectedItems: 1, needsReview: false },
  { id: 1290, name: "Grey Goose Vodka", totalItems: 4, pendingItems: 4, approvedItems: 0, rejectedItems: 0, needsReview: false },
  { id: 1295, name: "Patron Silver Tequila", totalItems: 7, pendingItems: 1, approvedItems: 4, rejectedItems: 2, needsReview: true },
  { id: 1301, name: "Hendrick's Gin", totalItems: 3, pendingItems: 3, approvedItems: 0, rejectedItems: 0, needsReview: false },
  { id: 1308, name: "Rémy Martin XO", totalItems: 5, pendingItems: 0, approvedItems: 3, rejectedItems: 2, needsReview: false },
  { id: 1315, name: "Don Julio 1942", totalItems: 9, pendingItems: 5, approvedItems: 3, rejectedItems: 1, needsReview: true },
];

export default function ChangeRequestsList() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [needsReviewFilter, setNeedsReviewFilter] = useState<string>("all");
  const [pendingFilter, setPendingFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesReview = needsReviewFilter === "all" || 
        (needsReviewFilter === "yes" && item.needsReview) ||
        (needsReviewFilter === "no" && !item.needsReview);
      const matchesPending = pendingFilter === "all" ||
        (pendingFilter === "has-pending" && item.pendingItems > 0) ||
        (pendingFilter === "no-pending" && item.pendingItems === 0);
      return matchesSearch && matchesReview && matchesPending;
    });
  }, [search, needsReviewFilter, pendingFilter]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map((d) => d.id)));
    }
  };

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const selectedItems = filteredData.filter((d) => selectedIds.has(d.id));
  const canBulkAction = selectedItems.length > 0 && 
    selectedItems.every((item) => item.pendingItems > 0 && !item.needsReview);

  const handleBulkApprove = () => {
    alert(`Approved all pending changes for ${selectedItems.length} product(s)`);
    setSelectedIds(new Set());
  };

  const handleBulkReject = () => {
    alert(`Rejected all pending changes for ${selectedItems.length} product(s)`);
    setSelectedIds(new Set());
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="shrink-0" data-testid="button-back">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display font-semibold text-lg" data-testid="text-page-title">
                  Product Change Requests
                </h1>
                <p className="text-sm text-muted-foreground">Review and manage pending changes</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <Card className="shadow-sm">
          <div className="p-4 border-b space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={needsReviewFilter} onValueChange={setNeedsReviewFilter}>
                  <SelectTrigger className="w-[160px]" data-testid="select-needs-review">
                    <SelectValue placeholder="Needs Review" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reviews</SelectItem>
                    <SelectItem value="yes">Needs Review</SelectItem>
                    <SelectItem value="no">No Review Needed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={pendingFilter} onValueChange={setPendingFilter}>
                  <SelectTrigger className="w-[160px]" data-testid="select-pending">
                    <SelectValue placeholder="Pending Items" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pending</SelectItem>
                    <SelectItem value="has-pending">Has Pending</SelectItem>
                    <SelectItem value="no-pending">No Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedIds.size > 0 && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">
                  {selectedIds.size} selected
                </span>
                <div className="flex-1" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkApprove}
                  disabled={!canBulkAction}
                  className="gap-2"
                  data-testid="button-bulk-approve"
                >
                  <Check className="w-4 h-4" />
                  Approve All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkReject}
                  disabled={!canBulkAction}
                  className="gap-2 text-destructive hover:text-destructive"
                  data-testid="button-bulk-reject"
                >
                  <X className="w-4 h-4" />
                  Reject All
                </Button>
                {!canBulkAction && selectedIds.size > 0 && (
                  <span className="text-xs text-muted-foreground">
                    Bulk actions require pending items without review flags
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.size === filteredData.length && filteredData.length > 0}
                      onCheckedChange={toggleSelectAll}
                      data-testid="checkbox-select-all"
                    />
                  </TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-500" />
                      Pending
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Approved
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <XCircle className="w-4 h-4 text-red-500" />
                      Rejected
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Needs Review</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow 
                    key={item.id} 
                    className="group hover:bg-muted/30 cursor-pointer"
                    onClick={() => navigate(`/change-requests/${item.id}`)}
                    data-testid={`row-product-${item.id}`}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(item.id)}
                        onCheckedChange={() => toggleSelect(item.id)}
                        data-testid={`checkbox-product-${item.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors" data-testid={`text-product-name-${item.id}`}>
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">ID: {item.id}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium" data-testid={`text-total-${item.id}`}>
                      {item.totalItems}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={item.pendingItems > 0 ? "secondary" : "outline"}
                        className={item.pendingItems > 0 ? "bg-amber-100 text-amber-700 border-amber-200" : ""}
                        data-testid={`badge-pending-${item.id}`}
                      >
                        {item.pendingItems}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                        data-testid={`badge-approved-${item.id}`}
                      >
                        {item.approvedItems}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline"
                        className="bg-red-50 text-red-700 border-red-200"
                        data-testid={`badge-rejected-${item.id}`}
                      >
                        {item.rejectedItems}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.needsReview ? (
                        <Badge variant="destructive" className="gap-1" data-testid={`badge-review-${item.id}`}>
                          <AlertTriangle className="w-3 h-3" />
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground" data-testid={`badge-review-${item.id}`}>
                          No
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => navigate(`/change-requests/${item.id}`)}
                        data-testid={`button-view-${item.id}`}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredData.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No products match your filters</p>
            </div>
          )}

          <div className="px-4 py-3 border-t text-sm text-muted-foreground">
            Showing {filteredData.length} of {mockData.length} products
          </div>
        </Card>
      </main>
    </div>
  );
}