import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Autocomplete, Button, Group, InputWrapper, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { UseFormReturnType } from '@mantine/form/lib/use-form';
import { RichTextEditor } from '@mantine/rte';
import { Signature } from 'tabler-icons-react';
import { z } from 'zod';

import { gameCategoryService, gameService } from '../../../api';
import { Addon } from '../../../api/addon';
import { getImageFromUrl } from '../../../api/utils/image.utils';
import { ImageUpload } from '../../../components/ImageUpload';

type AutocompleteItem = {
  id: string;
  value: string;
};

const schema = z.object({
  name: z.string(),
  description: z.string().min(1, 'Please fill the description'),
  game: z.object({
    id: z.string(),
    value: z.string(),
  }),
  gameCategory: z.object({
    id: z.string(),
    value: z.string(),
  }),
  poster: z.instanceof(File, 'Please upload a file'),
});

export type AddonFormValues = z.infer<typeof schema>;
export type AddonFormState = UseFormReturnType<AddonFormValues>;
export type AddonFormProps = {
  addon?: Addon | null;
  disabled?: boolean;
  onSubmit?: (data: AddonFormValues, form: AddonFormState) => void | Promise<void>;
};

export function AddonForm({ addon, disabled, onSubmit }: AddonFormProps) {
  // Form state
  const form = useForm<AddonFormValues>({
    schema: zodResolver(schema),
    initialValues: {
      name: addon ? addon.name : '',
      description: addon ? addon.description : '',
      game: { id: '', value: '' },
      gameCategory: { id: '', value: '' },
      poster: {} as File,
    },
  });

  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async (data: AddonFormValues) => {
      if (!onSubmit) {
        return;
      }

      try {
        setLoading(true);
        await Promise.resolve(onSubmit(data, form as UseFormReturnType<AddonFormValues>));
      } finally {
        setLoading(false);
      }
    },
    [form, onSubmit]
  );

  // // https://github.com/mantinedev/mantine/pull/1422
  const formRef = useRef(form);
  useLayoutEffect(() => {
    formRef.current = form;
  }, [form]);

  // Integrations
  const [games, setGames] = useState<AutocompleteItem[]>([]);
  useEffect(() => {
    gameService.findGames({}).then(result => {
      setGames(result.edges.map(edge => ({ id: edge.node.id, value: edge.node.name })));
    });
  }, []);

  const [categories, setCategories] = useState<AutocompleteItem[]>([]);
  useEffect(() => {
    if (!form.values.game.id) {
      setCategories([]);
      return;
    }

    gameCategoryService.findGameCategories({ gameId: form.values.game.id }).then(result => {
      setCategories(result.edges.map(edge => ({ id: edge.node.id, value: edge.node.name })));
    });
  }, [form.values.game.id]);

  useEffect(() => {
    if (addon) {
      formRef.current.setFieldValue('name', addon.name);
      formRef.current.setFieldValue('description', addon.description);
      gameService.findGameById(addon.gameId).then(game => {
        formRef.current.setFieldValue('game', {
          id: game.id,
          value: game.name,
        });
      });
      gameCategoryService.findGameCategoryById(addon.gameCategoryId).then(category => {
        formRef.current.setFieldValue('gameCategory', {
          id: category.id,
          value: category.name,
        });
      });
      getImageFromUrl(addon.posterUrl).then(posterFile => {
        formRef.current.setFieldValue('poster', posterFile);
      });
    }
  }, [addon]);

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
      <Autocomplete
        data={games}
        label="Game"
        required={!disabled}
        disabled={disabled || !!addon}
        mt={16}
        value={form.values.game.value}
        error={form.getInputProps('game').error}
        onItemSubmit={(item: AutocompleteItem) => {
          form.getInputProps('game').onChange(item);
        }}
      />
      <Autocomplete
        data={categories}
        label="Game Category"
        required={!disabled}
        disabled={disabled || !form.values.game.id}
        mt={16}
        value={form.values.gameCategory.value}
        error={form.getInputProps('gameCategory').error}
        onItemSubmit={(item: AutocompleteItem) => {
          form.getInputProps('gameCategory').onChange(item);
        }}
      />
      <InputWrapper label="Description" required mt={16} {...form.getInputProps('description')}>
        <RichTextEditor readOnly={disabled} {...form.getInputProps('description')} />
      </InputWrapper>
      <ImageUpload
        label="Poster"
        required={!disabled}
        disabled={disabled}
        {...form.getInputProps('poster')}
      />
      {!disabled && (
        <Group>
          <Button type="submit" mt="xl" loading={loading}>
            {addon ? 'Update' : 'Create'}
          </Button>
          <Button
            type="button"
            mt="xl"
            loading={loading}
            variant="subtle"
            component={Link}
            to="/my-addons"
          >
            Cancel
          </Button>
        </Group>
      )}
    </form>
  );
}
