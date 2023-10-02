import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentUser } from "@/services/mockAuthApi";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import UploadPackage from "@/pages/UploadPackage";
import Analysis from "@/pages/Analysis";
import ComplianceResult from "@/pages/ComplianceResult";
import ViolationDetails from "@/pages/ViolationDetails";
import Results from "@/pages/Results";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadPackage />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/results" element={<Results />} />
            <Route path="/results/:analysisId" element={<ComplianceResult />} />
            <Route path="/results/:analysisId/violations/:violationId" element={<ViolationDetails />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to={getCurrentUser() ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={getCurrentUser() ? "/dashboard" : "/login"} replace />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </>
  );
}

function RequireAuth() {
  return getCurrentUser() ? <Outlet /> : <Navigate to="/login" replace />;
}
