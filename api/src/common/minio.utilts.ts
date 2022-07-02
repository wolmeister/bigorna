import { config } from '../config';

export function getPermanentUrl(bucket: string, object: string): string {
  const url = config.get('minio.url');
  const port = config.get('minio.port');
  return `http://${url}:${port}/${bucket}/${object}`;
}
