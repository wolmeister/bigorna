import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Anchor, Breadcrumbs, Divider } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { X } from 'tabler-icons-react';

import { addonService } from '../../../api';
import { HttpError } from '../../../api/http-client';
import { AppLayout } from '../../../components/AppLayout/AppLayout';
import { AddonForm, AddonFormState, AddonFormValues } from '../components/AddonForm';

export function NewAddonPage() {
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: AddonFormValues, form: AddonFormState) => {
      try {
        const addon = await addonService.createAddon({
          ...data,
          gameId: data.game.id,
          gameCategoryId: data.gameCategory.id,
        });
        showNotification({
          title: 'Success',
          message: 'Addon created successfully!',
        });
        navigate(`/addons/${addon.id}`);
      } catch (err) {
        if (err instanceof HttpError && err.error.code === 'ADDON_NAME_NOT_UNIQUE') {
          form.setFieldError('name', 'A addon with this name already exists');
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
    [navigate]
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
        <Anchor component={Link} to="#">
          New Addon
        </Anchor>
      </Breadcrumbs>
      <Divider mt="md" mb="md" />
      <AddonForm onSubmit={handleSubmit} />
    </AppLayout>
  );
}
