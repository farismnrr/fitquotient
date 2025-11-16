import { PDFParse } from 'pdf-parse';

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
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    result?.text?.slice(0, 1000);

    return result;
  } catch {
    return null;
  }
}
