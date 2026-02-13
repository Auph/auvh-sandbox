import type { Sandbox } from '@cloudflare/sandbox';
import type { MoltbotEnv } from '../types';
import { getR2BucketName } from '../config';

const RCLONE_CONF_PATH = '/root/.config/rclone/rclone.conf';

/**
 * Ensure rclone is configured in the container for R2 access.
 * Always writes current credentials so updated secrets take effect immediately.
 *
 * @returns true if rclone is configured, false if credentials are missing
 */
export async function ensureRcloneConfig(sandbox: Sandbox, env: MoltbotEnv): Promise<boolean> {
  const accessKey = env.R2_ACCESS_KEY_ID?.trim();
  const secretKey = env.R2_SECRET_ACCESS_KEY?.trim();
  const accountId = env.CF_ACCOUNT_ID?.trim();

  if (!accessKey || !secretKey || !accountId) {
    console.log(
      'R2 storage not configured (missing R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, or CF_ACCOUNT_ID)',
    );
    return false;
  }

  const rcloneConfig = [
    '[r2]',
    'type = s3',
    'provider = Cloudflare',
    `access_key_id = ${accessKey}`,
    `secret_access_key = ${secretKey}`,
    `endpoint = https://${accountId}.r2.cloudflarestorage.com`,
    'acl = private',
    'no_check_bucket = true',
  ].join('\n');

  await sandbox.exec(`mkdir -p $(dirname ${RCLONE_CONF_PATH})`);
  await sandbox.writeFile(RCLONE_CONF_PATH, rcloneConfig);

  console.log('Rclone configured for R2 bucket:', getR2BucketName(env));
  return true;
}
