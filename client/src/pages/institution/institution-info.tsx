import { ErrorAlert } from '@/components/common/error-alert';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { getInstitutionDetails, updateInstitution } from '@/services/api';
import { Institution } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const workingHoursSchema = z.object({
  isOpen: z.boolean(),
  openTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  closeTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
});

const institutionFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  entryFee: z.coerce.number().min(0, 'Entry fee cannot be negative'),
  location: z.object({
    address: z.string().min(5, 'Address must be at least 5 characters'),
  }),
  workingHours: z.object({
    monday: workingHoursSchema,
    tuesday: workingHoursSchema,
    wednesday: workingHoursSchema,
    thursday: workingHoursSchema,
    friday: workingHoursSchema,
    saturday: workingHoursSchema,
    sunday: workingHoursSchema,
  }),
});

type InstitutionFormValues = z.infer<typeof institutionFormSchema>;

export const InstitutionInfo: React.FC = () => {
  const { user } = useAuth();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<InstitutionFormValues>({
    resolver: zodResolver(institutionFormSchema),
    defaultValues: {
      name: '',
      description: '',
      entryFee: 0,
      location: {
        address: '',
      },
      workingHours: {
        monday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
        tuesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
        wednesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
        thursday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
        friday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
        saturday: { isOpen: true, openTime: '10:00', closeTime: '16:00' },
        sunday: { isOpen: false, openTime: '10:00', closeTime: '16:00' },
      },
    },
  });

  useEffect(() => {
    if (user?.id) {
      fetchInstitution();
    }
  }, [user?.id]);

  const fetchInstitution = async () => {
    try {
      setLoading(true);
      const response = await getInstitutionDetails(user!.id);
      const institutionData = response.data;
      setInstitution(institutionData);

      // Reset form with fetched data
      form.reset({
        name: institutionData.name,
        description: institutionData.description,
        entryFee: institutionData.entryFee,
        location: {
          address: institutionData.location.address,
        },
        workingHours: institutionData.workingHours,
      });
    } catch (err) {
      setError('Failed to load institution information. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: InstitutionFormValues) => {
    if (!user?.id) return;

    setSubmitting(true);
    try {
      await updateInstitution(user.id, {
        name: data.name,
        description: data.description,
        entryFee: data.entryFee,
        location: {
          ...institution!.location,
          address: data.location.address,
        },
        workingHours: data.workingHours,
      });

      toast({
        title: 'Information Updated',
        description: 'Your institution information has been successfully updated',
      });
    } catch (err) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update institution information. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
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
        title="Institution Information"
        description="Manage your institution's details and working hours"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={5} {...field} />
                    </FormControl>
                    <FormDescription>
                      Describe your institution, its history, and what visitors can expect.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="entryFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entry Fee (TND)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Working Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => (
                  <div key={day}>
                    <h3 className="font-medium capitalize mb-2">{day}</h3>
                    <div className="grid gap-4 items-center sm:grid-cols-3">
                      <FormField
                        control={form.control}
                        name={`workingHours.${day}.isOpen`}
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-x-2 rounded-md border p-3">
                            <FormLabel>Open</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`workingHours.${day}.openTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Opening Time</FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                {...field}
                                disabled={!form.watch(`workingHours.${day}.isOpen`)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`workingHours.${day}.closeTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Closing Time</FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                {...field}
                                disabled={!form.watch(`workingHours.${day}.isOpen`)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {day !== 'sunday' && <Separator className="mt-2" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};