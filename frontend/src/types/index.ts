export interface User {
    id: string;
    email: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'completed';
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
}

export interface TaskResponse {
    tasks: Task[];
    total: number;
    page: number;
    totalPages: number;
}

export interface TaskFilters {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
}
