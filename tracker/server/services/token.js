import crypto from 'crypto';

// URL-safe random token. 21 bytes -> 28 base64url chars, ~166 bits of entropy.
// Used for both owner_token (kept secret in the creator's browser) and
// share_token (goes into the public /share/:token link). Never derive one
// from the other - they must be independent secrets.
export function generateToken() {
  return crypto.randomBytes(21).toString('base64url');
}
