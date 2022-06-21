import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Anchor, Breadcrumbs, Divider } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { X } from 'tabler-icons-react';

import { gameService } from '../../../api';
import { HttpError } from '../../../api/http-client';
import { AppLayout } from '../../../components/AppLayout/AppLayout';
import { GameForm, GameFormState, GameFormValues } from '../components/GameForm';

export function NewGamePage() {
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: GameFormValues, form: GameFormState) => {
      try {
        const game = await gameService.createGame(data);
        showNotification({
          title: 'Success',
          message: 'Game created successfully!',
        });
        navigate(`/games/${game.id}`);
      } catch (err) {
        if (err instanceof HttpError && err.error.code === 'GAME_NAME_NOT_UNIQUE') {
          form.setFieldError('name', 'A game with this name already exists');
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
    [navigate]
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
        <Anchor component={Link} to="/new-game">
          New Game
        </Anchor>
      </Breadcrumbs>
      <Divider mt="md" mb="md" />
      <GameForm onSubmit={handleSubmit} />
    </AppLayout>
  );
}
