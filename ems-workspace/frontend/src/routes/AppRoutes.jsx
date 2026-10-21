import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useClientStore from '../store/useClientStore';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Founder Pages
import FounderDashboard from '../pages/founder/FounderDashboard';
import FounderProfile from '../pages/founder/FounderProfile';
import MyListings from '../pages/founder/MyListings';
import AddListing from '../pages/founder/AddListing';
import EditListing from '../pages/founder/EditListing';
import ListingDetails from '../pages/founder/ListingDetails';
import FounderMatches from '../pages/founder/FounderMatches';
import FounderConnections from '../pages/founder/FounderConnections';
import FounderRequests from '../pages/founder/FounderRequests';
import FounderMessages from '../pages/founder/FounderMessages';

// Investor Pages
import InvestorDashboard from '../pages/investor/InvestorDashboard';
import InvestorProfile from '../pages/investor/InvestorProfile';
import InvestmentPreferences from '../pages/investor/InvestmentPreferences';
import InvestorStartupListings from '../pages/investor/StartupListings';
import InvestorStartupDetails from '../pages/investor/StartupDetails';
import InvestorMatches from '../pages/investor/InvestorMatches';
import InvestorConnections from '../pages/investor/InvestorConnections';
import InvestorRequests from '../pages/investor/InvestorRequests';
import InvestorMessages from '../pages/investor/InvestorMessages';

// Mentor Pages
import MentorDashboard from '../pages/mentor/MentorDashboard';
import MentorProfile from '../pages/mentor/MentorProfile';
import Expertise from '../pages/mentor/Expertise';
import FounderListings from '../pages/mentor/FounderListings';
import MentorFounderDetails from '../pages/mentor/FounderDetails';
import MentorMatches from '../pages/mentor/MentorMatches';
import MentorConnections from '../pages/mentor/MentorConnections';
import MentorRequests from '../pages/mentor/MentorRequests';
import MentorMessages from '../pages/mentor/MentorMessages';

// Team Member Pages
import TeamDashboard from '../pages/teamMember/TeamDashboard';
import TeamProfile from '../pages/teamMember/TeamProfile';
import Skills from '../pages/teamMember/Skills';
import TeamStartupListings from '../pages/teamMember/StartupListings';
import TeamStartupDetails from '../pages/teamMember/StartupDetails';
import TeamMatches from '../pages/teamMember/TeamMatches';
import TeamConnections from '../pages/teamMember/TeamConnections';
import TeamRequests from '../pages/teamMember/TeamRequests';
import TeamMessages from '../pages/teamMember/TeamMessages';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageListings from '../pages/admin/ManageListings';
import ManageReports from '../pages/admin/ManageReports';

// Layout Wrappers
import InvestorLayout from '../components/InvestorLayout';
import FounderLayout from '../components/FounderLayout';
import MentorLayout from '../components/MentorLayout';
import TeamLayout from '../components/TeamLayout';

// Home / Shared & Template Info
import Home from '../pages/Home';
import EmsTemplatePage from '../pages/EmsTemplatePage';

/**
 * ProtectedRoute Component:
 * Prevents unauthenticated users from accessing any role dashboard or protected page.
 * Unauthenticated requests are immediately redirected to /login first.
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useClientStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page first if not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optional role validation
  if (allowedRoles && allowedRoles.length > 0 && user?.role) {
    const userRole = user.role.toLowerCase();
    const isAllowed = allowedRoles.some(
      (r) => r.toLowerCase() === userRole || (r.toLowerCase() === 'team' && userRole === 'teammember')
    );

    if (!isAllowed && userRole !== 'admin') {
      const defaultDashboard =
        userRole === 'investor'
          ? '/investor/dashboard'
          : userRole === 'mentor'
          ? '/mentor/dashboard'
          : userRole === 'teammember' || userRole === 'team'
          ? '/team/dashboard'
          : '/founder/dashboard';
      return <Navigate to={defaultDashboard} replace />;
    }
  }

  return children;
}

/**
 * GuestRoute Component:
 * Prevents already authenticated users from seeing login/signup pages again.
 */
function GuestRoute({ children }) {
  const { isAuthenticated, user } = useClientStore();

  if (isAuthenticated) {
    const userRole = user?.role?.toLowerCase() || 'founder';
    const targetDashboard =
      userRole === 'investor'
        ? '/investor/dashboard'
        : userRole === 'mentor'
        ? '/mentor/dashboard'
        : userRole === 'teammember' || userRole === 'team'
        ? '/team/dashboard'
        : userRole === 'admin'
        ? '/admin/dashboard'
        : '/founder/dashboard';
    return <Navigate to={targetDashboard} replace />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* ── Public Landing & Info Routes (No Auth Required) ── */}
      <Route path="/" element={<EmsTemplatePage />} />
      <Route path="/template" element={<EmsTemplatePage />} />
      <Route path="/info" element={<EmsTemplatePage />} />
      <Route path="/about" element={<EmsTemplatePage />} />
      <Route path="/overview" element={<EmsTemplatePage />} />

      {/* ── Auth Routes (Shows Login / Register First) ── */}
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/auth/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />

      {/* ── Protected App Feed Routes (Requires Login) ── */}
      <Route path="/matches" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/connections" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Home /></ProtectedRoute>} />

      {/* ── Protected Founder Routes (Requires Founder Role + Login) ── */}
      <Route path="/founder/dashboard" element={<ProtectedRoute allowedRoles={['founder']}><FounderLayout><FounderDashboard /></FounderLayout></ProtectedRoute>} />
      <Route path="/founder/profile" element={<ProtectedRoute allowedRoles={['founder']}><FounderLayout><FounderProfile /></FounderLayout></ProtectedRoute>} />
      <Route path="/founder/my-listings" element={<ProtectedRoute allowedRoles={['founder']}><FounderLayout><MyListings /></FounderLayout></ProtectedRoute>} />
      <Route path="/founder/add-listing" element={<ProtectedRoute allowedRoles={['founder']}><FounderLayout><AddListing /></FounderLayout></ProtectedRoute>} />
      <Route path="/founder/edit-listing/:id" element={<ProtectedRoute allowedRoles={['founder']}><FounderLayout><EditListing /></FounderLayout></ProtectedRoute>} />
      <Route path="/founder/listing/:id" element={<ProtectedRoute allowedRoles={['founder']}><FounderLayout><ListingDetails /></FounderLayout></ProtectedRoute>} />
      <Route path="/founder/matches" element={<ProtectedRoute allowedRoles={['founder']}><FounderLayout><FounderMatches /></FounderLayout></ProtectedRoute>} />
      <Route path="/founder/connections" element={<ProtectedRoute allowedRoles={['founder']}><FounderLayout><FounderConnections /></FounderLayout></ProtectedRoute>} />
      <Route path="/founder/requests" element={<ProtectedRoute allowedRoles={['founder']}><FounderLayout><FounderRequests /></FounderLayout></ProtectedRoute>} />
      <Route path="/founder/messages" element={<ProtectedRoute allowedRoles={['founder']}><FounderLayout><FounderMessages /></FounderLayout></ProtectedRoute>} />

      {/* ── Protected Investor Routes (Requires Investor Role + Login) ── */}
      <Route path="/investor/dashboard" element={<ProtectedRoute allowedRoles={['investor']}><InvestorLayout><InvestorDashboard /></InvestorLayout></ProtectedRoute>} />
      <Route path="/investor/profile" element={<ProtectedRoute allowedRoles={['investor']}><InvestorLayout><InvestorProfile /></InvestorLayout></ProtectedRoute>} />
      <Route path="/investor/preferences" element={<ProtectedRoute allowedRoles={['investor']}><InvestorLayout><InvestmentPreferences /></InvestorLayout></ProtectedRoute>} />
      <Route path="/investor/listings" element={<ProtectedRoute allowedRoles={['investor']}><InvestorLayout><InvestorStartupListings /></InvestorLayout></ProtectedRoute>} />
      <Route path="/investor/listing/:id" element={<ProtectedRoute allowedRoles={['investor']}><InvestorLayout><InvestorStartupDetails /></InvestorLayout></ProtectedRoute>} />
      <Route path="/investor/matches" element={<ProtectedRoute allowedRoles={['investor']}><InvestorLayout><InvestorMatches /></InvestorLayout></ProtectedRoute>} />
      <Route path="/investor/connections" element={<ProtectedRoute allowedRoles={['investor']}><InvestorLayout><InvestorConnections /></InvestorLayout></ProtectedRoute>} />
      <Route path="/investor/requests" element={<ProtectedRoute allowedRoles={['investor']}><InvestorLayout><InvestorRequests /></InvestorLayout></ProtectedRoute>} />
      <Route path="/investor/messages" element={<ProtectedRoute allowedRoles={['investor']}><InvestorLayout><InvestorMessages /></InvestorLayout></ProtectedRoute>} />

      {/* ── Protected Mentor Routes (Requires Mentor Role + Login) ── */}
      <Route path="/mentor/dashboard" element={<ProtectedRoute allowedRoles={['mentor']}><MentorLayout><MentorDashboard /></MentorLayout></ProtectedRoute>} />
      <Route path="/mentor/profile" element={<ProtectedRoute allowedRoles={['mentor']}><MentorLayout><MentorProfile /></MentorLayout></ProtectedRoute>} />
      <Route path="/mentor/expertise" element={<ProtectedRoute allowedRoles={['mentor']}><MentorLayout><Expertise /></MentorLayout></ProtectedRoute>} />
      <Route path="/mentor/listings" element={<ProtectedRoute allowedRoles={['mentor']}><MentorLayout><FounderListings /></MentorLayout></ProtectedRoute>} />
      <Route path="/mentor/founder/:id" element={<ProtectedRoute allowedRoles={['mentor']}><MentorLayout><MentorFounderDetails /></MentorLayout></ProtectedRoute>} />
      <Route path="/mentor/matches" element={<ProtectedRoute allowedRoles={['mentor']}><MentorLayout><MentorMatches /></MentorLayout></ProtectedRoute>} />
      <Route path="/mentor/connections" element={<ProtectedRoute allowedRoles={['mentor']}><MentorLayout><MentorConnections /></MentorLayout></ProtectedRoute>} />
      <Route path="/mentor/requests" element={<ProtectedRoute allowedRoles={['mentor']}><MentorLayout><MentorRequests /></MentorLayout></ProtectedRoute>} />
      <Route path="/mentor/messages" element={<ProtectedRoute allowedRoles={['mentor']}><MentorLayout><MentorMessages /></MentorLayout></ProtectedRoute>} />

      {/* ── Protected Team Member Routes (Requires Team Role + Login) ── */}
      <Route path="/team/dashboard" element={<ProtectedRoute allowedRoles={['team', 'teammember']}><TeamLayout><TeamDashboard /></TeamLayout></ProtectedRoute>} />
      <Route path="/team/profile" element={<ProtectedRoute allowedRoles={['team', 'teammember']}><TeamLayout><TeamProfile /></TeamLayout></ProtectedRoute>} />
      <Route path="/team/skills" element={<ProtectedRoute allowedRoles={['team', 'teammember']}><TeamLayout><Skills /></TeamLayout></ProtectedRoute>} />
      <Route path="/team/listings" element={<ProtectedRoute allowedRoles={['team', 'teammember']}><TeamLayout><TeamStartupListings /></TeamLayout></ProtectedRoute>} />
      <Route path="/team/listing/:id" element={<ProtectedRoute allowedRoles={['team', 'teammember']}><TeamLayout><TeamStartupDetails /></TeamLayout></ProtectedRoute>} />
      <Route path="/team/matches" element={<ProtectedRoute allowedRoles={['team', 'teammember']}><TeamLayout><TeamMatches /></TeamLayout></ProtectedRoute>} />
      <Route path="/team/connections" element={<ProtectedRoute allowedRoles={['team', 'teammember']}><TeamLayout><TeamConnections /></TeamLayout></ProtectedRoute>} />
      <Route path="/team/requests" element={<ProtectedRoute allowedRoles={['team', 'teammember']}><TeamLayout><TeamRequests /></TeamLayout></ProtectedRoute>} />
      <Route path="/team/messages" element={<ProtectedRoute allowedRoles={['team', 'teammember']}><TeamLayout><TeamMessages /></TeamLayout></ProtectedRoute>} />

      {/* ── Protected Admin Routes (Requires Admin Role + Login) ── */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/manage-users" element={<ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>} />
      <Route path="/admin/manage-listings" element={<ProtectedRoute allowedRoles={['admin']}><ManageListings /></ProtectedRoute>} />
      <Route path="/admin/manage-reports" element={<ProtectedRoute allowedRoles={['admin']}><ManageReports /></ProtectedRoute>} />

      {/* ── Fallback Route ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
