import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';

// Layouts
import { AuthLayout } from '@/layouts/auth-layout';
import { DashboardLayout } from '@/layouts/dashboard-layout';

// Auth Pages
import { LoginPage } from '@/pages/auth/login-page';

// Admin Pages
import { AdminAnalytics } from '@/pages/admin/admin-analytics';
import { AdminComplaints } from '@/pages/admin/admin-complaints';
import { AdminOverview } from '@/pages/admin/admin-overview';
import { AdminVerifiedInstitutions } from '@/pages/admin/admin-verified-institutions';
import { AdminWaitlist } from '@/pages/admin/admin-waitlist';

// Institution Pages
import { ThemeProvider } from '@/context/theme-provider';
import { InstitutionAnnouncements } from '@/pages/institution/institution-announcements';
import { InstitutionInfo } from '@/pages/institution/institution-info';
import { InstitutionOverview } from '@/pages/institution/institution-overview';
import { InstitutionTickets } from '@/pages/institution/institution-tickets';
import { WaitlistPage } from './pages/auth/waitlist-page';

// Create a component to handle the root redirect
const RootRedirect = () => {
  const location = useLocation();

  // Don't redirect if already on the waitlist page
  if (location.pathname === '/waitlist') {
    return null;
  }

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Redirect root to login but preserve waitlist */}
            <Route path="/" element={<RootRedirect />} />

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/waitlist" element={<WaitlistPage />} />
            </Route>

            {/* Admin Dashboard */}
            <Route element={<DashboardLayout />}>
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminOverview />} />
              <Route path="/admin/institutions" element={<AdminVerifiedInstitutions />} />
              <Route path="/admin/waitlist" element={<AdminWaitlist />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/complaints" element={<AdminComplaints />} />

              {/* Institution Routes */}
              <Route path="/institution" element={<InstitutionOverview />} />
              <Route path="/institution/info" element={<InstitutionInfo />} />
              <Route path="/institution/announcements" element={<InstitutionAnnouncements />} />
              <Route path="/institution/tickets" element={<InstitutionTickets />} />
            </Route>

            {/* Catch all - redirect to login except for waitlist */}
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;