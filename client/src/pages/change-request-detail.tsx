import { useState } from "react";
import { Link, useParams } from "wouter";
import { 
  ChevronLeft, 
  Package,
  Check,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

interface FieldChange {
  id: number;
  fieldName: string;
  currentValue: string;
  proposedValue: string;
  status: "pending" | "approved" | "rejected";
}

const productData: Record<number, { name: string; changes: FieldChange[] }> = {
  1276: {
    name: "Jack Daniel's Single Barrel",
    changes: [
      { id: 100, fieldName: "Thumbnail Image", currentValue: "https://imgs.search.brave.com/lSXkT-ZHuutw_ZHXQoZdwDEFfuXYTRRayS6EzZFApkc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNTI2/NTU2NzI2L3Bob3Rv/L2JvdHRsZS1vZi1q/YWNrLWRhbmllbHMt/Ym91cmJvbi5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9Yjlt/dEcxdmFuZ1RHSnFt/Z0hlZ0tpUGQ3MHY0/MGJzLU5jbnVPVFZF/dUUtZz0", proposedValue: "https://imgs.search.brave.com/JXBe3B-GrpOfH_gX9Ywf1M-7szR_zBSK2AB_1SqZto0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE2/OTI3MTM0NjMzMDkt/ZmM2YjlhNDNhMjI2/P2ZtPWpwZyZxPTYw/Jnc9MzAwMCZpeGxp/Yj1yYi00LjEuMCZp/eGlkPU0zd3hNakEz/ZkRCOE1IeHpaV0Z5/WTJoOE1UUjhmR3Bo/WTJzbE1qQmtZVzVw/Wld4emZHVnVmREI4/ZkRCOGZId3c", status: "pending" },
      { id: 101, fieldName: "Main Image", currentValue: "https://imgs.search.brave.com/9rPlSjLxObYt8YLi2Fu0k5kZ3eJ6PPHBrBA_IMShBW8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/c2h1dHRlcnN0b2Nr/LmNvbS9pbWFnZS1w/aG90by9qYWNrLWRh/bmllbHMtd2hpc2t5/LWJvdHRsZS13b29k/LTI2MG53LTE5MDEy/NzM2NTAuanBn", proposedValue: "https://imgs.search.brave.com/9FDPzRUGqhIPahiiugMNBA4Y8Q2M5mjJf3dqvVdPOqM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2FhLzlh/L2NjL2FhOWFjY2U5/MjJjNDQ0ODc2YTkz/YjVlOGQ1ZmFjNjk0/LmpwZw", status: "pending" },
      { id: 1, fieldName: "Product Name", currentValue: "Jack Daniel's Single Barrel", proposedValue: "Jack Daniel's Single Barrel Select", status: "pending" },
      { id: 2, fieldName: "Volume", currentValue: "750ml", proposedValue: "700ml", status: "approved" },
      { id: 3, fieldName: "ABV", currentValue: "45%", proposedValue: "47%", status: "pending" },
      { id: 4, fieldName: "Price", currentValue: "$49.99", proposedValue: "$54.99", status: "rejected" },
      { id: 5, fieldName: "Category", currentValue: "American Whiskey", proposedValue: "Tennessee Whiskey", status: "approved" },
      { id: 6, fieldName: "Description", currentValue: "A premium single barrel whiskey", proposedValue: "Hand-selected premium single barrel Tennessee whiskey with rich oak notes", status: "pending" },
      { id: 7, fieldName: "Origin", currentValue: "USA", proposedValue: "Lynchburg, Tennessee, USA", status: "approved" },
      { id: 8, fieldName: "Age Statement", currentValue: "NAS", proposedValue: "Minimum 4 years", status: "approved" },
    ],
  },
};

const defaultProduct = {
  name: "Sample Product",
  changes: [
    { id: 100, fieldName: "Thumbnail Image", currentValue: "https://via.placeholder.com/80x60?text=Old+Thumb", proposedValue: "https://via.placeholder.com/80x60?text=New+Thumb", status: "pending" },
    { id: 101, fieldName: "Main Image", currentValue: "https://via.placeholder.com/400x300?text=Old+Main", proposedValue: "https://via.placeholder.com/400x300?text=New+Main", status: "pending" },
    { id: 1, fieldName: "Product Name", currentValue: "Sample Product", proposedValue: "Updated Product Name", status: "pending" as const },
    { id: 2, fieldName: "Price", currentValue: "$29.99", proposedValue: "$34.99", status: "pending" as const },
    { id: 3, fieldName: "Description", currentValue: "Original description", proposedValue: "New improved description", status: "approved" as const },
    { id: 4, fieldName: "Category", currentValue: "General", proposedValue: "Premium", status: "rejected" as const },
  ],
};

export default function ChangeRequestDetail() {
  const params = useParams<{ id: string }>();
  const productId = parseInt(params.id || "0");
  
  const product = productData[productId] || defaultProduct;
  const [changes, setChanges] = useState<FieldChange[]>(product.changes);

  const pendingCount = changes.filter((c) => c.status === "pending").length;
  const approvedCount = changes.filter((c) => c.status === "approved").length;
  const rejectedCount = changes.filter((c) => c.status === "rejected").length;

  const updateStatus = (id: number, status: "approved" | "rejected") => {
    setChanges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  const approveAllPending = () => {
    setChanges((prev) =>
      prev.map((c) => (c.status === "pending" ? { ...c, status: "approved" } : c))
    );
  };

  const rejectAllPending = () => {
    setChanges((prev) =>
      prev.map((c) => (c.status === "pending" ? { ...c, status: "rejected" } : c))
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/change-requests">
              <Button variant="ghost" size="icon" className="shrink-0" data-testid="button-back">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display font-semibold text-lg" data-testid="text-product-name">
                  {product.name}
                </h1>
                <p className="text-sm text-muted-foreground">Product ID: {productId || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground" data-testid="text-total-count">{changes.length}</p>
                <p className="text-sm text-muted-foreground">Total Changes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-amber-200 bg-amber-50/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-600" data-testid="text-pending-count">{pendingCount}</p>
                <p className="text-sm text-amber-700/70">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-green-200 bg-green-50/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600" data-testid="text-approved-count">{approvedCount}</p>
                <p className="text-sm text-green-700/70">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-red-200 bg-red-50/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600" data-testid="text-rejected-count">{rejectedCount}</p>
                <p className="text-sm text-red-700/70">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display">Field Changes</CardTitle>
              {pendingCount > 0 && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={approveAllPending}
                    className="gap-2"
                    data-testid="button-approve-all"
                  >
                    <Check className="w-4 h-4" />
                    Approve All Pending
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={rejectAllPending}
                    className="gap-2 text-destructive hover:text-destructive"
                    data-testid="button-reject-all"
                  >
                    <X className="w-4 h-4" />
                    Reject All Pending
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-[180px]">Field</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Proposed Value</TableHead>
                  <TableHead className="w-[120px] text-center">Status</TableHead>
                  <TableHead className="w-[140px] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {changes.map((change) => (
                  <TableRow key={change.id} data-testid={`row-change-${change.id}`}>
                    <TableCell className="font-medium" data-testid={`text-field-name-${change.id}`}>
                      {change.fieldName}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        {change.fieldName.toLowerCase().includes("image") ? (
                          <img
                            src={change.currentValue}
                            alt="Current"
                            className={change.fieldName === "Thumbnail Image" ? "w-16 h-12 object-cover rounded border" : "w-32 h-24 object-cover rounded border"}
                          />
                        ) : (
                          <p className="text-muted-foreground truncate" title={change.currentValue} data-testid={`text-current-value-${change.id}`}>
                            {change.currentValue}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        {change.fieldName.toLowerCase().includes("image") ? (
                          <img
                            src={change.proposedValue}
                            alt="Proposed"
                            className={change.fieldName === "Thumbnail Image" ? "w-16 h-12 object-cover rounded border" : "w-32 h-24 object-cover rounded border"}
                          />
                        ) : (
                          <p className={`truncate ${change.status === "approved" ? "text-green-700 font-medium" : change.status === "rejected" ? "text-red-700 line-through" : "text-foreground font-medium"}`} title={change.proposedValue} data-testid={`text-proposed-value-${change.id}`}>
                            {change.proposedValue}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center" data-testid={`status-${change.id}`}>
                      {getStatusBadge(change.status)}
                    </TableCell>
                    <TableCell>
                      {change.status === "pending" ? (
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => updateStatus(change.id, "approved")}
                            data-testid={`button-approve-${change.id}`}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => updateStatus(change.id, "rejected")}
                            data-testid={`button-reject-${change.id}`}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <p className="text-center text-xs text-muted-foreground">—</p>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator />

          <div className="p-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {changes.length} total changes • {pendingCount} pending review
            </p>
            <Link href="/change-requests">
              <Button variant="outline" data-testid="button-back-to-list">
                Back to List
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
}