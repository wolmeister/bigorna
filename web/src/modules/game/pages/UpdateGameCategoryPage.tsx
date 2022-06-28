import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Anchor, Breadcrumbs, Divider } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { X } from 'tabler-icons-react';

import { gameCategoryService } from '../../../api';
import { GameCategory } from '../../../api/game-category';
import { HttpError } from '../../../api/http-client';
import { AppLayout } from '../../../components/AppLayout/AppLayout';
import {
  GameCategoryForm,
  GameCategoryFormState,
  GameCategoryFormValues,
} from '../components/GameCategoryForm';

type RouteParams = {
  id: string;
};

function showNoGameFoundNotification() {
  showNotification({
    title: 'Error',
    message: 'Category not found',
    icon: <X size={10} />,
    color: 'red',
  });
}

export function UpdateGameCategoryPage() {
  const navigate = useNavigate();
  const { id } = useParams<RouteParams>();

  const [category, setCategory] = useState<GameCategory | null>(null);

  const handleSubmit = useCallback(
    async (data: GameCategoryFormValues, form: GameCategoryFormState) => {
      if (!id) {
        return;
      }

      try {
        const updatedCategory = await gameCategoryService.updateGameCategory(id, data);
        showNotification({
          title: 'Success',
          message: 'Category updated successfully!',
        });
        navigate(`/game-categories/${updatedCategory.id}`);
      } catch (err) {
        if (err instanceof HttpError && err.error.code === 'GAME_CATEGORY_NAME_NOT_UNIQUE') {
          form.setFieldError('name', 'A category with this name already exists');
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
    [id, navigate]
  );

  useEffect(() => {
    if (!id) {
      showNoGameFoundNotification();
      navigate('/games');
      return;
    }

    gameCategoryService
      .findGameCategoryById(id)
      .then(setCategory)
      .catch(() => {
        showNoGameFoundNotification();
        navigate('/games');
      });
  }, [id, navigate]);

  return (
    <AppLayout>
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
          Edit Category
        </Anchor>
      </Breadcrumbs>
      <Divider mt="md" mb="md" />
      <GameCategoryForm onSubmit={handleSubmit} category={category} />
    </AppLayout>
  );
}
