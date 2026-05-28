import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';

const Home = lazy(() => import('./components/Home'));
const Products = lazy(() => import('./components/Products'));
const ProductDetails = lazy(() => import('./components/ProductDetails'));
const Cart = lazy(() => import('./components/Cart'));
const Wishlist = lazy(() => import('./components/Wishlist'));
const Checkout = lazy(() => import('./components/Checkout'));
const TrackOrders = lazy(() => import('./components/TrackOrders'));
const MyOrders = lazy(() => import('./components/MyOrders'));
const Contact = lazy(() => import('./components/Contact'));
const AdminSection = lazy(() => import('./components/AdminSection'));
const NotificationBanner = lazy(() => import('./components/NotificationBanner'));

const LoadingFallback = () => (
  <div className="p-8 text-center text-slate-500 animate-pulse">Loading...</div>
);

const MainLayout: React.FC = () => {
  const { currentPage, user, isAdmin } = useApp();

  const renderPage = () => {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          {(() => {
            switch (currentPage) {
              case 'products': return <Products />;
              case 'product-details': return <ProductDetails />;
              case 'cart': return <Cart />;
              case 'wishlist': return <Wishlist />;
              case 'checkout': return <Checkout />;
              case 'track-orders': return <TrackOrders />;
              case 'my-orders': return <MyOrders />;
              case 'contact': return <Contact />;
              case 'admin': return <AdminSection />;
              case 'home':
              default:
                return <Home />;
            }
          })()}
        </Suspense>
      </ErrorBoundary>
    );
  };

  const isFullWidth = (currentPage === 'admin' && user && isAdmin) || currentPage === 'home';
  const showHeaderFooter = !(currentPage === 'admin' && user && isAdmin);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {showHeaderFooter && <Header />}
      
      <main className={`flex-1 ${isFullWidth ? 'w-full' : 'max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-4'}`}>
        {renderPage()}
      </main>

      {showHeaderFooter && <Footer />}
      <NotificationBanner />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
