import { ErrorAlert } from '@/components/common/error-alert';
import { SuccessAlert } from '@/components/common/success-alert';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

const waitlistSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
});

type WaitlistFormValues = z.infer<typeof waitlistSchema>;

// TODO: Create this API service function
// import { addToWaitlist } from '@/services/api'; 

export const WaitlistPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<WaitlistFormValues>({
        resolver: zodResolver(waitlistSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: WaitlistFormValues) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // TODO: Implement API call to add to waitlist
            // const response = await addToWaitlist(data.email);
            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = { success: true, message: 'Successfully joined the waitlist!' }; // Simulated response

            if (response.success) {
                setSuccess(response.message || 'You have successfully joined the waitlist!');
                form.reset();
            } else {
                // setError(response.message || 'Failed to join the waitlist. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold">Join Our Waitlist</h1>
                <p className="text-muted-foreground text-sm">
                    Be the first to know when we launch. Enter your email below.
                </p>
            </div>

            {error && <ErrorAlert description={error} />}
            {success && <SuccessAlert description={success} />} {/* You might need to create SuccessAlert component */}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your email"
                                        type="email"
                                        autoComplete="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Submitting...' : 'Join Waitlist'}
                    </Button>
                </form>
            </Form>
            <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link to="/login" className="underline">
                    Login here
                </Link>
            </div>
        </div>
    );
};
