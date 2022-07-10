import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Anchor, Breadcrumbs, Divider } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { X } from 'tabler-icons-react';

import { addonVersionService } from '../../../api';
import { AddonVersion } from '../../../api/addon-version';
import { AppLayout } from '../../../components/AppLayout/AppLayout';
import { AddonVersionForm, AddonVersionFormValues } from '../components/AddonVersionForm';

type RouteParams = {
  id: string;
};

function showNoAddonVersionFoundNotification() {
  showNotification({
    title: 'Error',
    message: 'Addon version not found',
    icon: <X size={10} />,
    color: 'red',
  });
}

export function UpdateAddonVersionPage() {
  const navigate = useNavigate();
  const { id } = useParams<RouteParams>();

  const [addonVersion, setAddonVersion] = useState<AddonVersion | null>(null);

  const handleSubmit = useCallback(
    async (data: AddonVersionFormValues) => {
      if (!id) {
        return;
      }

      try {
        const updatedAddonVersion = await addonVersionService.updateAddonVersion(id, {
          changelog: data.changelog,
        });
        showNotification({
          title: 'Success',
          message: 'Addon Version updated successfully!',
        });
        navigate(`/addon-versions/${updatedAddonVersion.id}`);
      } catch (err) {
        showNotification({
          title: 'Error',
          message: 'An unknown error occurred',
          icon: <X size={10} />,
          color: 'red',
        });
      }
    },
    [id, navigate]
  );

  useEffect(() => {
    if (!id) {
      showNoAddonVersionFoundNotification();
      navigate('/my-addons');
      return;
    }

    addonVersionService
      .findAddonVersionById(id)
      .then(setAddonVersion)
      .catch(() => {
        showNoAddonVersionFoundNotification();
        navigate('/my-addons');
      });
  }, [id, navigate]);

  return (
    <AppLayout>
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
          Edit Addon Version
        </Anchor>
      </Breadcrumbs>
      <Divider mt="md" mb="md" />
      {addonVersion ? (
        <AddonVersionForm addonVersion={addonVersion} onSubmit={handleSubmit} />
      ) : null}
    </AppLayout>
  );
}
