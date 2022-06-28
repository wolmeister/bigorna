import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Group, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { UseFormReturnType } from '@mantine/form/lib/use-form';
import { Signature } from 'tabler-icons-react';
import { z } from 'zod';

import { GameCategory } from '../../../api/game-category';
import { getImageFromUrl } from '../../../api/utils/image.utils';
import { ImageUpload } from '../../../components/ImageUpload';

const schema = z.object({
  name: z.string(),
  icon: z.instanceof(File, 'Please upload a file'),
});

export type GameCategoryFormValues = z.infer<typeof schema>;
export type GameCategoryFormState = UseFormReturnType<GameCategoryFormValues>;
export type GameFormProps = {
  category?: GameCategory | null;
  disabled?: boolean;
  onSubmit?: (data: GameCategoryFormValues, form: GameCategoryFormState) => void | Promise<void>;
};

export function GameCategoryForm({ category, disabled, onSubmit }: GameFormProps) {
  const form = useForm<GameCategoryFormValues>({
    schema: zodResolver(schema),
    initialValues: {
      name: '',
      icon: {} as File,
    },
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (data: GameCategoryFormValues) => {
      if (!onSubmit) {
        return;
      }

      try {
        setLoading(true);
        await Promise.resolve(onSubmit(data, form as UseFormReturnType<GameCategoryFormValues>));
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
    if (category) {
      formRef.current.setFieldValue('name', category.name);
      getImageFromUrl(category.iconUrl).then(iconFile => {
        formRef.current.setFieldValue('icon', iconFile);
      });
    }
  }, [category]);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        data-autofocus
        required={!disabled}
        placeholder="The category name"
        label="Name"
        icon={<Signature size={18} />}
        disabled={disabled}
        {...form.getInputProps('name')}
      />
      <ImageUpload
        label="Icon"
        required={!disabled}
        disabled={disabled}
        {...form.getInputProps('icon')}
      />
      {!disabled && (
        <Group>
          <Button type="submit" mt="xl" loading={loading}>
            {category ? 'Update' : 'Create'}
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
