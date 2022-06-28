import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ActionIcon,
  Anchor,
  Breadcrumbs,
  Card,
  Divider,
  Group,
  Image,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { Plus } from 'tabler-icons-react';

import { gameService } from '../../../api';
import { Game } from '../../../api/game';
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
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {games.map(game => (
          <Card
            shadow="sm"
            p="xl"
            style={{ width: 200, cursor: 'pointer' }}
            key={game.id}
            component={Link}
            to={`/games/${game.id}`}
          >
            <Card.Section style={{ position: 'relative' }}>
              <Image height={160} width={200} src={game.posterUrl} />
              <div
                style={{
                  width: '100%',
                  position: 'absolute',
                  bottom: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,.50)',
                }}
              >
                <Text weight={500} size="lg" style={{ textAlign: 'center' }}>
                  {game.name}
                </Text>
              </div>
            </Card.Section>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
