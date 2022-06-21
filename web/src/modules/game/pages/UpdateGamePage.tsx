import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Anchor, Breadcrumbs, Divider } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { X } from 'tabler-icons-react';

import { gameService } from '../../../api';
import { Game } from '../../../api/game';
import { HttpError } from '../../../api/http-client';
import { AppLayout } from '../../../components/AppLayout/AppLayout';
import { GameForm, GameFormState, GameFormValues } from '../components/GameForm';

type RouteParams = {
  id: string;
};

function showNoGameFoundNotification() {
  showNotification({
    title: 'Error',
    message: 'Game not found',
    icon: <X size={10} />,
    color: 'red',
  });
}

export function UpdateGamePage() {
  const navigate = useNavigate();
  const { id } = useParams<RouteParams>();

  const [game, setGame] = useState<Game | null>(null);

  const handleSubmit = useCallback(
    async (data: GameFormValues, form: GameFormState) => {
      if (!id) {
        return;
      }

      try {
        const updatedGame = await gameService.updateGame(id, data);
        showNotification({
          title: 'Success',
          message: 'Game updated successfully!',
        });
        navigate(`/games/${updatedGame.id}`);
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
    [id, navigate]
  );

  useEffect(() => {
    if (!id) {
      showNoGameFoundNotification();
      navigate('/games');
      return;
    }

    gameService
      .findGameById(id)
      .then(gameToUpdate => {
        setGame(gameToUpdate);
      })
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
        <Anchor component={Link} to="/new-game">
          Edit Game
        </Anchor>
      </Breadcrumbs>
      <Divider mt="md" mb="md" />
      <GameForm onSubmit={handleSubmit} game={game} />
    </AppLayout>
  );
}
