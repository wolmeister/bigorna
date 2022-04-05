import { TSchema } from '@sinclair/typebox';

export interface TDateType extends TSchema {
  $static: Date | string; // allow both Date and string
  type: 'string';
  format: 'date-time';
}

export function DateType(): TDateType {
  return { type: 'string', format: 'date-time' } as never;
}
