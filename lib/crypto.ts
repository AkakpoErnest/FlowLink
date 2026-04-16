/**
 * AES-256-GCM helpers for encrypting sensitive values (e.g. agent private keys) at rest.
 *
 * Requires env var WALLET_ENCRYPTION_KEY — a 64-character hex string (32 bytes).
 * Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */
import crypto from 'crypto'

const ALGO = 'aes-256-gcm' as const
const KEY_ENV = 'WALLET_ENCRYPTION_KEY'

function getKey(): Buffer {
  const hex = process.env[KEY_ENV]
  if (!hex || hex.length !== 64) {
    throw new Error(
      `${KEY_ENV} must be a 64-character hex string (32 bytes). ` +
      `Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
    )
  }
  return Buffer.from(hex, 'hex')
}

/**
 * Encrypt a plaintext string (e.g. a hex private key).
 * Returns a single base64 blob: IV (12 bytes) + GCM auth tag (16 bytes) + ciphertext.
 */
export function encryptSecret(plaintext: string): string {
  const key = getKey()
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(ALGO, key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, encrypted]).toString('base64')
}

/**
 * Decrypt a blob produced by encryptSecret.
 * Throws if the key is wrong or the ciphertext has been tampered with.
 */
export function decryptSecret(encoded: string): string {
  const key = getKey()
  const buf = Buffer.from(encoded, 'base64')
  if (buf.length < 28) throw new Error('Invalid encrypted payload')
  const iv = buf.subarray(0, 12)
  const tag = buf.subarray(12, 28)
  const ciphertext = buf.subarray(28)
  const decipher = crypto.createDecipheriv(ALGO, key, iv)
  decipher.setAuthTag(tag)
  return decipher.update(ciphertext).toString('utf8') + decipher.final('utf8')
}
