import { createHash } from 'crypto';
import { fromBase58 } from 'bip32';
import { ecdsaVerify } from 'secp256k1';

export const sha256 = (message) => createHash('sha256').update(Buffer.from(message,"utf-8")).digest();

export const verifySignature = async (
  message, signature, publicKey, network,
) => {
  const hash = sha256(message);
  const { publicKey: decodedPublicKey } = fromBase58(publicKey, network);
  return ecdsaVerify(signature, hash, decodedPublicKey)
};
