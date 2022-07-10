import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Group, InputWrapper, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { UseFormReturnType } from '@mantine/form/lib/use-form';
import { RichTextEditor } from '@mantine/rte';
import { DeviceGamepad, Versions } from 'tabler-icons-react';
import { z } from 'zod';

import { AddonVersion } from '../../../api/addon-version';
import { getFileFromUrl } from '../../../api/utils/image.utils';
import { FileUpload } from '../../../components/FileUpload';

const schema = z.object({
  version: z.string().min(1, 'Please fill the version'),
  gameVersion: z.string().min(1, 'Please fill the game version'),
  changelog: z.string().min(1, 'Please fill the changelog'),
  file: z.instanceof(File, 'Please upload a file'),
});

export type AddonVersionFormValues = z.infer<typeof schema>;
export type AddonVersionFormState = UseFormReturnType<AddonVersionFormValues>;
export type AddonVersionFormProps = {
  addonVersion?: AddonVersion | null;
  disabled?: boolean;
  onSubmit?: (data: AddonVersionFormValues, form: AddonVersionFormState) => void | Promise<void>;
};

export function AddonVersionForm({ addonVersion, disabled, onSubmit }: AddonVersionFormProps) {
  // Form state
  const form = useForm<AddonVersionFormValues>({
    schema: zodResolver(schema),
    initialValues: {
      version: addonVersion ? addonVersion.version : '',
      gameVersion: addonVersion ? addonVersion.gameVersion : '',
      changelog: addonVersion ? addonVersion.changelog : '',
      file: {} as File,
    },
  });

  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async (data: AddonVersionFormValues) => {
      if (!onSubmit) {
        return;
      }

      try {
        setLoading(true);
        await Promise.resolve(onSubmit(data, form as UseFormReturnType<AddonVersionFormValues>));
      } finally {
        setLoading(false);
      }
    },
    [form, onSubmit]
  );

  // // https://github.com/mantinedev/mantine/pull/1422
  const formRef = useRef(form);
  useLayoutEffect(() => {
    formRef.current = form;
  }, [form]);

  useEffect(() => {
    if (addonVersion) {
      formRef.current.setFieldValue('version', addonVersion.version);
      formRef.current.setFieldValue('gameVersion', addonVersion.gameVersion);
      formRef.current.setFieldValue('changelog', addonVersion.changelog);
      getFileFromUrl(addonVersion.downloadUrl).then(file => {
        formRef.current.setFieldValue('file', file);
      });
    }
  }, [addonVersion]);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        data-autofocus
        required={!disabled}
        placeholder="The addon version"
        label="Version"
        icon={<Versions size={18} />}
        disabled={disabled || !!addonVersion}
        {...form.getInputProps('version')}
      />
      <TextInput
        required={!disabled}
        placeholder="The game version"
        label="Game Version"
        disabled={disabled || !!addonVersion}
        icon={<DeviceGamepad size={18} />}
        mt={16}
        {...form.getInputProps('gameVersion')}
      />
      {addonVersion ? (
        <InputWrapper label="File" mt={16}>
          <Button
            style={{ display: 'block' }}
            onClick={() => {
              window.open(addonVersion.downloadUrl);
            }}
          >
            Download
          </Button>
        </InputWrapper>
      ) : (
        <FileUpload
          label="File"
          required={!disabled}
          disabled={disabled}
          {...form.getInputProps('file')}
        />
      )}
      <InputWrapper label="Changelog" required mt={16} {...form.getInputProps('changelog')}>
        <RichTextEditor readOnly={disabled} {...form.getInputProps('changelog')} />
      </InputWrapper>
      {!disabled && (
        <Group>
          <Button type="submit" mt="xl" loading={loading}>
            {addonVersion ? 'Update' : 'Create'}
          </Button>
          <Button
            type="button"
            mt="xl"
            loading={loading}
            variant="subtle"
            component={Link}
            to={addonVersion ? `/addons/${addonVersion.addonId}` : '/my-addons'}
          >
            Cancel
          </Button>
        </Group>
      )}
    </form>
  );
}
