import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import MarketplacePage from "./pages/MarketplacePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CreateListingPage from "./pages/CreateListingPage";
import DashboardPage from "./pages/DashboardPage";
import SellerProfilePage from "./pages/SellerProfilePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/create-listing" element={<CreateListingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/seller/:id" element={<SellerProfilePage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
