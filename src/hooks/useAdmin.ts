// hooks/useAdmin.ts
import { useState, useEffect, useCallback } from "react";
import { adminService } from "@/services/adminService";
import { AdminUser, AdminCredentials } from "@/types/admin";

export const useAdmin = () => {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const admin = adminService.getCurrentAdmin();
    setCurrentAdmin(admin);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: AdminCredentials) => {
    const admin = adminService.authenticate(credentials);
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
    logout,
  };
};
