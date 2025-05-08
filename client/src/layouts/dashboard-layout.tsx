import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import {
  BarChart3Icon,
  BuildingIcon,
  ClockIcon,
  FileTextIcon,
  HomeIcon,
  InfoIcon,
  LogOutIcon,
  MenuIcon,
  MessageSquareWarningIcon,
  TicketIcon,
  XIcon,
} from 'lucide-react';
import React, { useState } from 'react';
import { Navigate, NavLink, Outlet } from 'react-router-dom';

export const DashboardLayout: React.FC = () => {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Different navigation items based on user role
  const navigationItems =
    user?.role === 'admin'
      ? [
        {
          name: 'Overview',
          href: '/admin',
          icon: <HomeIcon className="h-5 w-5" />,
        },
        {
          name: 'Verified Institutions',
          href: '/admin/institutions',
          icon: <BuildingIcon className="h-5 w-5" />,
        },
        {
          name: 'Waitlist',
          href: '/admin/waitlist',
          icon: <ClockIcon className="h-5 w-5" />,
        },
        {
          name: 'Analytics',
          href: '/admin/analytics',
          icon: <BarChart3Icon className="h-5 w-5" />,
        },
        {
          name: 'Complaints',
          href: '/admin/complaints',
          icon: <MessageSquareWarningIcon className="h-5 w-5" />,
        },
      ]
      : [
        {
          name: 'Overview',
          href: '/institution',
          icon: <HomeIcon className="h-5 w-5" />,
        },
        {
          name: 'Information',
          href: '/institution/info',
          icon: <InfoIcon className="h-5 w-5" />,
        },
        {
          name: 'Announcements',
          href: '/institution/announcements',
          icon: <FileTextIcon className="h-5 w-5" />,
        },
        {
          name: 'Tickets',
          href: '/institution/tickets',
          icon: <TicketIcon className="h-5 w-5" />,
        },
      ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-40 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isSidebarOpen ? (
            <XIcon className="h-5 w-5" />
          ) : (
            <MenuIcon className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-72 transform bg-card border-r transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center justify-center border-b px-6">
            <h1 className="text-3xl font-bold tracking-tight">zyARat</h1>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-6">
            <nav className="flex flex-col gap-1 px-4">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.name === 'Overview'} // Add the end prop for "Overview" links
                  className={({ isActive }) =>
                    cn(
                      "flex w-full items-center rounded-md px-4 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                >
                  <span className="mr-3 shrink-0">{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                </NavLink>

              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="w-full ml-2 flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground"
              >
                <LogOutIcon className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
            {user && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs">{user.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Backdrop for mobile nav */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};