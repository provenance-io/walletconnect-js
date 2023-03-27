import base64url from 'base64url';
import {createHash} from 'crypto';
import {ecdsaVerify} from 'secp256k1';

export const sha256 = (hexMessage: string) => createHash('sha256').update(Buffer.from(hexMessage, 'hex')).digest();
export const isHex = (hexMessage: string) => !!hexMessage.match("^[0-9a-fA-F]+$")

export const verifySignature = async (
    hexMessage: string, signature: Uint8Array, pubKeyB64: string,
) => {
    if (!isHex(hexMessage)) throw new Error("Message parameter is not a hex value.");

    const hash = sha256(hexMessage);
    const pubKeyDecoded = base64url.toBuffer(pubKeyB64);
    return ecdsaVerify(signature, hash, pubKeyDecoded);
};
