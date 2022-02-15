import base64url from 'base64url';
import { createHash } from 'crypto';
import { ecdsaVerify } from 'secp256k1';

export const sha256 = (message: string) => createHash('sha256').update(Buffer.from(message,"utf-8")).digest();

export const verifySignature = async (
  message: string, signature: Uint8Array, pubKeyB64: string,
) => {
  const hash = sha256(message);
  const pubKeyDecoded = base64url.toBuffer(pubKeyB64);

  return ecdsaVerify(signature, hash, pubKeyDecoded)
};
