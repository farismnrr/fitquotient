import { Storage } from '@google-cloud/storage';
import { log } from '../utilities';

export const storageProvider = {
  provide: 'GCS_CLIENT',
  useFactory: () => {
    const { GCP_PROJECT_ID, GCP_KEYFILE_PATH, GOOGLE_APPLICATION_CREDENTIALS } =
      process.env;

    if (!GCP_PROJECT_ID && !GOOGLE_APPLICATION_CREDENTIALS) {
      log.warn('GCS not configured, returning null client');
      return null;
    }

    log.debug(`GCS Config - Project: ${GCP_PROJECT_ID}`);

    const opts: Record<string, unknown> = {};
    if (GCP_PROJECT_ID) opts.projectId = GCP_PROJECT_ID;
    if (GCP_KEYFILE_PATH) opts.keyFilename = GCP_KEYFILE_PATH;

    return new Storage(opts);
  },
};
