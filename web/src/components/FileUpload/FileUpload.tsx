import React, { ReactNode, useCallback } from 'react';
import { InputWrapper } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import { X } from 'tabler-icons-react';

import { useStyles } from './FileUpload.styles';
import { FileUploadDropzoneContent } from './FileUploadDropzoneContent';

type ImageUploadProps = {
  label: string;
  error?: ReactNode;
  required?: boolean;
  value?: File | null;
  disabled?: boolean;
  onChange: (file: File) => void;
};

export function FileUpload({
  label,
  error,
  required,
  value,
  disabled,
  onChange,
}: ImageUploadProps) {
  const { classes } = useStyles();

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
        disabled={disabled}
        className={disabled ? classes.disabled : undefined}
      >
        {status => <FileUploadDropzoneContent status={status} file={value} />}
      </Dropzone>
    </InputWrapper>
  );
}
