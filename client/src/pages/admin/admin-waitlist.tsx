import { ErrorAlert } from '@/components/common/error-alert';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { approveInstitution, getPendingInstitutions, rejectInstitution } from '@/services/api';
import { Institution } from '@/types';
import { CheckIcon, EyeIcon, XIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const AdminWaitlist: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const response = await getPendingInstitutions();
      setInstitutions(response.data);
    } catch (err) {
      setError('Failed to load pending institutions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (institution: Institution) => {
    setSelectedInstitution(institution);
  };

  const closeDialog = () => {
    setSelectedInstitution(null);
  };

  const handleApprove = async (id: string) => {
    try {
      setProcessingId(id);
      await approveInstitution(id);

      // Update the institutions list
      setInstitutions(institutions.filter(inst => inst.id !== id));

      // Show success message
      toast({
        title: "Institution Approved",
        description: "The institution has been approved successfully",
      });

      // Close dialog if open
      if (selectedInstitution?.id === id) {
        closeDialog();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to approve institution. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setProcessingId(id);
      await rejectInstitution(id);

      // Update the institutions list
      setInstitutions(institutions.filter(inst => inst.id !== id));

      // Show success message
      toast({
        title: "Institution Rejected",
        description: "The institution has been rejected",
      });

      // Close dialog if open
      if (selectedInstitution?.id === id) {
        closeDialog();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to reject institution. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
        title="Institution Waitlist"
        description="Review and approve pending institution applications"
      />

      {institutions.length === 0 ? (
        <div className="text-center p-10 border rounded-md bg-card">
          <p className="text-muted-foreground">No pending institutions</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {institutions.map((institution) => (
            <Card key={institution.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div
                  className="h-40 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${institution.images[0] ||
                      'https://images.pexels.com/photos/1738931/pexels-photo-1738931.jpeg'
                      })`,
                  }}
                />
                <div className="p-4">
                  <h3 className="font-bold truncate">{institution.name}</h3>
                  <p className="text-sm text-muted-foreground">{institution.city}</p>
                  <p className="text-sm mt-1">
                    Registered: {formatDate(institution.registrationDate)}
                  </p>
                  <div className="mt-4 flex justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(institution)}
                    >
                      <EyeIcon className="h-4 w-4 mr-1" /> Details
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(institution.id)}
                        disabled={processingId === institution.id}
                      >
                        <CheckIcon className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(institution.id)}
                        disabled={processingId === institution.id}
                      >
                        <XIcon className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={!!selectedInstitution} onOpenChange={closeDialog}>
        {selectedInstitution && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedInstitution.name}</DialogTitle>
              <DialogDescription>
                {selectedInstitution.city} - Entry Fee: {selectedInstitution.entryFee} TND
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold">Description</h4>
                <p className="text-sm mt-1">{selectedInstitution.description}</p>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold">Location</h4>
                <p className="text-sm mt-1">{selectedInstitution.location.address}</p>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold">Registration Date</h4>
                <p className="text-sm mt-1">
                  {formatDate(selectedInstitution.registrationDate)}
                </p>
              </div>
            </div>
            <DialogFooter className="flex justify-end gap-2 sm:justify-end">
              <Button
                variant="outline"
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReject(selectedInstitution.id)}
                disabled={processingId === selectedInstitution.id}
              >
                <XIcon className="h-4 w-4 mr-1" /> Reject
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleApprove(selectedInstitution.id)}
                disabled={processingId === selectedInstitution.id}
              >
                <CheckIcon className="h-4 w-4 mr-1" /> Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};