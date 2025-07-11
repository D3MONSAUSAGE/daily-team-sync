
import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { SidebarProvider, SidebarInset, useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

// Memoized main content component to prevent unnecessary re-renders
const MainContent = memo(({ children }: { children: React.ReactNode }) => {
  const { setOpen, isMobile } = useSidebar();
  const isDesktop = !isMobile;

  const handleMainContentClick = () => {
    // Only auto-collapse on desktop, not mobile
    if (isDesktop) {
      setOpen(false);
    }
  };

  return (
    <SidebarInset 
      className="flex flex-col flex-1 no-scrollbar overflow-hidden"
      onClick={handleMainContentClick}
    >
      <Navbar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar smooth-scroll px-6 lg:px-12">
        <div className="space-y-6 animate-fade-in">
          {children}
        </div>
      </main>
    </SidebarInset>
  );
});

MainContent.displayName = 'MainContent';

// Memoized loading component
const LoadingScreen = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
    <div className="text-center glass-card p-8 rounded-2xl animate-scale-in">
      <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Loading TeamTegrate</h3>
      <p className="text-muted-foreground">Preparing your workspace...</p>
    </div>
  </div>
));

LoadingScreen.displayName = 'LoadingScreen';

const AppLayout = memo(() => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading while auth is initializing
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background w-full flex mobile-safe-area no-scrollbar overflow-hidden">
        <Sidebar />
        
        <MainContent>
          <Outlet />
        </MainContent>
      </div>
    </SidebarProvider>
  );
});

AppLayout.displayName = 'AppLayout';

export default AppLayout;
