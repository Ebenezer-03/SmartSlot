import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { QueueProvider } from "@/contexts/QueueContext";
import { ThemeProvider } from "@/hooks/useTheme";
import Login from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import TriageForm from "./pages/TriageForm";
import NotFound from "./pages/NotFound";
import ScheduleAppointment from "./pages/ScheduleAppointment";
import BookAppointment from "./pages/BookAppointment";
import DoctorUnavailable from "./pages/DoctorUnavailable";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.type === 'staff' ? '/staff-dashboard' : '/patient-dashboard'} replace /> : <Login />} />
      <Route 
        path="/patient-dashboard" 
        element={
          <ProtectedRoute>
            <PatientDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/staff-dashboard" 
        element={
          <ProtectedRoute>
            <StaffDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/triage" 
        element={
          <ProtectedRoute>
            <TriageForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/" 
        element={
          user ? (
            <Navigate to={user.type === 'staff' ? '/staff-dashboard' : '/patient-dashboard'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route path="/schedule-appointment" element={<ScheduleAppointment />} />
      <Route path="/book/:id" element={<BookAppointment />} />
      <Route path="/unavailable/:id" element={<DoctorUnavailable />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="smartslot-ui-theme">
      <AuthProvider>
        <QueueProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </QueueProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
