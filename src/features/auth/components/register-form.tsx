'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { authClient } from '@/lib/auth-client';

const registerSchema = z
  .object({
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm Password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterFormData) => {
    await authClient.signUp.email(
      {
        name: values.email,
        email: values.email,
        password: values.password,
        callbackURL: '/',
      },
      {
        onSuccess: () => {
          router.push('/');
        },
        onError: (ctx) => {
          toast.error(
            ctx.error.message || 'An error occurred during registration.',
          );
        },
      },
    );
    toast.success('Account created successfully! Please log in.');
  };
  const isPending = form.formState.isSubmitting;

  return (
    <div>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Get Started !</CardTitle>
          <CardDescription>Create an account to continue</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid gap-6'>
              <div className='grid gap-6'>
                <FieldGroup>
                  <Controller
                    name='email'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Email</FieldLabel>
                        <Input
                          type='email'
                          placeholder='Enter your email'
                          {...field}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
                <FieldGroup>
                  <Controller
                    name='password'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Password</FieldLabel>
                        <Input
                          type='password'
                          placeholder='********'
                          {...field}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
                <FieldGroup>
                  <Controller
                    name='confirmPassword'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Confirm Password</FieldLabel>
                        <Input
                          type='password'
                          placeholder='********'
                          {...field}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
                <Button
                  type='submit'
                  disabled={isPending}
                  className={cn('w-full')}
                >
                  Create Account
                </Button>
              </div>
              <div className='text-center text-sm'>
                Already have an account?{' '}
                <Link href='/login' className='underline underline-offset-4'>
                  Log in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
