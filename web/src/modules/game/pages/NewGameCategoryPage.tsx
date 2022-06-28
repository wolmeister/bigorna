import React, { useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Anchor, Breadcrumbs, Divider } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { X } from 'tabler-icons-react';

import { gameCategoryService } from '../../../api';
import { HttpError } from '../../../api/http-client';
import { AppLayout } from '../../../components/AppLayout/AppLayout';
import {
  GameCategoryForm,
  GameCategoryFormState,
  GameCategoryFormValues,
} from '../components/GameCategoryForm';

type RouteParams = {
  gameId: string;
};

export function NewGameCategoryPage() {
  const navigate = useNavigate();
  const { gameId } = useParams<RouteParams>();

  const handleSubmit = useCallback(
    async (data: GameCategoryFormValues, form: GameCategoryFormState) => {
      try {
        const category = await gameCategoryService.createGameCategory({
          ...data,
          gameId: gameId || '',
        });
        showNotification({
          title: 'Success',
          message: 'Game category created successfully!',
        });
        navigate(`/game-categories/${category.id}`);
      } catch (err) {
        if (err instanceof HttpError && err.error.code === 'GAME_NAME_NOT_UNIQUE') {
          form.setFieldError('name', 'A game category with this name already exists');
        } else if (err instanceof HttpError && err.error.code === 'GAME_NOT_FOUND') {
          showNotification({
            title: 'Error',
            message: 'Game not found',
            icon: <X size={10} />,
            color: 'red',
          });
        } else {
          showNotification({
            title: 'Error',
            message: 'An unknown error occurred',
            icon: <X size={10} />,
            color: 'red',
          });
        }
      }
    },
    [gameId, navigate]
  );

  return (
    <AppLayout>
      <Breadcrumbs>
        <Anchor component={Link} to="/">
          Home
        </Anchor>
        <Anchor component={Link} to="/games">
          Games
        </Anchor>
        <Anchor component={Link} to={`/games/${gameId}`}>
          Game
        </Anchor>
        <Anchor component={Link} to="#">
          New Category
        </Anchor>
      </Breadcrumbs>
      <Divider mt="md" mb="md" />
      <GameCategoryForm onSubmit={handleSubmit} />
    </AppLayout>
  );
}
