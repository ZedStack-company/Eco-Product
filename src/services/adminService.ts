import { AdminCredentials, AdminUser } from '@/types/admin';

const ADMIN_CREDENTIALS = {
  username: 'ZedStack@company',
  password: 'zed$Tack'
};

class AdminService {
  private currentAdmin: AdminUser | null = null;

  authenticate(credentials: AdminCredentials): AdminUser | null {
    if (
      credentials.username === ADMIN_CREDENTIALS.username &&
      credentials.password === ADMIN_CREDENTIALS.password
    ) {
      this.currentAdmin = {
        id: 'admin-1',
        username: credentials.username,
        isAuthenticated: true
      };

      // Store in localStorage for persistence
      localStorage.setItem('admin_user', JSON.stringify(this.currentAdmin));
      return this.currentAdmin;
    }
    return null;
  }

getCurrentAdmin(): AdminUser | null {
  if (this.currentAdmin) return this.currentAdmin;

  const stored = localStorage.getItem('admin_user');
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as AdminUser;
      if (parsed.isAuthenticated && parsed.username === 'ZedStack@company') {
        this.currentAdmin = parsed;
        return parsed;
      }
    } catch {
      localStorage.removeItem('admin_user');
    }
  }
  return null;
}


  isAuthenticated(): boolean {
    const admin = this.getCurrentAdmin();
    return admin?.isAuthenticated || false;
  }

  logout(): void {
    this.currentAdmin = null;
    localStorage.removeItem('admin_user');
  }
}

export const adminService = new AdminService();
