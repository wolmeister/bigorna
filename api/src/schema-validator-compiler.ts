/* eslint-disable no-param-reassign */
import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';
import { FastifySchema, FastifySchemaCompiler } from 'fastify';

type IsFileTypeKeywordParent = {
  type: string;
  isFileType?: boolean;
};

const createAjvInstance = () => {
  const ajv = new Ajv({
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    nullable: true,
  });
  ajvKeywords(ajv, 'instanceof');

  const fileSchemaValidation = ajv.compile({
    type: 'array',
    items: {
      additionalProperties: false,
      type: 'object',
      properties: {
        data: { instanceof: 'Buffer' },
        filename: { type: 'string' },
        encoding: { type: 'string' },
        mimetype: { type: 'string' },
      },
      required: ['data', 'filename', 'mimetype'],
    },
  });

  ajv.addKeyword('isFileType', {
    compile: (_, parent) => {
      // Change the schema type, as this is post validation it doesn't appear to error.
      (parent as IsFileTypeKeywordParent).type = 'file';
      delete (parent as IsFileTypeKeywordParent).isFileType;

      return data => fileSchemaValidation(data);
    },
  });

  return ajv;
};

// eslint-disable-next-line arrow-body-style
export const schemaValidatorCompiler: FastifySchemaCompiler<FastifySchema> = ({ schema }) => {
  return createAjvInstance().compile(schema);
};
