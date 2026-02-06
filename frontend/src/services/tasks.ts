import api from '../utils/api';
import { Task, TaskResponse, TaskFilters } from '../types';

export const taskService = {
    getTasks: async (filters: TaskFilters = {}): Promise<TaskResponse> => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const { data } = await api.get<TaskResponse>(`/tasks?${params.toString()}`);
        return data;
    },

    createTask: async (task: { title: string; description?: string; status?: string }): Promise<Task> => {
        const { data } = await api.post<Task>('/tasks', task);
        return data;
    },

    updateTask: async (id: string, task: { title?: string; description?: string; status?: string }): Promise<Task> => {
        const { data } = await api.patch<Task>(`/tasks/${id}`, task);
        return data;
    },

    deleteTask: async (id: string): Promise<void> => {
        await api.delete(`/tasks/${id}`);
    },

    toggleStatus: async (id: string): Promise<Task> => {
        const { data } = await api.patch<Task>(`/tasks/${id}/toggle`);
        return data;
    },
};
