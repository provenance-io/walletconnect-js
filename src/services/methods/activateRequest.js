import { convertUtf8ToHex } from "@walletconnect/utils";
import { MsgActivateRequest } from "@provenanceio/wallet-lib/lib/proto/provenance/marker/v1/tx_pb";
import * as GoogleProtobufAnyPb from 'google-protobuf/google/protobuf/any_pb';
// import * as jspb from "google-protobuf";

// Wallet-lib delegate message proto:
// https://github.com/provenance-io/wallet-lib/blob/bac70a7fe6a9ad784ff4cc7fe440b68cfe598c47/src/services/message-service.ts#L396
export const activateRequest = async (state, data) => {
  const { connector, address } = state;
  const { denom, administrator } = data;
  const method = 'provenance_sendTransaction';
  const description = 'Activate Request';
  const protoMessage = 'provenance.marker.v1.MsgActivateRequest';

  if (!connector) return { method, error: 'No wallet connected' };

  const msgActivateRequest = new MsgActivateRequest();
  msgActivateRequest.setDenom(denom);
  msgActivateRequest.setAdministrator(administrator);

  /* Convert the add marker message to any bytes for signing */
  const msgAny = new GoogleProtobufAnyPb.Any();
  msgAny.pack(msgActivateRequest.serializeBinary(), protoMessage, '/');
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
