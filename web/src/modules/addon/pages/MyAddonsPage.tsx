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

import { addonService } from '../../../api';
import { Addon } from '../../../api/addon';
import { AppCard } from '../../../components/AppCard/AppCard';
import { AppLayout } from '../../../components/AppLayout/AppLayout';
import { useUser } from '../../auth';

export function MyAddonsPage() {
  const theme = useMantineTheme();
  const user = useUser();
  const [addons, setAddons] = useState<Addon[]>([]);

  useEffect(() => {
    addonService.findAddons({ uploaderId: user?.id }).then(result => {
      setAddons(result.edges.map(edge => edge.node));
    });
  }, [user?.id]);

  return (
    <AppLayout>
      <Group position="apart">
        <Breadcrumbs>
          <Anchor component={Link} to="/">
            Home
          </Anchor>
          <Anchor component={Link} to="#">
            My Addons
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
