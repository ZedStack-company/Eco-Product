// services/adminService.ts
import { AdminCredentials, AdminUser } from "@/types/admin";

const ADMIN_CREDENTIALS = {
  username: "ZedStack@company",
  password: "zed$Tack",
};

const ADMIN_STORAGE_KEY = "admin_user";

class AdminService {
  private currentAdmin: AdminUser | null = null;

  authenticate(credentials: AdminCredentials): AdminUser | null {
    if (
      credentials.username === ADMIN_CREDENTIALS.username &&
      credentials.password === ADMIN_CREDENTIALS.password
    ) {
      this.currentAdmin = {
        id: "admin-1",
        username: credentials.username,
        isAuthenticated: true,
      };
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(this.currentAdmin));
      return this.currentAdmin;
    }
    return null;
  }

  getCurrentAdmin(): AdminUser | null {
    if (this.currentAdmin) return this.currentAdmin;

    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AdminUser;
        if (parsed.isAuthenticated) {
          this.currentAdmin = parsed;
          return parsed;
        }
      } catch {
        localStorage.removeItem(ADMIN_STORAGE_KEY);
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return Boolean(this.getCurrentAdmin()?.isAuthenticated);
  }

  logout(): void {
    this.currentAdmin = null;
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  }
}

export const adminService = new AdminService();
