import { ErrorAlert } from '@/components/common/error-alert';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { getVerifiedInstitutions } from '@/services/api';
import { Institution } from '@/types';
import { EyeIcon, SearchIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const AdminVerifiedInstitutions: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await getVerifiedInstitutions();
        setInstitutions(response.data);
        setFilteredInstitutions(response.data);
      } catch (err) {
        setError('Failed to load verified institutions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  useEffect(() => {
    // Filter institutions based on search query
    if (searchQuery.trim() === '') {
      setFilteredInstitutions(institutions);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = institutions.filter(
        (institution) =>
          institution.name.toLowerCase().includes(query) ||
          institution.city.toLowerCase().includes(query)
      );
      setFilteredInstitutions(filtered);
    }
  }, [searchQuery, institutions]);

  const handleViewDetails = (institution: Institution) => {
    setSelectedInstitution(institution);
  };

  const closeDialog = () => {
    setSelectedInstitution(null);
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
        title="Verified Institutions"
        description="Browse and manage all verified cultural institutions"
      />

      <div className="mb-6 relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search by name or city..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredInstitutions.length === 0 ? (
        <div className="text-center p-10 border rounded-md bg-card">
          <p className="text-muted-foreground">No institutions found</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredInstitutions.map((institution) => (
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
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm font-medium">
                      TND {institution.entryFee}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(institution)}
                    >
                      <EyeIcon className="h-4 w-4 mr-1" /> Details
                    </Button>
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
                {selectedInstitution.city}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold">Description</h4>
                <p className="text-sm mt-1">{selectedInstitution.description}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h4 className="text-sm font-semibold">Entry Fee</h4>
                  <p className="text-sm mt-1">${selectedInstitution.entryFee}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Rating</h4>
                  <p className="text-sm mt-1">
                    {selectedInstitution.rating.toFixed(1)} / 5
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Total Visitors</h4>
                  <p className="text-sm mt-1">
                    {selectedInstitution.totalVisitors.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Verified Since</h4>
                  <p className="text-sm mt-1">
                    {formatDate(selectedInstitution.acceptanceDate || '')}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};