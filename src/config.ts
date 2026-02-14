/**
 * Configuration constants for ClawWorker Sandbox
 */

/** Port that the gateway listens on inside the container */
export const GATEWAY_PORT = 18789;

/** @deprecated Use GATEWAY_PORT */
export const MOLTBOT_PORT = GATEWAY_PORT;

/** Maximum time to wait for gateway to start (5 min for cold start + R2 restore + gateway bind) */
export const STARTUP_TIMEOUT_MS = 300_000;

/**
 * R2 bucket name for persistent storage.
 * Can be overridden via R2_BUCKET_NAME env var for test isolation.
 */
export function getR2BucketName(env?: { R2_BUCKET_NAME?: string }): string {
  const name = env?.R2_BUCKET_NAME?.trim();
  return name || 'clawworker-data';
}

/**
 * Get gateway token from env. Supports GATEWAY_TOKEN (preferred) and MOLTBOT_GATEWAY_TOKEN (legacy).
 */
export function getGatewayToken(env: { GATEWAY_TOKEN?: string; MOLTBOT_GATEWAY_TOKEN?: string }): string | undefined {
  return env.GATEWAY_TOKEN ?? env.MOLTBOT_GATEWAY_TOKEN;
}
