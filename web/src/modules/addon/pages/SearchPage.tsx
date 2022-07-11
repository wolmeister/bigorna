import React, { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Anchor, Breadcrumbs, Divider } from '@mantine/core';

import { addonService, gameService } from '../../../api';
import { Addon } from '../../../api/addon';
import { AppCard } from '../../../components/AppCard/AppCard';
import { AppLayout } from '../../../components/AppLayout/AppLayout';
import {
  AddonSearchFilterForm,
  AddonSearchFilterFormValues,
} from '../components/AddonSearchFilterForm';

export function SearchPage() {
  const [searchParams] = useSearchParams();

  const [addons, setAddons] = useState<Addon[]>([]);
  const [gameNameMap, setGameNameMap] = useState(new Map<string, string>());

  const handleSubmit = useCallback(async (data: AddonSearchFilterFormValues) => {
    const addonNodes = await addonService.findAddons({
      gameCategoryId: data.gameCategory.id || undefined,
      gameId: data.game.id || undefined,
      name: data.name || undefined,
    });
    setAddons(addonNodes.edges.map(edge => edge.node));
  }, []);

  useEffect(() => {
    addonService.findAddons({ gameId: searchParams.get('gameId') || undefined }).then(result => {
      setAddons(result.edges.map(edge => edge.node));
    });
  }, [searchParams]);

  useEffect(() => {
    const ids = [...new Set(addons.map(a => a.gameId))];

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
  }, [addons]);

  return (
    <AppLayout>
      <Breadcrumbs>
        <Anchor component={Link} to="/">
          Home
        </Anchor>
        <Anchor component={Link} to="/my-addons">
          My Addons
        </Anchor>
      </Breadcrumbs>
      <Divider mt="md" mb="md" />
      <AddonSearchFilterForm
        gameId={searchParams.get('gameId') || undefined}
        onSubmit={handleSubmit}
      />
      <Divider mt="md" mb="md" />
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {addons.map(addon => (
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
