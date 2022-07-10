import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Autocomplete, Button, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { DeviceGamepad, Eraser, Folder, Search, Signature } from 'tabler-icons-react';

import { gameCategoryService, gameService } from '../../../api';

type AutocompleteItem = {
  id: string;
  value: string;
};

export type AddonSearchFilterFormValues = {
  name: string;
  description: string;
  gameSearch: string;
  game: {
    id: string;
    value: string;
  };
  gameCategorySearch: string;
  gameCategory: {
    id: string;
    value: string;
  };
};
export type AddonSearchFilterFormProps = {
  onSubmit: (data: AddonSearchFilterFormValues) => void | Promise<void>;
  gameId?: string;
};

const emptyFilter: AddonSearchFilterFormValues = {
  name: '',
  description: '',
  gameSearch: '',
  game: { id: '', value: '' },
  gameCategorySearch: '',
  gameCategory: { id: '', value: '' },
};

export function AddonSearchFilterForm({ onSubmit, gameId }: AddonSearchFilterFormProps) {
  // Form state
  const form = useForm<AddonSearchFilterFormValues>({
    initialValues: emptyFilter,
  });

  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async (data: AddonSearchFilterFormValues) => {
      try {
        setLoading(true);
        await Promise.resolve(onSubmit(data));
      } finally {
        setLoading(false);
      }
    },
    [onSubmit]
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

      if (gameId) {
        const gameEdge = result.edges.find(edge => edge.cursor === gameId);
        if (gameEdge) {
          formRef.current.setFieldValue('gameSearch', gameEdge.node.name);
          formRef.current.setFieldValue('game', { id: gameEdge.cursor, value: gameEdge.node.name });
        }
      }
    });
  }, [gameId]);

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

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group position="apart">
        <Group>
          <TextInput
            data-autofocus
            placeholder="The addon name"
            label="Name"
            icon={<Signature size={18} />}
            {...form.getInputProps('name')}
          />
          <Autocomplete
            data={games}
            label="Game"
            placeholder="The game"
            icon={<DeviceGamepad size={18} />}
            {...form.getInputProps('gameSearch')}
            onItemSubmit={(item: AutocompleteItem) => {
              form.getInputProps('game').onChange(item);
            }}
          />
          <Autocomplete
            data={categories}
            label="Game Category"
            placeholder="The game category"
            icon={<Folder size={18} />}
            {...form.getInputProps('gameCategorySearch')}
            onItemSubmit={(item: AutocompleteItem) => {
              form.getInputProps('gameCategory').onChange(item);
            }}
          />
        </Group>
        <Group>
          <Button type="submit" mt="xl" loading={loading} leftIcon={<Search size={18} />}>
            Search
          </Button>
          <Button
            mt="xl"
            loading={loading}
            variant="subtle"
            leftIcon={<Eraser size={18} />}
            onClick={() => {
              form.reset();
              handleSubmit(emptyFilter);
            }}
          >
            Clear
          </Button>
        </Group>
      </Group>
    </form>
  );
}
