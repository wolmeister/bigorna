import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Breadcrumbs, Divider } from '@mantine/core';

import { addonService } from '../../../api';
import { Addon } from '../../../api/addon';
import { AppCard } from '../../../components/AppCard/AppCard';
import { AppLayout } from '../../../components/AppLayout/AppLayout';
import {
  AddonSearchFilterForm,
  AddonSearchFilterFormValues,
} from '../components/AddonSearchFilterForm';

export function SearchPage() {
  const [addons, setAddons] = useState<Addon[]>([]);

  const handleSubmit = useCallback(async (data: AddonSearchFilterFormValues) => {
    const addonNodes = await addonService.findAddons({
      gameCategoryId: data.gameCategory.id || undefined,
      gameId: data.game.id || undefined,
      name: data.name || undefined,
    });
    setAddons(addonNodes.edges.map(edge => edge.node));
  }, []);

  useEffect(() => {
    addonService.findAddons({}).then(result => {
      setAddons(result.edges.map(edge => edge.node));
    });
  }, []);

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
      <AddonSearchFilterForm onSubmit={handleSubmit} />
      <Divider mt="md" mb="md" />
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {addons.map(addon => (
          <AppCard
            key={addon.id}
            navigateTo={`/addons/${addon.id}`}
            title={addon.name}
            imageUrl={addon.posterUrl}
          />
        ))}
      </div>
    </AppLayout>
  );
}
