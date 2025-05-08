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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from '@/services/api';
import { Announcement } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const announcementFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
});

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

export const InstitutionAnnouncements: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAnnouncementId, setCurrentAnnouncementId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  useEffect(() => {
    if (user?.id) {
      fetchAnnouncements();
    }
  }, [user?.id]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await getAnnouncements(user!.id);
      setAnnouncements(response.data);
    } catch (err) {
      setError('Failed to load announcements. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    form.reset({ title: '', content: '' });
    setEditMode(false);
    setCurrentAnnouncementId(null);
    setFormOpen(true);
  };

  const openEditForm = (announcement: Announcement) => {
    form.reset({
      title: announcement.title,
      content: announcement.content,
    });
    setEditMode(true);
    setCurrentAnnouncementId(announcement.id);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
  };

  const openDeleteDialog = (id: string) => {
    setAnnouncementToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setAnnouncementToDelete(null);
  };

  const onSubmit = async (data: AnnouncementFormValues) => {
    if (!user?.id) return;

    setSubmitting(true);
    try {
      if (editMode && currentAnnouncementId) {
        await updateAnnouncement(user.id, currentAnnouncementId, data);

        // Update local state
        setAnnouncements(
          announcements.map((announcement) =>
            announcement.id === currentAnnouncementId
              ? {
                ...announcement,
                ...data,
                updatedAt: new Date().toISOString(),
              }
              : announcement
          )
        );

        toast({
          title: 'Announcement Updated',
          description: 'Your announcement has been successfully updated.',
        });
      } else {
        const response = await createAnnouncement(user.id, data);

        // Add to local state
        setAnnouncements([response.data, ...announcements]);

        toast({
          title: 'Announcement Created',
          description: 'Your new announcement has been successfully created.',
        });
      }

      closeForm();
    } catch (err) {
      toast({
        title: editMode ? 'Update Failed' : 'Creation Failed',
        description: `Failed to ${editMode ? 'update' : 'create'
          } announcement. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.id || !announcementToDelete) return;

    try {
      await deleteAnnouncement(user.id, announcementToDelete);

      // Update local state
      setAnnouncements(
        announcements.filter((announcement) => announcement.id !== announcementToDelete)
      );

      toast({
        title: 'Announcement Deleted',
        description: 'The announcement has been successfully deleted.',
      });
    } catch (err) {
      toast({
        title: 'Deletion Failed',
        description: 'Failed to delete announcement. Please try again.',
        variant: 'destructive',
      });
    } finally {
      closeDeleteDialog();
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
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
        title="Announcements"
        description="Manage announcements for your visitors"
      >
        <Button onClick={openCreateForm}>
          <PlusIcon className="mr-2 h-4 w-4" /> New Announcement
        </Button>
      </PageHeader>

      {announcements.length === 0 ? (
        <div className="text-center p-10 border rounded-md bg-card">
          <p className="text-muted-foreground">No announcements yet</p>
          <Button variant="outline" className="mt-4" onClick={openCreateForm}>
            Create your first announcement
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>{announcement.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditForm(announcement)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(announcement.id)}
                      className="text-destructive"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{announcement.content}</p>
              </CardContent>
              <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
                Published {formatDate(announcement.createdAt)}
                {announcement.updatedAt !== announcement.createdAt && (
                  <span className="ml-2">· Updated {formatDate(announcement.updatedAt)}</span>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Announcement Dialog */}
      <Dialog open={formOpen} onOpenChange={closeForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editMode ? 'Edit Announcement' : 'Create Announcement'}
            </DialogTitle>
            <DialogDescription>
              {editMode
                ? 'Make changes to your announcement here'
                : 'Create a new announcement for your visitors'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter announcement title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter announcement content"
                        rows={5}
                      />
                    </FormControl>
                    <FormMessage />
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
              announcement.
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