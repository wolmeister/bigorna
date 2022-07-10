import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ActionIcon,
  Anchor,
  Breadcrumbs,
  Divider,
  Group,
  Table,
  Tabs,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import {
  CodePlus,
  Download,
  Eye,
  InfoCircle,
  Pencil,
  Trash,
  Versions,
  X,
} from 'tabler-icons-react';

import { addonService, addonVersionService } from '../../../api';
import { Addon } from '../../../api/addon';
import { AddonVersion } from '../../../api/addon-version';
import { AppLayout } from '../../../components/AppLayout/AppLayout';
import { AddonForm } from '../components/AddonForm';

type RouteParams = {
  id: string;
};

function showNoCategoryFoundNotification() {
  showNotification({
    title: 'Error',
    message: 'Addon not found',
    icon: <X size={10} />,
    color: 'red',
  });
}

export function AddonPage() {
  const navigate = useNavigate();
  const { id } = useParams<RouteParams>();
  const theme = useMantineTheme();
  const modals = useModals();

  const [addon, setAddon] = useState<Addon | null>(null);
  const [versions, setVersions] = useState<AddonVersion[]>([]);

  const deleteCategory = useCallback(() => {
    modals.openConfirmModal({
      title: 'Delete addon',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this addon? This action is destructive and cannot be
          reverted.
        </Text>
      ),
      labels: { confirm: 'Delete addon', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        if (!addon) {
          return;
        }
        addonService
          .deleteAddon(addon.id)
          .then(() => {
            showNotification({
              title: 'Success',
              message: 'Addon deleted successfully!',
            });
            navigate(`/my-addons`);
          })
          .catch(() => {
            showNotification({
              title: 'Error',
              message: 'This addon contains active versions. Please delete them first.',
              icon: <X size={10} />,
              color: 'red',
            });
          });
      },
    });
  }, [addon, modals, navigate]);

  useEffect(() => {
    if (!id) {
      showNoCategoryFoundNotification();
      navigate('/my-addons');
      return;
    }

    addonService
      .findAddonById(id)
      .then(setAddon)
      .catch(() => {
        showNoCategoryFoundNotification();
        navigate('/');
      });

    addonVersionService.findAddonVersions({ addonId: id }).then(result => {
      setVersions(result.edges.map(edge => edge.node));
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
          <Anchor component={Link} to="#">
            Addon
          </Anchor>
        </Breadcrumbs>
        <Group>
          <Tooltip label="Add version">
            <ActionIcon variant="filled" component={Link} to={`/addons/${addon?.id}/new-version`}>
              <CodePlus color={theme.primaryColor} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit">
            <ActionIcon variant="filled" component={Link} to={`/addons/${addon?.id}/update`}>
              <Pencil color={theme.primaryColor} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon variant="filled" onClick={deleteCategory}>
              <Trash color={theme.colors.red[6]} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
      <Divider mt="md" mb="md" />
      <Tabs>
        <Tabs.Tab label="Addon" icon={<InfoCircle size={14} />}>
          {addon ? <AddonForm addon={addon} disabled /> : null}
        </Tabs.Tab>
        <Tabs.Tab label="Versions" icon={<Versions size={14} />}>
          <Table>
            <thead>
              <tr>
                <th>Version</th>
                <th>Game Version</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {versions.map(version => (
                <tr key={version.id}>
                  <td>{version.version}</td>
                  <td>{version.gameVersion}</td>
                  <td style={{ width: '150px' }}>
                    <Group>
                      <Tooltip label="Download">
                        <ActionIcon variant="filled">
                          <a href={version.downloadUrl}>
                            <Download color={theme.primaryColor} />
                          </a>
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="View version">
                        <ActionIcon
                          variant="filled"
                          component={Link}
                          to={`/addon-versions/${version.id}`}
                        >
                          <Eye color={theme.primaryColor} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Edit">
                        <ActionIcon
                          variant="filled"
                          component={Link}
                          to={`/addon-versions/${version.id}/update`}
                        >
                          <Pencil color={theme.primaryColor} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tabs.Tab>
      </Tabs>
    </AppLayout>
  );
}
