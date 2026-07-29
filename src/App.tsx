import { BrowserRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import { DashboardHome } from './pages/DashboardHome';
import { StationList } from './pages/stations/StationList';
import { UnregisteredDevices } from './pages/stations/UnregisteredDevices';
import { TelemetryList } from './pages/telemetry/TelemetryList';
import { FirmwarePage } from './pages/firmware/FirmwarePage';
import { UserList } from './pages/users/UserList';

import { TicketList } from './pages/tickets/TicketList';
import { ProfilePage } from './pages/profile/ProfilePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      retry: (failureCount, error: any) => {
        // Don't retry on 401
        if (error?.status === 401 || error?.message === 'Session expired') return false;
        return failureCount < 1;
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardHome />} />
                <Route path="/stations" element={<StationList />} />
                <Route path="/stations/unregistered" element={<UnregisteredDevices />} />
                <Route path="/telemetry" element={<TelemetryList />} />
                <Route path="/firmware" element={<FirmwarePage />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/tickets" element={<TicketList />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>
            
            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
