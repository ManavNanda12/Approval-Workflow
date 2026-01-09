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
  X,
  ArrowRight
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface FieldChange {
  fieldName: string;
  currentValue: string;
  proposedValue: string;
  status: "pending" | "approved" | "rejected";
}

interface ProductChangeRequest {
  id: number;
  name: string;
  totalItems: number;
  pendingItems: number;
  approvedItems: number;
  rejectedItems: number;
  needsReview: boolean;
  changes: FieldChange[];
}

const mockData: ProductChangeRequest[] = [
  { 
    id: 1276, 
    name: "Jack Daniel's Single Barrel", 
    totalItems: 8, 
    pendingItems: 3, 
    approvedItems: 4, 
    rejectedItems: 1, 
    needsReview: false,
    changes: [
      { fieldName: "Product Name", currentValue: "Jack Daniel's Single Barrel", proposedValue: "Jack Daniel's Single Barrel Select", status: "pending" },
      { fieldName: "Volume", currentValue: "750ml", proposedValue: "700ml", status: "approved" },
      { fieldName: "ABV", currentValue: "45%", proposedValue: "47%", status: "pending" },
      { fieldName: "Price", currentValue: "$49.99", proposedValue: "$54.99", status: "rejected" },
      { fieldName: "Category", currentValue: "American Whiskey", proposedValue: "Tennessee Whiskey", status: "approved" },
      { fieldName: "Description", currentValue: "A premium single barrel whiskey", proposedValue: "Hand-selected premium single barrel", status: "pending" },
      { fieldName: "Origin", currentValue: "USA", proposedValue: "Lynchburg, Tennessee", status: "approved" },
      { fieldName: "Age Statement", currentValue: "NAS", proposedValue: "Minimum 4 years", status: "approved" },
    ]
  },
  { 
    id: 1280, 
    name: "Johnnie Walker Blue Label", 
    totalItems: 5, 
    pendingItems: 2, 
    approvedItems: 2, 
    rejectedItems: 1, 
    needsReview: true,
    changes: [
      { fieldName: "Price", currentValue: "$189.99", proposedValue: "$199.99", status: "pending" },
      { fieldName: "Volume", currentValue: "750ml", proposedValue: "700ml", status: "approved" },
      { fieldName: "ABV", currentValue: "40%", proposedValue: "43%", status: "pending" },
      { fieldName: "Description", currentValue: "Premium blended scotch", proposedValue: "Ultra-premium blended scotch whisky", status: "approved" },
      { fieldName: "Origin", currentValue: "Scotland", proposedValue: "Kilmarnock, Scotland", status: "rejected" },
    ]
  },
  { 
    id: 1283, 
    name: "Macallan 18 Year", 
    totalItems: 6, 
    pendingItems: 0, 
    approvedItems: 5, 
    rejectedItems: 1, 
    needsReview: false,
    changes: [
      { fieldName: "Price", currentValue: "$299.99", proposedValue: "$349.99", status: "approved" },
      { fieldName: "Category", currentValue: "Scotch", proposedValue: "Single Malt Scotch", status: "approved" },
      { fieldName: "ABV", currentValue: "43%", proposedValue: "43%", status: "approved" },
      { fieldName: "Description", currentValue: "18 year aged scotch", proposedValue: "Rich and complex 18-year-old sherry oak matured", status: "approved" },
      { fieldName: "Cask Type", currentValue: "Oak", proposedValue: "Sherry Oak", status: "approved" },
      { fieldName: "Limited Edition", currentValue: "No", proposedValue: "Yes", status: "rejected" },
    ]
  },
  { 
    id: 1290, 
    name: "Grey Goose Vodka", 
    totalItems: 4, 
    pendingItems: 4, 
    approvedItems: 0, 
    rejectedItems: 0, 
    needsReview: false,
    changes: [
      { fieldName: "Price", currentValue: "$29.99", proposedValue: "$34.99", status: "pending" },
      { fieldName: "Volume", currentValue: "750ml", proposedValue: "1L", status: "pending" },
      { fieldName: "Description", currentValue: "French vodka", proposedValue: "Premium French wheat vodka", status: "pending" },
      { fieldName: "Origin", currentValue: "France", proposedValue: "Cognac, France", status: "pending" },
    ]
  },
  { 
    id: 1295, 
    name: "Patron Silver Tequila", 
    totalItems: 7, 
    pendingItems: 1, 
    approvedItems: 4, 
    rejectedItems: 2, 
    needsReview: true,
    changes: [
      { fieldName: "Price", currentValue: "$44.99", proposedValue: "$49.99", status: "pending" },
      { fieldName: "Category", currentValue: "Tequila", proposedValue: "Premium Tequila Blanco", status: "approved" },
      { fieldName: "ABV", currentValue: "40%", proposedValue: "40%", status: "approved" },
      { fieldName: "Description", currentValue: "Silver tequila", proposedValue: "Handcrafted 100% blue Weber agave", status: "approved" },
      { fieldName: "Origin", currentValue: "Mexico", proposedValue: "Jalisco, Mexico", status: "approved" },
      { fieldName: "Organic", currentValue: "No", proposedValue: "Yes", status: "rejected" },
      { fieldName: "Age", currentValue: "Unaged", proposedValue: "2 months rested", status: "rejected" },
    ]
  },
  { 
    id: 1301, 
    name: "Hendrick's Gin", 
    totalItems: 3, 
    pendingItems: 3, 
    approvedItems: 0, 
    rejectedItems: 0, 
    needsReview: false,
    changes: [
      { fieldName: "Price", currentValue: "$34.99", proposedValue: "$39.99", status: "pending" },
      { fieldName: "Description", currentValue: "Scottish gin", proposedValue: "Small batch Scottish gin with cucumber and rose", status: "pending" },
      { fieldName: "Botanicals", currentValue: "11 botanicals", proposedValue: "Cucumber, rose, and 11 botanicals", status: "pending" },
    ]
  },
  { 
    id: 1308, 
    name: "Rémy Martin XO", 
    totalItems: 5, 
    pendingItems: 0, 
    approvedItems: 3, 
    rejectedItems: 2, 
    needsReview: false,
    changes: [
      { fieldName: "Price", currentValue: "$179.99", proposedValue: "$199.99", status: "approved" },
      { fieldName: "Category", currentValue: "Cognac", proposedValue: "XO Cognac", status: "approved" },
      { fieldName: "Age", currentValue: "10 years", proposedValue: "Up to 37 years", status: "approved" },
      { fieldName: "Volume", currentValue: "750ml", proposedValue: "700ml", status: "rejected" },
      { fieldName: "Limited", currentValue: "No", proposedValue: "Yes", status: "rejected" },
    ]
  },
  { 
    id: 1315, 
    name: "Don Julio 1942", 
    totalItems: 9, 
    pendingItems: 5, 
    approvedItems: 3, 
    rejectedItems: 1, 
    needsReview: true,
    changes: [
      { fieldName: "Price", currentValue: "$149.99", proposedValue: "$169.99", status: "pending" },
      { fieldName: "Category", currentValue: "Tequila", proposedValue: "Añejo Tequila", status: "approved" },
      { fieldName: "ABV", currentValue: "40%", proposedValue: "40%", status: "approved" },
      { fieldName: "Description", currentValue: "Añejo tequila", proposedValue: "Luxury handcrafted añejo tequila", status: "pending" },
      { fieldName: "Age", currentValue: "2.5 years", proposedValue: "Minimum 2.5 years", status: "pending" },
      { fieldName: "Origin", currentValue: "Mexico", proposedValue: "Jalisco Highlands, Mexico", status: "approved" },
      { fieldName: "Bottle Design", currentValue: "Standard", proposedValue: "Tall distinctive bottle", status: "pending" },
      { fieldName: "Gift Box", currentValue: "No", proposedValue: "Yes", status: "pending" },
      { fieldName: "Limited Edition", currentValue: "No", proposedValue: "Yes", status: "rejected" },
    ]
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] px-1.5 py-0">
          Pending
        </Badge>
      );
    case "approved":
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px] px-1.5 py-0">
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px] px-1.5 py-0">
          Rejected
        </Badge>
      );
    default:
      return null;
  }
};

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
                <p className="text-sm text-muted-foreground">Review and manage pending changes • Hover on product name for preview</p>
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
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <HoverCard openDelay={200} closeDelay={100}>
                        <HoverCardTrigger asChild>
                          <div className="cursor-pointer" onClick={() => navigate(`/change-requests/${item.id}`)}>
                            <p className="font-medium group-hover:text-primary transition-colors underline decoration-dotted underline-offset-4 decoration-muted-foreground/50" data-testid={`text-product-name-${item.id}`}>
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">ID: {item.id}</p>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent 
                          className="w-[420px] p-0" 
                          align="start"
                          side="right"
                          data-testid={`hover-preview-${item.id}`}
                        >
                          <div className="p-3 border-b bg-muted/30">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-sm">{item.name}</p>
                                <p className="text-xs text-muted-foreground">Quick Preview • {item.changes.length} changes</p>
                              </div>
                              {!item.needsReview && item.pendingItems > 0 && (
                                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                                  Ready for Bulk Approval
                                </Badge>
                              )}
                              {item.needsReview && (
                                <Badge variant="destructive" className="text-xs gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Needs Review
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="max-h-[300px] overflow-y-auto">
                            <table className="w-full text-xs">
                              <thead className="bg-muted/20 sticky top-0">
                                <tr>
                                  <th className="text-left p-2 font-medium text-muted-foreground">Field</th>
                                  <th className="text-left p-2 font-medium text-muted-foreground">Current</th>
                                  <th className="w-4"></th>
                                  <th className="text-left p-2 font-medium text-muted-foreground">Proposed</th>
                                  <th className="text-center p-2 font-medium text-muted-foreground">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {item.changes.map((change, idx) => (
                                  <tr key={idx} className="hover:bg-muted/20">
                                    <td className="p-2 font-medium">{change.fieldName}</td>
                                    <td className="p-2 text-muted-foreground max-w-[80px] truncate" title={change.currentValue}>
                                      {change.currentValue}
                                    </td>
                                    <td className="px-1">
                                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                    </td>
                                    <td className={`p-2 max-w-[80px] truncate ${change.status === "approved" ? "text-green-700" : change.status === "rejected" ? "text-red-700 line-through" : "font-medium"}`} title={change.proposedValue}>
                                      {change.proposedValue}
                                    </td>
                                    <td className="p-2 text-center">
                                      {getStatusBadge(change.status)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="p-2 border-t bg-muted/20 flex items-center justify-between">
                            <div className="flex gap-2 text-xs">
                              <span className="text-amber-600">{item.pendingItems} pending</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-green-600">{item.approvedItems} approved</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-red-600">{item.rejectedItems} rejected</span>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 text-xs gap-1"
                              onClick={() => navigate(`/change-requests/${item.id}`)}
                            >
                              <Eye className="w-3 h-3" />
                              Full Details
                            </Button>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
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