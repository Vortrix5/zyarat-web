import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, ClockIcon, AlertCircleIcon } from 'lucide-react';
import { getComplaints, resolveComplaint } from '@/services/api';
import { Complaint } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/common/page-header';
import { ErrorAlert } from '@/components/common/error-alert';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export const AdminComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState<Record<string, string>>({});
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await getComplaints();
      setComplaints(response.data);
    } catch (err) {
      setError('Failed to load complaints. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveComplaint = async (id: string) => {
    const resolution = resolutionText[id];
    if (!resolution || resolution.trim() === '') {
      toast({
        title: 'Resolution Required',
        description: 'Please provide a resolution message.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setProcessingId(id);
      await resolveComplaint(id, resolution);
      
      // Update the complaints list
      setComplaints(
        complaints.map((complaint) =>
          complaint.id === id
            ? { ...complaint, status: 'resolved', resolution, resolvedAt: new Date().toISOString() }
            : complaint
        )
      );
      
      // Reset resolution text
      setResolutionText((prev) => ({ ...prev, [id]: '' }));
      
      // Show success message
      toast({
        title: 'Complaint Resolved',
        description: 'The complaint has been successfully resolved.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to resolve complaint. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: Complaint['status']) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <ClockIcon className="mr-1 h-3 w-3" /> Pending
          </Badge>
        );
      case 'in-review':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            <AlertCircleIcon className="mr-1 h-3 w-3" /> In Review
          </Badge>
        );
      case 'resolved':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircleIcon className="mr-1 h-3 w-3" /> Resolved
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert description={error} />;
  }

  return (
    <div>
      <PageHeader
        title="User Complaints"
        description="Review and resolve user complaints about institutions"
      />

      {complaints.length === 0 ? (
        <div className="text-center p-10 border rounded-md bg-card">
          <p className="text-muted-foreground">No complaints found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {complaints.map((complaint) => (
            <Card
              key={complaint.id}
              className={cn(
                complaint.status === 'resolved' ? 'opacity-75' : '',
                'transition-all duration-200'
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{complaint.title}</CardTitle>
                  {getStatusBadge(complaint.status)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  <span>Filed on {formatDate(complaint.createdAt)}</span>
                  {complaint.resolvedAt && (
                    <span> · Resolved on {formatDate(complaint.resolvedAt)}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm mb-4">{complaint.description}</p>
                
                {complaint.resolution && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <h4 className="text-sm font-semibold">Resolution</h4>
                    <p className="text-sm mt-1">{complaint.resolution}</p>
                  </div>
                )}
                
                {complaint.status !== 'resolved' && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Resolution</h4>
                    <Textarea
                      placeholder="Enter resolution details..."
                      value={resolutionText[complaint.id] || ''}
                      onChange={(e) =>
                        setResolutionText((prev) => ({
                          ...prev,
                          [complaint.id]: e.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </div>
                )}
              </CardContent>
              {complaint.status !== 'resolved' && (
                <CardFooter className="pt-2">
                  <Button
                    className="ml-auto"
                    onClick={() => handleResolveComplaint(complaint.id)}
                    disabled={processingId === complaint.id}
                  >
                    <CheckCircleIcon className="mr-1 h-4 w-4" />
                    {processingId === complaint.id ? 'Resolving...' : 'Resolve Complaint'}
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};