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

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: '/',
      },
      {
        onSuccess: () => {
          router.push('/');
          toast.success('Logged in successfully!');
        },
        onError: (ctx) => {
          toast.error(
            ctx.error.message || 'An error occurred during registration.',
          );
        },
      },
    );
  };
  const isPending = form.formState.isSubmitting;

  return (
    <div>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Welcome Back !</CardTitle>
          <CardDescription>Login To Continue</CardDescription>
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
                          placeholder='Enter your password'
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
                  Login
                </Button>
              </div>
              <div className='text-center text-sm'>
                Don&apos;t have an account?{' '}
                <Link href='/signup' className='underline underline-offset-4'>
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
