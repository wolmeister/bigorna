import React from 'react';
import { Group, Text } from '@mantine/core';
import { DropzoneStatus } from '@mantine/dropzone';

import { FileUploadIcon } from './FileUploadIcon';

type DropzoneContentProps = {
  status: DropzoneStatus;
  file?: File | null;
};

export function FileUploadDropzoneContent({ status, file }: DropzoneContentProps) {
  return (
    <Group position="center" spacing="xl" style={{ minHeight: 75, pointerEvents: 'none' }}>
      <FileUploadIcon status={status} />
      <div>
        <Text size="lg" inline>
          {file?.name ? file.name : 'Drag a file here or click to select one'}
        </Text>
      </div>
    </Group>
  );
}
