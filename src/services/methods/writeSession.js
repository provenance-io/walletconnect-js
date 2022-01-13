import { convertUtf8ToHex } from "@walletconnect/utils";
import { MsgWriteSessionRequest } from "@provenanceio/wallet-lib/lib/proto/provenance/metadata/v1/tx_pb";
import * as GoogleProtobufAnyPb from 'google-protobuf/google/protobuf/any_pb';

export const writeSession = async (state, data) => {
  const { connector, address } = state;
  const { session, signersList, sessionIdComponents, specUuid } = data;
  const method = 'provenance_sendTransaction';
  const description = 'Write Session';
  const protoMessage = 'provenance.marker.v1.MsgWriteSessionRequest';

  if (!connector) return { method, error: 'No wallet connected' };

  const msgWriteSessionRequest = new MsgWriteSessionRequest();
  /*
    ***** wallet-lib MsgWriteSessionRequest *****
    setSession [object]
      - setSessionId [string]
      - setSpecificationId [string]
      - setPartiesList [array]
      - setName [string]
      - setContext [string]
      - setAudit [object]
        - setCreatedDate [object]
          - seconds: [number]
          - nanos: [number]
        - setCreatedBy [string]
        - setUpdatedDate [object]
          - seconds: [number]
          - nanos: [number]
        - setUpdatedBy [string]
        - setVersion [number]
        - setMessage [string]
    setSignersList [array]
    setSessionIdComponents [object]
      - setScopeUuid [string]
      - setScopeAddr [string]
      - setSessionUuid [string]
    setSpecUuid [string]
  */
    msgWriteSessionRequest.setSession(session);
    msgWriteSessionRequest.setSignersList(signersList);
    msgWriteSessionRequest.setSessionIdComponents(sessionIdComponents);
    msgWriteSessionRequest.setSpecUuid(specUuid);

  /* Convert the add marker message to any bytes for signing */
  const msgAny = new GoogleProtobufAnyPb.Any();
  msgAny.pack(msgWriteSessionRequest.serializeBinary(), protoMessage, '/');
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
