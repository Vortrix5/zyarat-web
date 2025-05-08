import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircleIcon } from 'lucide-react';
import React from 'react';

interface SuccessAlertProps {
    title?: string;
    description: string;
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({ title = "Success", description }) => {
    return (
        <Alert variant="default" className="bg-green-50 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400">
            <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    );
};
