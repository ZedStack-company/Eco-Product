import { useState, useEffect, useCallback } from 'react';
import { adminService } from '@/services/adminService';
import { AdminUser, AdminCredentials } from '@/types/admin';

export const useAdmin = () => {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load admin state from localStorage on mount
  useEffect(() => {
    let isMounted = true;

    const initAdmin = async () => {
      try {
        // Simulate async to prevent race conditions
        const storedAdmin = await Promise.resolve(adminService.getCurrentAdmin());
        if (isMounted) {
          setCurrentAdmin(storedAdmin);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAdmin();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: AdminCredentials): Promise<boolean> => {
    const admin = await adminService.authenticate(credentials);
    if (admin?.isAuthenticated) {
      setCurrentAdmin(admin);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    adminService.logout();
    setCurrentAdmin(null);
  }, []);

  const isAuthenticated = Boolean(currentAdmin?.isAuthenticated);

  return {
    currentAdmin,
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};
