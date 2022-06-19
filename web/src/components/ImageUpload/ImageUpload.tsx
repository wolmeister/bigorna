import React, { ReactNode, useCallback, useState } from 'react';
import { InputWrapper } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import { X } from 'tabler-icons-react';

import { DropzoneContent } from './DropzoneContent';

type ImageUploadProps = {
  label: string;
  error?: ReactNode;
  required?: boolean;
  value?: File | null;
  onChange: (file: File) => void;
};

export function ImageUpload({ label, error, required, value, onChange }: ImageUploadProps) {
  const handleUpload = useCallback(
    (files: File[]) => {
      onChange(files[0]);
    },
    [onChange]
  );

  const handleReject = useCallback(() => {
    showNotification({
      title: 'Error',
      message: 'File is not a valid image',
      icon: <X size={10} />,
      color: 'red',
    });
  }, []);

  return (
    <InputWrapper label={label} error={error} required={required} mt={16}>
      <Dropzone
        onDrop={handleUpload}
        onReject={handleReject}
        multiple={false}
        accept={IMAGE_MIME_TYPE}
      >
        {status => <DropzoneContent status={status} file={value} />}
      </Dropzone>
    </InputWrapper>
  );
}
