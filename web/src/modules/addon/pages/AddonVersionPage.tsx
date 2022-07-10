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

import { addonVersionService } from '../../../api';
import { AddonVersion } from '../../../api/addon-version';
import { AppLayout } from '../../../components/AppLayout/AppLayout';
import { AddonVersionForm } from '../components/AddonVersionForm';

type RouteParams = {
  id: string;
};

function showNoVersionFoundNotification() {
  showNotification({
    title: 'Error',
    message: 'Addon version not found',
    icon: <X size={10} />,
    color: 'red',
  });
}

export function AddonVersionPage() {
  const navigate = useNavigate();
  const { id } = useParams<RouteParams>();
  const theme = useMantineTheme();
  const modals = useModals();

  const [addonVersion, setAddonVersion] = useState<AddonVersion | null>(null);

  const deleteAddonVersion = useCallback(() => {
    modals.openConfirmModal({
      title: 'Delete addon version',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this addon version? This action is destructive and cannot
          be reverted.
        </Text>
      ),
      labels: { confirm: 'Delete addon version', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        if (!addonVersion) {
          return;
        }
        addonVersionService
          .deleteAddonVersion(addonVersion.id)
          .then(() => {
            showNotification({
              title: 'Success',
              message: 'Addon version deleted successfully!',
            });
            navigate(`/addons/${addonVersion?.addonId}`);
          })
          .catch(() => {
            showNotification({
              title: 'Error',
              message: 'An unknown error occurred',
              icon: <X size={10} />,
              color: 'red',
            });
          });
      },
    });
  }, [addonVersion, modals, navigate]);

  useEffect(() => {
    if (!id) {
      showNoVersionFoundNotification();
      navigate('/my-addons');
      return;
    }

    addonVersionService
      .findAddonVersionById(id)
      .then(setAddonVersion)
      .catch(() => {
        showNoVersionFoundNotification();
        navigate('/my-addons');
      });
  }, [id, navigate]);

  return (
    <AppLayout>
      <Group position="apart">
        <Breadcrumbs>
          <Anchor component={Link} to="/">
            Home
          </Anchor>
          <Anchor component={Link} to="/my-addons">
            My Addons
          </Anchor>
          <Anchor component={Link} to={`/addons/${addonVersion?.addonId}`}>
            Addon
          </Anchor>
          <Anchor component={Link} to="#">
            Addon Version
          </Anchor>
        </Breadcrumbs>
        <Group>
          <Tooltip label="Edit">
            <ActionIcon
              variant="filled"
              component={Link}
              to={`/addon-versions/${addonVersion?.id}/update`}
            >
              <Pencil color={theme.primaryColor} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon variant="filled" onClick={deleteAddonVersion}>
              <Trash color={theme.colors.red[6]} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
      <Divider mt="md" mb="md" />
      {addonVersion ? <AddonVersionForm addonVersion={addonVersion} disabled /> : null}
    </AppLayout>
  );
}
