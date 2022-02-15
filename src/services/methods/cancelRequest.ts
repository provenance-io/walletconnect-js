import { convertUtf8ToHex } from "@walletconnect/utils";
import { MsgCancelRequest } from "@provenanceio/wallet-lib/lib/proto/provenance/marker/v1/tx_pb";
import * as GoogleProtobufAnyPb from 'google-protobuf/google/protobuf/any_pb';
import { State } from '../walletConnectService';

export const cancelRequest = async (state: State, denom: string) => {
  const { connector, address } = state;
  const method = 'provenance_sendTransaction';
  const description = 'Cancel Request';
  const protoMessage = 'provenance.marker.v1.MsgCancelRequest';

  if (!connector) return { method, error: 'No wallet connected' };

  const msgCancelRequest = new MsgCancelRequest();
  msgCancelRequest.setDenom(denom);
  msgCancelRequest.setAdministrator(address);

  /* Convert the add marker message to any bytes for signing */
  const msgAny = new GoogleProtobufAnyPb.Any();
  msgAny.pack(msgCancelRequest.serializeBinary(), protoMessage, '/');
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
    return { method, valid, result, message, sendDetails: denom };
  } catch (error) { return { method, valid: false, error }; }
};
