import React from 'react';
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

interface ErrorAlertProps {
  title?: string;
  description: string;
  className?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'Error',
  description,
  className,
}) => {
  return (
    <Alert variant="destructive" className={className}>
      <AlertCircleIcon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};