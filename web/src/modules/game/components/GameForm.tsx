import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Group, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { UseFormReturnType } from '@mantine/form/lib/use-form';
import { Signature } from 'tabler-icons-react';
import { z } from 'zod';

import { Game } from '../../../api/game';
import { getImageFromUrl } from '../../../api/utils/image.utils';
import { ImageUpload } from '../../../components/ImageUpload';

const schema = z.object({
  name: z.string(),
  poster: z.instanceof(File, 'Please upload a file'),
});

export type GameFormValues = z.infer<typeof schema>;
export type GameFormState = UseFormReturnType<GameFormValues>;
export type GameFormProps = {
  game?: Game | null;
  disabled?: boolean;
  onSubmit?: (data: GameFormValues, form: GameFormState) => void | Promise<void>;
};

export function GameForm({ game, disabled, onSubmit }: GameFormProps) {
  const form = useForm<GameFormValues>({
    schema: zodResolver(schema),
    initialValues: {
      name: '',
      poster: {} as File,
    },
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (data: GameFormValues) => {
      if (!onSubmit) {
        return;
      }

      try {
        setLoading(true);
        await Promise.resolve(onSubmit(data, form as UseFormReturnType<GameFormValues>));
      } finally {
        setLoading(false);
      }
    },
    [form, onSubmit]
  );

  // https://github.com/mantinedev/mantine/pull/1422
  const formRef = useRef(form);
  useLayoutEffect(() => {
    formRef.current = form;
  }, [form]);

  useEffect(() => {
    if (game) {
      formRef.current.setFieldValue('name', game.name);
      getImageFromUrl(game.posterUrl).then(posterFile => {
        formRef.current.setFieldValue('poster', posterFile);
      });
    }
  }, [game]);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        data-autofocus
        required={!disabled}
        placeholder="The game name"
        label="Name"
        icon={<Signature size={18} />}
        disabled={disabled}
        {...form.getInputProps('name')}
      />
      <ImageUpload
        label="Poster"
        required={!disabled}
        disabled={disabled}
        {...form.getInputProps('poster')}
      />
      {!disabled && (
        <Group>
          <Button type="submit" mt="xl" loading={loading}>
            {game ? 'Update' : 'Create'}
          </Button>
          <Button
            type="button"
            mt="xl"
            loading={loading}
            variant="subtle"
            component={Link}
            to="/games"
          >
            Cancel
          </Button>
        </Group>
      )}
    </form>
  );
}
