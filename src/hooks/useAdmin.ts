import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { AdminUser, AdminCredentials } from '@/types/admin';

export const useAdmin = () => {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const admin = adminService.getCurrentAdmin();
    setCurrentAdmin(admin);
    setIsLoading(false);
  }, []);

  const login = (credentials: AdminCredentials): boolean => {
    const admin = adminService.authenticate(credentials);
    if (admin) {
      setCurrentAdmin(admin);
      return true;
    }
    return false;
  };

  const logout = () => {
    adminService.logout();
    setCurrentAdmin(null);
  };

  const isAuthenticated = currentAdmin?.isAuthenticated || false;

  return {
    currentAdmin,
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};