import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseListings from './pages/tenant/BrowseListings';
import ListingDetail from './pages/tenant/ListingDetail';
import MyVisits from './pages/tenant/MyVisits';
import Shortlist from './pages/tenant/Shortlist';
import CompareProperties from './pages/tenant/CompareProperties';
import MoveInChecklist from './pages/tenant/MoveInChecklist';
import MyLeases from './pages/tenant/MyLeases';
import SupportTickets from './pages/tenant/SupportTickets';
import TicketThread from './pages/tenant/TicketThread';
import AdminDashboard from './pages/admin/Dashboard';
import ListingsManagement from './pages/admin/ListingsManagement';
import ListingForm from './pages/admin/ListingForm';
import TicketsManagement from './pages/admin/TicketsManagement';
import VisitsManagement from './pages/admin/VisitsManagement';
import LeasesManagement from './pages/admin/LeasesManagement';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/listings" replace />} />
        <Route path="listings" element={<BrowseListings />} />
        <Route path="listings/:id" element={<ListingDetail />} />
        <Route path="visits" element={<MyVisits />} />
        <Route path="shortlist" element={<Shortlist />} />
        <Route path="compare" element={<CompareProperties />} />
        <Route path="leases" element={<MyLeases />} />
        <Route path="checklist/:leaseId" element={<MoveInChecklist />} />
        <Route path="tickets" element={<SupportTickets />} />
        <Route path="tickets/:id" element={<TicketThread />} />

        <Route
          path="admin"
          element={
            <ProtectedRoute roles={['admin', 'landlord']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/listings"
          element={
            <ProtectedRoute roles={['admin', 'landlord']}>
              <ListingsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/listings/new"
          element={
            <ProtectedRoute roles={['admin', 'landlord']}>
              <ListingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/listings/:id/edit"
          element={
            <ProtectedRoute roles={['admin', 'landlord']}>
              <ListingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/tickets"
          element={
            <ProtectedRoute roles={['admin', 'landlord']}>
              <TicketsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/visits"
          element={
            <ProtectedRoute roles={['admin', 'landlord']}>
              <VisitsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/leases"
          element={
            <ProtectedRoute roles={['admin', 'landlord']}>
              <LeasesManagement />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
