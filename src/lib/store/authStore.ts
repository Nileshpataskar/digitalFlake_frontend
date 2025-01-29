// store/authStore.ts
import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean; // Login state
  token: string | null;

  logIn: () => void; // Function to log in
  logOut: () => void; // Function to log out
  setToken: (token: string | null) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false, // Initial login state
  token: "",

  logIn: () => set({ isLoggedIn: true }), // Function to log in
  logOut: () => set({ isLoggedIn: false }), // Function to log out
  setToken: (token) => set({ token: token }),
}));

export default useAuthStore;
