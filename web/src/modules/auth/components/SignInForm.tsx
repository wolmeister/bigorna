import { Anchor, Button, Group, Paper, PasswordInput, Text, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import React, { useCallback, useState } from 'react';
import { Lock, Mail } from 'tabler-icons-react';
import { z } from 'zod';

import { authService } from '../../../api';
import { HttpError } from '../../../api/http-client';
import { setToken, setUser } from '../stores/auth-store';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, { message: 'Password should be at least 6 characters long' }),
});

type FormValues = z.infer<typeof schema>;

interface SignInFormProps {
  onGoToSignUp: () => void;
  onClose: () => void;
}

export function SignInForm({ onGoToSignUp, onClose }: SignInFormProps) {
  const form = useForm<FormValues>({
    schema: zodResolver(schema),
    initialValues: {
      email: '',
      password: '',
    },
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (data: FormValues) => {
      try {
        setError(null);
        const res = await authService.authenticate(data);
        setToken(res.token);
        setUser(res.user);
        onClose();
        showNotification({
          title: 'Success',
          message: 'You have been successfully signed in!',
        });
      } catch (err) {
        if (err instanceof HttpError) {
          if (err.error.code === 'USER_NOT_FOUND') {
            setError('User not found');
          } else {
            setError('Invalid password');
          }
        } else {
          setError('Unknown error');
        }
      }
    },
    [onClose]
  );

  return (
    <Paper>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          data-autofocus
          required
          placeholder="Your email"
          label="Email"
          icon={<Mail size={18} />}
          {...form.getInputProps('email')}
        />
        <PasswordInput
          mt="md"
          required
          placeholder="Password"
          label="Password"
          icon={<Lock size={18} />}
          {...form.getInputProps('password')}
        />
        {error && (
          <Text color="red" size="sm" mt="md">
            {error}
          </Text>
        )}
        <Group position="apart" mt="xl">
          <Anchor component="button" type="button" color="gray" size="sm" onClick={onGoToSignUp}>
            Don't have an account? Register
          </Anchor>
          <Button type="submit">Login</Button>
        </Group>
      </form>
    </Paper>
  );
}
