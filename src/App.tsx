import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CookieBanner } from "@/components/CookieBanner";
import { AdminGuard } from "@/components/admin/AdminGuard";
import Index from "./pages/Index";

// Lazy-loaded routes (off the critical path → reduces initial JS bundle)
const ShopPage = lazy(() => import("./pages/ShopPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const CheckoutCancel = lazy(() => import("./pages/CheckoutCancel"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ImpressumPage = lazy(() => import("./pages/ImpressumPage"));
const DatenschutzPage = lazy(() => import("./pages/DatenschutzPage"));
const AGBPage = lazy(() => import("./pages/AGBPage"));
const WiderrufsrechtPage = lazy(() => import("./pages/WiderrufsrechtPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const GuideDetailPage = lazy(() => import("./pages/GuideDetailPage"));

// Admin chunks (only loaded for admins)
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminGuides = lazy(() => import("./pages/admin/AdminGuides"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ScrollToTop />
            <CartDrawer />
            <CookieBanner />
            <WhatsAppBubble />
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/produkte" element={<ShopPage />} />
                <Route path="/produkt/:id" element={<ProductDetailPage />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/checkout/cancel" element={<CheckoutCancel />} />
                <Route path="/anmelden" element={<AuthPage />} />
                <Route path="/konto" element={<AccountPage />} />
                <Route path="/impressum" element={<ImpressumPage />} />
                <Route path="/datenschutz" element={<DatenschutzPage />} />
                <Route path="/agb" element={<AGBPage />} />
                <Route path="/widerrufsrecht" element={<WiderrufsrechtPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/kontakt" element={<ContactPage />} />
                <Route path="/wunschliste" element={<WishlistPage />} />
                <Route path="/ratgeber/:slug" element={<GuideDetailPage />} />

                {/* Admin routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminGuard>
                      <AdminLayout />
                    </AdminGuard>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="produkte" element={<AdminProducts />} />
                  <Route path="benutzer" element={<AdminUsers />} />
                  <Route path="bestellungen" element={<AdminOrders />} />
                  <Route path="kategorien" element={<AdminCategories />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="bewertungen" element={<AdminReviews />} />
                  <Route path="ratgeber" element={<AdminGuides />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
