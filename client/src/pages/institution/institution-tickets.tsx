import { ErrorAlert } from '@/components/common/error-alert';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import {
  createTicket,
  deleteTicket,
  getTickets,
  updateTicket,
} from '@/services/api';
import { Ticket } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { PencilIcon, PlusIcon, TicketIcon, TrashIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ticketFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  isActive: z.boolean().default(true),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

export const InstitutionTickets: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTicketId, setCurrentTicketId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (user?.id) {
      fetchTickets();
    }
  }, [user?.id]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await getTickets(user!.id);
      setTickets(response.data);
    } catch (err) {
      setError('Failed to load tickets. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    form.reset({
      name: '',
      price: 0,
      description: '',
      isActive: true,
    });
    setEditMode(false);
    setCurrentTicketId(null);
    setFormOpen(true);
  };

  const openEditForm = (ticket: Ticket) => {
    form.reset({
      name: ticket.name,
      price: ticket.price,
      description: ticket.description,
      isActive: ticket.isActive,
    });
    setEditMode(true);
    setCurrentTicketId(ticket.id);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
  };

  const openDeleteDialog = (id: string) => {
    setTicketToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setTicketToDelete(null);
  };

  const onSubmit = async (data: TicketFormValues) => {
    if (!user?.id) return;

    setSubmitting(true);
    try {
      if (editMode && currentTicketId) {
        await updateTicket(user.id, currentTicketId, data);

        // Update local state
        setTickets(
          tickets.map((ticket) =>
            ticket.id === currentTicketId
              ? {
                ...ticket,
                ...data,
              }
              : ticket
          )
        );

        toast({
          title: 'Ticket Updated',
          description: 'Your ticket has been successfully updated.',
        });
      } else {
        const response = await createTicket(user.id, data);

        // Add to local state
        setTickets([response.data, ...tickets]);

        toast({
          title: 'Ticket Created',
          description: 'Your new ticket has been successfully created.',
        });
      }

      closeForm();
    } catch (err) {
      toast({
        title: editMode ? 'Update Failed' : 'Creation Failed',
        description: `Failed to ${editMode ? 'update' : 'create'
          } ticket. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.id || !ticketToDelete) return;

    try {
      await deleteTicket(user.id, ticketToDelete);

      // Update local state
      setTickets(tickets.filter((ticket) => ticket.id !== ticketToDelete));

      toast({
        title: 'Ticket Deleted',
        description: 'The ticket has been successfully deleted.',
      });
    } catch (err) {
      toast({
        title: 'Deletion Failed',
        description: 'Failed to delete ticket. Please try again.',
        variant: 'destructive',
      });
    } finally {
      closeDeleteDialog();
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
        title="Tickets Management"
        description="Create and manage entry tickets for your institution"
      >
        <Button onClick={openCreateForm}>
          <PlusIcon className="mr-2 h-4 w-4" /> New Ticket
        </Button>
      </PageHeader>

      {tickets.length === 0 ? (
        <div className="text-center p-10 border rounded-md bg-card">
          <p className="text-muted-foreground">No tickets yet</p>
          <Button variant="outline" className="mt-4" onClick={openCreateForm}>
            Create your first ticket
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <TicketIcon className="h-4 w-4 mr-2 text-primary" />
                    <CardTitle className="text-lg">{ticket.name}</CardTitle>
                  </div>
                  <Badge variant={ticket.isActive ? "default" : "outline"} className={ticket.isActive ? "bg-green-500" : ""}>
                    {ticket.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold mb-2">{ticket.price.toFixed(2)} TND</div>
                <p className="text-sm text-muted-foreground">{ticket.description}</p>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditForm(ticket)}
                >
                  <PencilIcon className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDeleteDialog(ticket.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <TrashIcon className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Ticket Dialog */}
      <Dialog open={formOpen} onOpenChange={closeForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editMode ? 'Edit Ticket' : 'Create Ticket'}
            </DialogTitle>
            <DialogDescription>
              {editMode
                ? 'Make changes to your ticket here'
                : 'Create a new ticket for your visitors'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter ticket name" />
                    </FormControl>
                    <FormDescription>
                      e.g., "Adult Admission", "Student Ticket", etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (TND)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter ticket price"
                      />
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
                      <Textarea
                        {...field}
                        placeholder="Enter ticket description"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Make this ticket available for purchase
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? editMode
                      ? 'Updating...'
                      : 'Creating...'
                    : editMode
                      ? 'Update'
                      : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              ticket.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};