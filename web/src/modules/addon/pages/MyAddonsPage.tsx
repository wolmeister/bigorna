import React from 'react';
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

import { AppLayout } from '../../../components/AppLayout/AppLayout';

export function MyAddonsPage() {
  const theme = useMantineTheme();

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
          <Tooltip label="Create new addon">
            <ActionIcon variant="filled" component={Link} to="/new-addon">
              <Plus color={theme.primaryColor} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
      <Divider mt="md" mb="md" />
    </AppLayout>
  );
}
