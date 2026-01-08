import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import ProductSelector from "@/pages/product-selector";
import ChangeRequestsList from "@/pages/change-requests-list";
import ChangeRequestDetail from "@/pages/change-request-detail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ProductSelector} />
      <Route path="/change-requests" component={ChangeRequestsList} />
      <Route path="/change-requests/:id" component={ChangeRequestDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;