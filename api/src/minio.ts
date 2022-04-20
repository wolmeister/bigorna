import { Client as MinioClient } from 'minio';

import { config } from './config';

export const minioClient = new MinioClient({
  endPoint: config.get('minio.url'),
  port: config.get('minio.port'),
  useSSL: false,
  accessKey: config.get('minio.accessKey'),
  secretKey: config.get('minio.privateKey'),
});
