import {isHex, sha256, verifySignature} from "../../helpers";
import {ecdsaVerify} from "secp256k1";
import base64url from "base64url";
import {createHash} from "crypto";
import {convertUtf8ToHex} from "@walletconnect/utils";

describe(`test signing`, () => {
    it('is hex', () => {
        expect(isHex("0xdeadbeef")).toBe(false);
        expect(isHex("deadbeef")).toBe(true);
        expect(isHex("0123456789abcDEF")).toBe(true);
        expect(isHex("0123456789abcDEFg")).toBe(false);
        expect(isHex("")).toBe(false);
        expect(isHex("0")).toBe(true);

    })
    it(`should verify unprintable characters signature`, async () => {
        const hexMessage = 'deadbeef';
        const hexMessageBytes = Buffer.from(hexMessage, 'hex');
        const hexMessageHash = createHash('sha256').update(hexMessageBytes).digest();

        const pubkB64 = 'AhwcM7CrTH0iBc2pnhCltUJwpoRufulPUu6yv88w6Qh1';
        const pubkBytes = base64url.toBuffer(pubkB64);

        const signature = 'a74c498f2de8f2820f975570248f33d2b72521b6b03f0fd721419f0c020f8b9a481ba48c55d38ff70beec306d21506c5a165401d5cc36d5aec3f5c281ec1bdf0';
        const signatureBytes = Buffer.from(signature, 'hex');


        const ecdsaVerifyResult = ecdsaVerify(signatureBytes, hexMessageHash, pubkBytes);
        const wcVerifyResult = await verifySignature(hexMessage, signatureBytes, pubkB64);

        expect(ecdsaVerifyResult).toBe(true);
        expect(ecdsaVerifyResult).toBe(wcVerifyResult);
    }),
    it(`should verify jwt signature`, async () => {
        const jwt = 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJBaHdjTTdDclRIMGlCYzJwbmhDbHRVSndwb1J1ZnVsUFV1Nnl2ODh3NlFoMSIsImlzcyI6InByb3ZlbmFuY2UuaW8iLCJpYXQiOjE2Nzc1Mjc2NTksImV4cCI6MTY3NzUyODI1OSwiYWRkciI6InRwMTNka2g2bGhlNXp6ZmU0cXdrbDRmcXlmbWg1OHAzNXc1cWF4d3h5In0';
        const jwtHex = convertUtf8ToHex(jwt, true);
        const hexMessageBytes = Buffer.from(jwtHex, 'hex');
        const hexMessageHash = createHash('sha256').update(hexMessageBytes).digest();

        const pubkB64 = 'AhwcM7CrTH0iBc2pnhCltUJwpoRufulPUu6yv88w6Qh1';
        const pubkBytes = base64url.toBuffer(pubkB64);

        const signature = '8a2ed625c1c290317b98c653cc166249056010662fedac850c904e1ecf3b718b4c3dbd4e1fe986b62d7ccb31a6e152140442fa02d2a7ee40e6218ca31ee4d307';
        const signatureBytes = Buffer.from(signature, 'hex');

        const ecdsaVerifyResult = ecdsaVerify(signatureBytes, hexMessageHash, pubkBytes);
        const wcVerifyResult = await verifySignature(jwtHex, signatureBytes, pubkB64);

        expect(ecdsaVerifyResult).toBe(true);
        expect(ecdsaVerifyResult).toBe(wcVerifyResult);
    })
})
