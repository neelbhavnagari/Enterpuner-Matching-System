import { loginApi, registerApi, googleAuthApi } from './apiClient';

export const authService = {
  login: async (email, password) => {
    return await loginApi(email, password);
  },
  register: async (userData) => {
    return await registerApi(userData);
  },
  googleAuth: async (payload) => {
    return await googleAuthApi(payload);
  },
  forgotPassword: async (email) => {
    // Simulated endpoint for password reset
    return { success: true, message: `Password reset instructions sent to ${email}` };
  }
};

export default authService;
