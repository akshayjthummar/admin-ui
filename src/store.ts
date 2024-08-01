import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Tenant {
  id: number;
  name: string;
  address: string;
}
export interface User {
  id: number;
  firstName: number;
  lastName: number;
  email: string;
  role: string;
  tenant: Tenant;
}
interface AuthState {
  user: null | User;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    setUser: (user) => set({ user: user }),
    logout: () => set({ user: null }),
  }))
);
