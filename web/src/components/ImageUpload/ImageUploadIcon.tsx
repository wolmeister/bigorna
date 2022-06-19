import React from 'react';
import { MantineTheme, useMantineTheme } from '@mantine/core';
import { DropzoneStatus } from '@mantine/dropzone';
import { Photo, Upload, X } from 'tabler-icons-react';

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  if (status.accepted) {
    return theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6];
  }

  if (status.rejected) {
    return theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6];
  }

  return theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7];
}

type ImageUploadIconProps = {
  status: DropzoneStatus;
};

export function ImageUploadIcon({ status }: ImageUploadIconProps) {
  const theme = useMantineTheme();
  const color = getIconColor(status, theme);

  if (status.accepted) {
    return <Upload color={color} size={80} />;
  }

  if (status.rejected) {
    return <X color={color} size={80} />;
  }

  return <Photo color={color} size={80} />;
}
