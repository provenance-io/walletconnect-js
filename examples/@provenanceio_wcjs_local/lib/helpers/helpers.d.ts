/// <reference types="node" />
export declare const sha256: (message: string) => Buffer;
export declare const verifySignature: (message: string, signature: Uint8Array, pubKeyB64: string) => Promise<boolean>;
