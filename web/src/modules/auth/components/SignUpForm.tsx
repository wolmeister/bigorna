import { Anchor, Button, Group, Paper, PasswordInput, Text, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import React, { useCallback, useState } from 'react';
import { Lock, Mail, User } from 'tabler-icons-react';
import { z } from 'zod';

import { authService, userService } from '../../../api';
import { HttpError } from '../../../api/http-client';
import { setToken, setUser } from '../stores/auth-store';

const schema = z.object({
  username: z.string(),
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, { message: 'Password should be at least 6 characters long' }),
});

type FormValues = z.infer<typeof schema>;

interface SignUpFormProps {
  onGoToSignIn: () => void;
  onClose: () => void;
}

export function SignUpForm({ onGoToSignIn, onClose }: SignUpFormProps) {
  const form = useForm<FormValues>({
    schema: zodResolver(schema),
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (data: FormValues) => {
      try {
        setLoading(true);
        setError(null);
        await userService.createUser(data);
        const res = await authService.authenticate(data);
        setToken(res.token);
        setUser(res.user);
        onClose();
        showNotification({
          title: 'Success',
          message: 'You have been successfully signed up!',
        });
      } catch (err) {
        if (err instanceof HttpError) {
          if (err.error.code === 'USER_EMAIL_NOT_UNIQUE') {
            setError('Email is not unique');
          } else {
            setError('Username is not unique');
          }
        } else {
          setError('Unknown error');
        }
      } finally {
        setLoading(false);
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
          placeholder="Your username"
          label="Username"
          icon={<User size={18} />}
          {...form.getInputProps('username')}
        />
        <TextInput
          required
          placeholder="Your email"
          label="Email"
          mt="md"
          icon={<Mail size={18} />}
          {...form.getInputProps('email')}
        />
        <PasswordInput
          required
          placeholder="Password"
          label="Password"
          mt="md"
          icon={<Lock size={18} />}
          {...form.getInputProps('password')}
        />
        {error && (
          <Text color="red" size="sm" mt="md">
            {error}
          </Text>
        )}
        <Group position="apart" mt="xl">
          <Anchor component="button" type="button" color="gray" size="sm" onClick={onGoToSignIn}>
            Have an account? Login
          </Anchor>
          <Button type="submit" loading={loading}>
            Register
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
