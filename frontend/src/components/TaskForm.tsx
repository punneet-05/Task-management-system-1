import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema } from '@/utils/validations';
import { z } from 'zod';
import { Task } from '@/types';

export type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
    initialData?: Task;
    onSubmit: (data: TaskFormData) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel, loading }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: '',
            description: '',
            status: 'pending',
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                title: initialData.title,
                description: initialData.description || '',
                status: initialData.status,
            });
        } else {
            reset({
                title: '',
                description: '',
                status: 'pending',
            });
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                <input
                    {...register('title')}
                    className="w-full bg-background border border-input px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-all placeholder:text-muted-foreground"
                    placeholder="Task title..."
                />
                {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea
                    {...register('description')}
                    className="w-full bg-background border border-input px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-input min-h-[100px] transition-all placeholder:text-muted-foreground"
                    placeholder="Task details..."
                />
                {errors.description && <p className="text-destructive text-xs mt-1">{errors.description.message}</p>}
            </div>

            {initialData && (
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                    <select
                        {...register('status')}
                        className="w-full bg-background border border-input px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-all"
                    >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50 shadow-sm"
                >
                    {loading ? 'Saving...' : initialData ? 'Update Task' : 'Create Task'}
                </button>
            </div>
        </form>
    );
};
