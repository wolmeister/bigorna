import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Anchor, Breadcrumbs, Divider } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { X } from 'tabler-icons-react';

import { addonService } from '../../../api';
import { Addon } from '../../../api/addon';
import { HttpError } from '../../../api/http-client';
import { AppLayout } from '../../../components/AppLayout/AppLayout';
import { AddonForm, AddonFormState, AddonFormValues } from '../components/AddonForm';

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

export function UpdateAddonPage() {
  const navigate = useNavigate();
  const { id } = useParams<RouteParams>();

  const [addon, setAddon] = useState<Addon | null>(null);

  const handleSubmit = useCallback(
    async (data: AddonFormValues, form: AddonFormState) => {
      if (!id) {
        return;
      }

      try {
        const updatedAddon = await addonService.updateAddon(id, {
          ...data,
          gameCategoryId: data.gameCategory.id,
        });
        showNotification({
          title: 'Success',
          message: 'Addon updated successfully!',
        });
        navigate(`/addons/${updatedAddon.id}`);
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
    [id, navigate]
  );

  useEffect(() => {
    if (!id) {
      showNoAddonFoundNotification();
      navigate('/my-addons');
      return;
    }

    addonService
      .findAddonById(id)
      .then(setAddon)
      .catch(() => {
        showNoAddonFoundNotification();
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
        <Anchor component={Link} to="#">
          Edit Addon
        </Anchor>
      </Breadcrumbs>
      <Divider mt="md" mb="md" />
      {addon ? <AddonForm addon={addon} onSubmit={handleSubmit} /> : null}
    </AppLayout>
  );
}
