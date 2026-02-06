import React from 'react';
import { ClipboardList } from 'lucide-react';

interface EmptyStateProps {
    message?: string;
    subMessage?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    message = "No tasks yet",
    subMessage = "Click 'Add Task' above to get started."
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
            <div className="bg-muted p-4 rounded-full mb-4">
                <ClipboardList className="text-muted-foreground w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{message}</h3>
            <p className="text-muted-foreground max-w-sm">{subMessage}</p>
        </div>
    );
};
