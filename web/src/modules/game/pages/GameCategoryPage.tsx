import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ActionIcon,
  Anchor,
  Breadcrumbs,
  Divider,
  Group,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { Pencil, Trash, X } from 'tabler-icons-react';

import { gameCategoryService } from '../../../api';
import { GameCategory } from '../../../api/game-category';
import { AppLayout } from '../../../components/AppLayout/AppLayout';
import { GameCategoryForm } from '../components/GameCategoryForm';

type RouteParams = {
  id: string;
};

function showNoCategoryFoundNotification() {
  showNotification({
    title: 'Error',
    message: 'Category not found',
    icon: <X size={10} />,
    color: 'red',
  });
}

export function GameCategoryPage() {
  const navigate = useNavigate();
  const { id } = useParams<RouteParams>();
  const theme = useMantineTheme();
  const modals = useModals();

  const [category, setCategory] = useState<GameCategory | null>(null);

  const deleteCategory = useCallback(() => {
    modals.openConfirmModal({
      title: 'Delete category',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this game category? This action is destructive and cannot
          be reverted.
        </Text>
      ),
      labels: { confirm: 'Delete category', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        if (!category) {
          return;
        }
        gameCategoryService
          .deleteGameCategory(category.id)
          .then(() => {
            showNotification({
              title: 'Success',
              message: 'Game category deleted successfully!',
            });
            navigate(`/games/${category.gameId}`);
          })
          .catch(() => {
            showNotification({
              title: 'Error',
              message: 'This category contains active addons. Please delete them first.',
              icon: <X size={10} />,
              color: 'red',
            });
          });
      },
    });
  }, [category, modals, navigate]);

  useEffect(() => {
    if (!id) {
      showNoCategoryFoundNotification();
      navigate('/games');
      return;
    }

    gameCategoryService
      .findGameCategoryById(id)
      .then(setCategory)
      .catch(() => {
        showNoCategoryFoundNotification();
        navigate('/games');
      });
  }, [id, navigate]);

  return (
    <AppLayout>
      <Group position="apart">
        <Breadcrumbs>
          <Anchor component={Link} to="/">
            Home
          </Anchor>
          <Anchor component={Link} to="/games">
            Games
          </Anchor>
          <Anchor component={Link} to={`/games/${category?.gameId}`}>
            Game
          </Anchor>
          <Anchor component={Link} to="#">
            Category
          </Anchor>
        </Breadcrumbs>
        <Group>
          <Tooltip label="Edit">
            <ActionIcon
              variant="filled"
              component={Link}
              to={`/game-categories/${category?.id}/update`}
            >
              <Pencil color={theme.primaryColor} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon variant="filled" onClick={deleteCategory}>
              <Trash color={theme.colors.red[6]} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
      <Divider mt="md" mb="md" />
      <GameCategoryForm category={category} disabled />
    </AppLayout>
  );
}
