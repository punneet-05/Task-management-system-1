import api from '../utils/api';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types';

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/auth/login', credentials);
        return data;
    },

    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/auth/register', credentials);
        return data;
    },

    logout: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            await api.post('/auth/logout', { refreshToken });
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },
};
