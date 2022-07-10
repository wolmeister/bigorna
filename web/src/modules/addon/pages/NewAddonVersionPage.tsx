import React, { useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Anchor, Breadcrumbs, Divider } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { X } from 'tabler-icons-react';

import { addonVersionService } from '../../../api';
import { HttpError } from '../../../api/http-client';
import { AppLayout } from '../../../components/AppLayout/AppLayout';
import {
  AddonVersionForm,
  AddonVersionFormState,
  AddonVersionFormValues,
} from '../components/AddonVersionForm';

type RouteParams = {
  addonId: string;
};

export function NewAddonVersionPage() {
  const navigate = useNavigate();
  const { addonId } = useParams<RouteParams>();

  const handleSubmit = useCallback(
    async (data: AddonVersionFormValues, form: AddonVersionFormState) => {
      if (!addonId) {
        return;
      }

      try {
        const addonVersion = await addonVersionService.createAddonVersion({
          ...data,
          file: data.file as File,
          addonId,
        });
        showNotification({
          title: 'Success',
          message: 'Addon version created successfully!',
        });
        navigate(`/addon-versions/${addonVersion.id}`);
      } catch (err) {
        if (err instanceof HttpError && err.error.code === 'ADDON_VERSION_VERSION_NOT_UNIQUE') {
          form.setFieldError('version', 'A addon with this version already exists');
        } else {
          showNotification({
            title: 'Error',
            message: 'An unknown error occurred',
            icon: <X size={10} />,
            color: 'red',
          });
        }
      }
    },
    [addonId, navigate]
  );

  return (
    <AppLayout>
      <Breadcrumbs>
        <Anchor component={Link} to="/">
          Home
        </Anchor>
        <Anchor component={Link} to="/my-addons">
          My Addons
        </Anchor>
        <Anchor component={Link} to={`/addons/${addonId}`}>
          Addon
        </Anchor>
        <Anchor component={Link} to="#">
          New Version
        </Anchor>
      </Breadcrumbs>
      <Divider mt="md" mb="md" />
      <AddonVersionForm onSubmit={handleSubmit} />
    </AppLayout>
  );
}
