import { useEffect } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { setupDatabase } from '@/lib/supabase';

const AdminPage = () => {
  const { isAuthenticated, isLoading } = useAdmin();

  useEffect(() => {
    // Initialize database when admin page loads
    setupDatabase();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please log in as admin to access this page.</p>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
};

export default AdminPage;