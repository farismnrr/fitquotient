import type { FastifyRequest } from 'fastify';

export type FastifyFileData = {
  file: NodeJS.ReadableStream;
  filename: string;
  mimetype: string;
};

export type FastifyMultipartFile = {
  file: NodeJS.ReadableStream;
  filename: string;
  mimetype: string;
  fieldname?: string;
};

export type FastifyMultipartField = {
  fieldname: string;
  value: string;
};

export type FastifyMultipartPart = FastifyMultipartFile | FastifyMultipartField;

export type FastifyRequestWithMultipart = FastifyRequest & {
  file?: () => Promise<FastifyFileData>;
  parts?: () => AsyncIterable<FastifyMultipartPart>;
  body?: { name?: string };
};

export const isFilePart = (part: unknown): part is FastifyMultipartFile => {
  if (typeof part !== 'object' || part === null) return false;
  const p = part as Record<string, unknown>;
  return (
    'file' in p &&
    'filename' in p &&
    'mimetype' in p &&
    typeof p.filename === 'string'
  );
};

export const isFieldPart = (part: unknown): part is FastifyMultipartField => {
  if (typeof part !== 'object' || part === null) return false;
  const p = part as Record<string, unknown>;
  return (
    'fieldname' in p &&
    'value' in p &&
    typeof p.fieldname === 'string' &&
    typeof p.value === 'string'
  );
};
