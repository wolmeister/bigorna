import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ActionIcon,
  Anchor,
  Breadcrumbs,
  Divider,
  Group,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { Plus } from 'tabler-icons-react';

import { gameService } from '../../../api';
import { Game } from '../../../api/game';
import { AppCard } from '../../../components/AppCard/AppCard';
import { AppLayout } from '../../../components/AppLayout/AppLayout';

export function GamesPage() {
  const theme = useMantineTheme();
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    gameService.findGames({}).then(result => {
      setGames(result.edges.map(edge => edge.node));
    });
  }, []);

  return (
    <AppLayout>
      <Group position="apart">
        <Breadcrumbs>
          <Anchor component={Link} to="/">
            Home
          </Anchor>
          <Anchor component={Link} to="#">
            Games
          </Anchor>
        </Breadcrumbs>
        <Group>
          <Tooltip label="Create new game">
            <ActionIcon variant="filled" component={Link} to="/new-game">
              <Plus color={theme.primaryColor} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
      <Divider mt="md" mb="md" />
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {games.map(game => (
          <AppCard
            key={game.id}
            title={game.name}
            imageUrl={game.posterUrl}
            navigateTo={`/games/${game.id}`}
          />
        ))}
      </div>
    </AppLayout>
  );
}
