import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ActionIcon,
  Anchor,
  Breadcrumbs,
  Button,
  Divider,
  Group,
  Image,
  Table,
  Tabs,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import RichTextEditor from '@mantine/rte';
import { Download, InfoCircle, Versions, X } from 'tabler-icons-react';

import { addonService, addonVersionService, gameCategoryService, gameService } from '../../../api';
import { Addon } from '../../../api/addon';
import { AddonVersion } from '../../../api/addon-version';
import { Game } from '../../../api/game';
import { GameCategory } from '../../../api/game-category';
import { AppLayout } from '../../../components/AppLayout/AppLayout';

type RouteParams = {
  id: string;
};

function showNoAddonFoundNotification() {
  showNotification({
    title: 'Error',
    message: 'Addon not found',
    icon: <X size={10} />,
    color: 'red',
  });
}

export function AddonViewerPage() {
  const navigate = useNavigate();
  const { id } = useParams<RouteParams>();
  const theme = useMantineTheme();

  const [addon, setAddon] = useState<Addon | null>(null);
  const [versions, setVersions] = useState<AddonVersion[]>([]);
  const [game, setGame] = useState<Game | null>();
  const [gameCategory, setGameCategory] = useState<GameCategory | null>();

  useEffect(() => {
    if (!id) {
      showNoAddonFoundNotification();
      navigate('/search');
      return;
    }

    addonService
      .findAddonById(id)
      .then(setAddon)
      .catch(() => {
        showNoAddonFoundNotification();
        navigate('/');
      });

    addonVersionService.findAddonVersions({ addonId: id }).then(result => {
      setVersions(result.edges.map(edge => edge.node));
    });
  }, [id, navigate]);

  useEffect(() => {
    if (!addon) {
      return;
    }

    gameService.findGameById(addon.gameId).then(setGame);
    gameCategoryService.findGameCategoryById(addon.gameCategoryId).then(setGameCategory);
  }, [addon]);

  const latestVersion = versions.find(v => v.version === addon?.latestVersion);

  return (
    <AppLayout>
      <Group position="apart">
        <Breadcrumbs>
          <Anchor component={Link} to="/">
            Home
          </Anchor>
          <Anchor component={Link} to="/search">
            Search
          </Anchor>
          <Anchor component={Link} to="#">
            {addon?.name}
          </Anchor>
        </Breadcrumbs>
      </Group>
      <Divider mt="md" mb="md" />
      <Tabs>
        <Tabs.Tab label="Description" icon={<InfoCircle size={14} />}>
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <Image src={addon?.posterUrl} fit="cover" height={220} width={220} radius="md" />
            <Text size="xl">{addon?.name}</Text>
            <Text size="lg">
              {game?.name} - {gameCategory?.name}
            </Text>
            <Group style={{ alignSelf: 'flex-start', width: '100%' }} position="apart">
              <div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Text style={{ fontWeight: 500 }}>Latest Version:</Text>
                  <Text>{addon?.latestVersion}</Text>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Text style={{ fontWeight: 500 }}>Latest Game Version:</Text>
                  <Text>{addon?.latestGameVersion}</Text>
                </div>
              </div>
              <Button
                style={{ display: 'block' }}
                disabled={!latestVersion}
                onClick={() => {
                  if (latestVersion) {
                    window.open(latestVersion.downloadUrl);
                  }
                }}
              >
                Download
              </Button>
            </Group>
            {addon ? (
              <RichTextEditor
                style={{ width: '100%' }}
                readOnly
                value={addon?.description || ''}
                onChange={() => {
                  // do nothing, readonly
                }}
              />
            ) : null}
            {latestVersion ? (
              <>
                <Text size="lg" style={{ alignSelf: 'flex-start' }}>
                  Latest Version Changelog
                </Text>
                <RichTextEditor
                  style={{ width: '100%' }}
                  readOnly
                  value={latestVersion?.changelog || ''}
                  onChange={() => {
                    // do nothing, readonly
                  }}
                />
              </>
            ) : null}
          </div>
        </Tabs.Tab>
        <Tabs.Tab label="Other Versions" icon={<Versions size={14} />}>
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
                  <td style={{ width: '50px' }}>
                    <Group>
                      <Tooltip label="Download">
                        <ActionIcon variant="filled">
                          <a href={version.downloadUrl}>
                            <Download color={theme.primaryColor} />
                          </a>
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
