import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Breadcrumbs, Button, Divider, Group, TextInput } from '@mantine/core';
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
  game?: Game;
  onSubmit: (data: GameFormValues, form: GameFormState) => void | Promise<void>;
};

export function GameForm({ game, onSubmit }: GameFormProps) {
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
      try {
        setLoading(true);
        await Promise.resolve(onSubmit(data, form as UseFormReturnType<GameFormValues>));
      } finally {
        setLoading(false);
      }
    },
    [form, onSubmit]
  );

  useEffect(() => {
    if (game) {
      form.setFieldValue('name', game.name);
      getImageFromUrl(game.posterUrl).then(posterFile => {
        form.setFieldValue('poster', posterFile);
      });
    }
  }, [form, game]);

  return (
    <>
      <Breadcrumbs>
        <Anchor component={Link} to="/">
          Home
        </Anchor>
        <Anchor component={Link} to="/games">
          Games
        </Anchor>
        <Anchor component={Link} to="/new-game">
          New Game
        </Anchor>
      </Breadcrumbs>
      <Divider mt="md" mb="md" />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          data-autofocus
          required
          placeholder="The game name"
          label="Name"
          icon={<Signature size={18} />}
          {...form.getInputProps('name')}
        />
        <ImageUpload label="Poster" required {...form.getInputProps('poster')} />
        <Group>
          <Button type="submit" mt="xl" loading={loading}>
            Create
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
      </form>
    </>
  );
}
