import convict from 'convict';

const NonEmptySafeStringFormatter = (value: unknown): string => {
  if (value === null || value === undefined) {
    throw new Error('Value cannot be null or undefined');
  }
  const stringValue = String(value);

  if (stringValue.length === 0) {
    throw new Error('Value cannot empty');
  }

  return stringValue;
};

export const config = convict({
  db: {
    url: {
      doc: 'Database URL',
      format: NonEmptySafeStringFormatter,
      default: '',
      env: 'DATABASE_URL',
    },
  },
  minio: {
    url: {
      doc: 'Minio URL',
      format: NonEmptySafeStringFormatter,
      default: '',
      env: 'MINIO_URL',
    },
    port: {
      doc: 'Minio port',
      format: 'int',
      default: 9000,
      env: 'MINIO_PORT',
    },
    accessKey: {
      doc: 'Minio access key',
      format: NonEmptySafeStringFormatter,
      default: '',
      env: 'MINIO_ACCESS_KEY',
    },
    privateKey: {
      doc: 'Minio secret key',
      format: NonEmptySafeStringFormatter,
      default: '',
      env: 'MINIO_SECRET_KEY',
    },
  },
}).validate({ allowed: 'strict' });
