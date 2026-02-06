import React from 'react';
import { Task } from '@/types';
import { format } from 'date-fns';
import { Pencil, Trash2, CheckCircle, Circle, Calendar } from 'lucide-react';
import clsx from 'clsx';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onToggle: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onToggle }) => {
    const isCompleted = task.status === 'completed';

    return (
        <div className={clsx(
            "group relative p-5 rounded-xl border transition-all duration-200",
            "hover:shadow-md dark:hover:shadow-none dark:hover:bg-accent/50",
            isCompleted
                ? "bg-muted/30 border-transparent"
                : "bg-card border-border shadow-sm"
        )}>
            <div className="flex gap-4">
                <button
                    onClick={() => onToggle(task.id)}
                    className={clsx(
                        "mt-1 flex-shrink-0 transition-colors focus:outline-none",
                        isCompleted ? "text-success" : "text-muted-foreground hover:text-primary"
                    )}
                    aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                >
                    {isCompleted ? (
                        <CheckCircle size={22} className="fill-current" />
                    ) : (
                        <Circle size={22} />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <h3 className={clsx(
                        "font-semibold text-lg leading-snug mb-1 transition-colors",
                        isCompleted ? "text-muted-foreground line-through decoration-muted-foreground/50" : "text-foreground"
                    )}>
                        {task.title}
                    </h3>

                    {task.description && (
                        <p className={clsx(
                            "text-sm mb-3 line-clamp-2",
                            isCompleted ? "text-muted-foreground/70" : "text-muted-foreground"
                        )}>
                            {task.description}
                        </p>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar size={14} className="opacity-70" />
                        <span>{format(new Date(task.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                        title="Edit"
                        aria-label="Edit task"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                        title="Delete"
                        aria-label="Delete task"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
