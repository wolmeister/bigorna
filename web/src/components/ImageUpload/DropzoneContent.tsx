import React, { useMemo } from 'react';
import { Group, Image, Text } from '@mantine/core';
import { DropzoneStatus } from '@mantine/dropzone';

import { ImageUploadIcon } from './ImageUploadIcon';

type DropzoneContentProps = {
  status: DropzoneStatus;
  file?: File | null;
};

export function DropzoneContent({ status, file }: DropzoneContentProps) {
  const imageUrl = useMemo(() => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    return undefined;
  }, [file]);

  return (
    <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
      {file instanceof File ? (
        <Image src={imageUrl} fit="cover" height={220} />
      ) : (
        <>
          <ImageUploadIcon status={status} />
          <div>
            <Text size="xl" inline>
              Drag a image here or click to select one
            </Text>
          </div>
        </>
      )}
    </Group>
  );
}
