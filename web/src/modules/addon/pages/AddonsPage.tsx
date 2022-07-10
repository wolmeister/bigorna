import React, { useEffect, useState } from 'react';
import { Title } from '@mantine/core';

import { addonService, gameService } from '../../../api';
import { Addon } from '../../../api/addon';
import { Game } from '../../../api/game';
import { AppCard } from '../../../components/AppCard/AppCard';
import { AppLayout } from '../../../components/AppLayout/AppLayout';

export function AddonsPage() {
  const [topGames, setTopGames] = useState<Game[]>([]);
  const [mostDownloadedAddons, setMostDownloadedAddons] = useState<Addon[]>([]);
  const [newAddons, setNewAddons] = useState<Addon[]>([]);

  const [gameNameMap, setGameNameMap] = useState(new Map<string, string>());

  useEffect(() => {
    gameService.findGames({ first: 5 }).then(result => {
      setTopGames(result.edges.map(edge => edge.node));
    });
    addonService.findAddons({ first: 5 }).then(result => {
      setMostDownloadedAddons(result.edges.map(edge => edge.node));
    });
    addonService.findAddons({}).then(result => {
      // criminal...
      const addons = result.edges.map(edge => edge.node);
      addons.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNewAddons(addons.slice(0, 5));
    });
  }, []);

  useEffect(() => {
    const allAddons = mostDownloadedAddons.concat(newAddons);
    const ids = [...new Set(allAddons.map(a => a.gameId))];

    if (ids.length === 1) {
      gameService.findGameById(ids[0]).then(game => {
        const map = new Map<string, string>();
        map.set(game.id, game.name);
        setGameNameMap(map);
      });
      return;
    }

    gameService.findGames({ ids }).then(result => {
      const map = new Map<string, string>();
      result.edges.forEach(edge => {
        map.set(edge.node.id, edge.node.name);
      });
      setGameNameMap(map);
    });
  }, [mostDownloadedAddons, newAddons]);

  return (
    <AppLayout>
      <Title order={2} m={0} mb={16} color="primary">
        Top Games
      </Title>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {topGames.map(game => (
          <AppCard
            key={game.id}
            navigateTo={`/search?gameId=${game.id}`}
            title={game.name}
            imageUrl={game.posterUrl}
          />
        ))}
      </div>
      <Title order={2} m={0} mt={32} mb={16}>
        Most Downloaded Addons
      </Title>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {mostDownloadedAddons.map(addon => (
          <AppCard
            key={addon.id}
            navigateTo={`/addon-viewer/${addon.id}`}
            title={addon.name}
            subtitle={gameNameMap.get(addon.gameId)}
            imageUrl={addon.posterUrl}
          />
        ))}
      </div>
      <Title order={2} m={0} mt={32} mb={16}>
        New Addons
      </Title>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {newAddons.map(addon => (
          <AppCard
            key={addon.id}
            navigateTo={`/addon-viewer/${addon.id}`}
            title={addon.name}
            subtitle={gameNameMap.get(addon.gameId)}
            imageUrl={addon.posterUrl}
          />
        ))}
      </div>
    </AppLayout>
  );
}
