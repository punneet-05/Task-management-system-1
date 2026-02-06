'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { taskService } from '@/services/tasks';
import { Task, TaskFilters } from '@/types';
import { TaskCard } from '@/components/TaskCard';
import { Modal } from '@/components/Modal';
import { TaskForm, TaskFormData } from '@/components/TaskForm';
import { Plus, Search, LogOut, Loader2, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { EmptyState } from '@/components/EmptyState';
import clsx from 'clsx';

export default function DashboardPage() {
    const { isAuthenticated, logoutFn, loading: authLoading } = useAuth();
    const router = useRouter();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<TaskFilters>({ page: 1, limit: 10, search: '', status: '' });
    const [totalPages, setTotalPages] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [saving, setSaving] = useState(false);

    // Auth Guard effect
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [authLoading, isAuthenticated, router]);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const data = await taskService.getTasks(filters);
            setTasks(data.tasks);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchTasks();
        }
    }, [isAuthenticated, fetchTasks]);

    const handleCreate = () => {
        setEditingTask(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.deleteTask(id);
                fetchTasks();
            } catch (error) {
                alert('Failed to delete task');
            }
        }
    };

    const handleToggle = async (id: string) => {
        try {
            await taskService.toggleStatus(id);
            fetchTasks();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handleSubmit = async (data: TaskFormData) => {
        setSaving(true);
        try {
            if (editingTask) {
                await taskService.updateTask(editingTask.id, data);
            } else {
                await taskService.createTask(data);
            }
            setIsModalOpen(false);
            fetchTasks();
        } catch (error) {
            alert('Failed to save task');
        } finally {
            setSaving(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
    };

    const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }));
    };

    if (authLoading) return <div className="h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-primary" size={40} /></div>;
    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
            {/* Header */}
            <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <div className="w-4 h-4 rounded-sm bg-primary" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">TaskFlow</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <div className="h-6 w-px bg-border mx-1" />
                        <button
                            onClick={logoutFn}
                            className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors text-sm font-medium px-2 py-1.5 rounded-md hover:bg-destructive/10"
                            title="Logout"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8">

                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold text-foreground">My Tasks</h2>
                    <p className="text-muted-foreground">Manage your daily goals and track productivity.</p>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-7 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="w-full pl-10 pr-4 py-2.5 bg-card border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground shadow-sm transition-all hover:border-primary/50"
                            value={filters.search}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="sm:col-span-3 relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <select
                            className="w-full pl-9 pr-4 py-2.5 bg-card border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground shadow-sm appearance-none cursor-pointer hover:border-primary/50"
                            value={filters.status}
                            onChange={handleStatusFilter}
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <button
                            onClick={handleCreate}
                            className="w-full h-full min-h-[42px] flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95 font-medium"
                        >
                            <Plus size={20} />
                            <span className="hidden sm:inline lg:hidden xl:inline">Add</span>
                            <span className="sm:hidden lg:inline xl:hidden">Add Task</span>
                        </button>
                    </div>
                </div>

                {/* Task Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-primary" size={40} />
                    </div>
                ) : tasks.length === 0 ? (
                    <EmptyState
                        message={filters.search || filters.status ? "No matches found" : "No tasks yet"}
                        subMessage={filters.search || filters.status ? "Try adjusting your filters" : "Create a task to get started on your day."}
                    />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                        {tasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onToggle={handleToggle}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {tasks.length > 0 && (
                    <div className="flex justify-center mt-8 gap-2">
                        <button
                            disabled={filters.page === 1}
                            onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                            className="px-4 py-2 border border-input bg-card rounded-lg hover:bg-accent disabled:opacity-50 disabled:hover:bg-card transition text-foreground"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-muted-foreground flex items-center">
                            Page {filters.page} of {totalPages}
                        </span>
                        <button
                            disabled={filters.page === totalPages}
                            onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                            className="px-4 py-2 border border-input bg-card rounded-lg hover:bg-accent disabled:opacity-50 disabled:hover:bg-card transition text-foreground"
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTask ? 'Edit Task' : 'Create New Task'}
            >
                <TaskForm
                    initialData={editingTask}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                    loading={saving}
                />
            </Modal>
        </div>
    );
}
