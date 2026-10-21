import { create } from 'zustand';

// Helper to safely load initial stored user from localStorage
const loadInitialUser = () => {
  try {
    const storedUser = localStorage.getItem('ems_user');
    if (storedUser) return JSON.parse(storedUser);
  } catch (e) {
    console.error('Error reading user from localStorage:', e);
  }
  return null;
};

const initialUser = loadInitialUser();

/**
 * Client-side lightweight state management store using Zustand.
 * Manages active user sessions, UI theme toggles, and view preferences.
 */
export const useClientStore = create((set, get) => ({
  // Active User Session State
  user: initialUser,
  isAuthenticated: !!initialUser,
  token: localStorage.getItem('ems_auth_token') || null,

  login: (userData, token) => {
    try {
      localStorage.setItem('ems_user', JSON.stringify(userData));
      if (token) localStorage.setItem('ems_auth_token', token);
    } catch (e) {
      console.error('Error saving session to localStorage:', e);
    }
    set({
      user: userData,
      token: token || get().token,
      isAuthenticated: true,
      authModalOpen: false
    });
  },

  logout: () => {
    try {
      localStorage.removeItem('ems_user');
      localStorage.removeItem('ems_auth_token');
    } catch (e) {
      console.error('Error clearing session from localStorage:', e);
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  },

  // Auth Modal State
  authModalOpen: false,
  authModalMode: 'login',
  openAuthModal: (mode = 'login') => set({ authModalOpen: true, authModalMode: mode }),
  closeAuthModal: () => set({ authModalOpen: false }),

  updateUser: (updatedData) =>
    set((state) => {
      const nextUser = state.user ? { ...state.user, ...updatedData } : null;
      if (nextUser) {
        try {
          localStorage.setItem('ems_user', JSON.stringify(nextUser));
        } catch (e) {}
      }
      return { user: nextUser };
    }),

  // UI Theme State ('dark' | 'light')
  theme: 'dark',

  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    set({ theme: nextTheme });
  },

  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },

  // Active Navigation & View State
  activeTab: 'matches',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Open a chat with a specific connected user
  chatWithUser: null,
  openChatWith: (user) => set({ activeTab: 'messages', chatWithUser: user }),
  clearChatWithUser: () => set({ chatWithUser: null }),

  sidebarOpen: false, // For mobile drawer
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  sidebarCollapsed: false, // For desktop icon-only mode
  toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));

export default useClientStore;
