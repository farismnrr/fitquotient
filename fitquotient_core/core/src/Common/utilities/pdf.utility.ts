import { log } from './logger.utility';
import pdf from 'pdf-parse';

export interface PdfParseResult {
  text?: string;
  numpages?: number;
  numrender?: number;
  info?: unknown;
  metadata?: unknown;
  version?: string;
}

/**
 * Parse a PDF buffer and log the parsed text via log.debug.
 * Returns the raw parse result - callers can choose to ignore it.
 * This utility is intentionally minimal: it only parses and logs.
 */
export async function parsePdfBuffer(
  buffer: Buffer,
): Promise<PdfParseResult | null> {
  if (!buffer || buffer.length === 0) return null;

  try {
    const pdfFn = pdf as unknown as (
      data: Buffer,
      options?: unknown,
    ) => Promise<PdfParseResult>;
    const result = await pdfFn(buffer);

    const snippet = (result?.text ?? '').slice(0, 1000);
    log.debug(`PDF parse result snippet: ${snippet}`);

    return result;
  } catch (err: unknown) {
    log.debug(`PDF parse failed: ${String(err)}`);
    return null;
  }
}
