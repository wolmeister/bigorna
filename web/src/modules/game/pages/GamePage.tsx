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

import { gameService } from '../../../api';
import { Game } from '../../../api/game';
import { AppLayout } from '../../../components/AppLayout/AppLayout';
import { GameForm } from '../components/GameForm';

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

export function GamePage() {
  const navigate = useNavigate();
  const { id } = useParams<RouteParams>();
  const theme = useMantineTheme();
  const modals = useModals();

  const [game, setGame] = useState<Game | null>(null);

  const deleteGame = useCallback(() => {
    modals.openConfirmModal({
      title: 'Delete game',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this game? This action is destructive and cannot be
          reverted.
        </Text>
      ),
      labels: { confirm: 'Delete game', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        if (!game) {
          return;
        }
        gameService
          .deleteGame(game.id)
          .then(() => {
            showNotification({
              title: 'Success',
              message: 'Game deleted successfully!',
            });
            navigate('/games');
          })
          .catch(() => {
            showNotification({
              title: 'Error',
              message: 'This game contains active categories. Please delete them first.',
              icon: <X size={10} />,
              color: 'red',
            });
          });
      },
    });
  }, [game, modals, navigate]);

  useEffect(() => {
    if (!id) {
      showNoGameFoundNotification();
      navigate('/games');
      return;
    }

    gameService
      .findGameById(id)
      .then(setGame)
      .catch(() => {
        showNoGameFoundNotification();
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
          <Anchor component={Link} to="#">
            Game
          </Anchor>
        </Breadcrumbs>
        <Group>
          <Tooltip label="Edit">
            <ActionIcon variant="filled" component={Link} to={`/games/${game?.id}/update`}>
              <Pencil color={theme.primaryColor} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon variant="filled" onClick={deleteGame}>
              <Trash color={theme.colors.red[6]} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
      <Divider mt="md" mb="md" />
      <GameForm game={game} disabled />
    </AppLayout>
  );
}
