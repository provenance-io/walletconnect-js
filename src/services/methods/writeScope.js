import { convertUtf8ToHex } from "@walletconnect/utils";
import { MsgWriteScopeRequest } from "@provenanceio/wallet-lib/lib/proto/provenance/metadata/v1/tx_pb";
import * as GoogleProtobufAnyPb from 'google-protobuf/google/protobuf/any_pb';

export const writeScope = async (state, data) => {
  const { connector, address } = state;
  const { scope, signersList, scopeUuid, specUuid } = data;
  const method = 'provenance_sendTransaction';
  const description = 'Write Scope';
  const protoMessage = 'provenance.marker.v1.MsgWriteScopeRequest';

  if (!connector) return { method, error: 'No wallet connected' };

  const msgWriteScopeRequest = new MsgWriteScopeRequest();
  msgWriteScopeRequest.setScope(scope);
  msgWriteScopeRequest.setSignersList(signersList);
  msgWriteScopeRequest.setScopeUuid(scopeUuid);
  msgWriteScopeRequest.setSpecUuid(specUuid);

  /* Convert the add marker message to any bytes for signing */
  const msgAny = new GoogleProtobufAnyPb.Any();
  msgAny.pack(msgWriteScopeRequest.serializeBinary(), protoMessage, '/');
  const binary = String.fromCharCode(...msgAny.serializeBinary());
  const message = btoa(binary);

  // encode message (hex)
  const hexMsg = convertUtf8ToHex(message);

  const metadata = JSON.stringify({
    description,
    address,
  });
  // provenance_signTransaction params
  const msgParams = [metadata, hexMsg];
  try {
    // Custom Request
    const customRequest = {
      id: 1,
      jsonrpc: "2.0",
      method,
      params: msgParams,
    };
    // send message
    const result = await connector.sendCustomRequest(customRequest);
    // TODO verify transaction ID
    const valid = !!result
    // result is a hex encoded signature
    return { method, valid, result, message, sendDetails: data };
  } catch (error) { return { method, valid: false, error }; }
};
