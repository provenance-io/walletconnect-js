import { convertUtf8ToHex } from "@walletconnect/utils";
import { MsgFinalizeRequest } from "@provenanceio/wallet-lib/lib/proto/provenance/marker/v1/tx_pb";
import * as GoogleProtobufAnyPb from 'google-protobuf/google/protobuf/any_pb';
import { MarkerData } from 'types';
import { State } from '../walletConnectService';

export const markerFinalize = async (state: State, data: MarkerData) => {
  let valid = false;
  const { connector, address } = state;
  const { denom, gasPrice } = data;
  const method = 'provenance_sendTransaction';
  const description = 'Finalize Marker';
  const protoMessage = 'provenance.marker.v1.MsgFinalizeMarker';
  const metadata = JSON.stringify({
    description,
    address,
    gasPrice,
  });
  // Custom Request
  const request = {
    id: 1,
    jsonrpc: "2.0",
    method,
    params: [metadata],
  };

  if (!connector) return { valid, data, request, error: 'No wallet connected' };

  const msgFinalizeRequest = new MsgFinalizeRequest();
  msgFinalizeRequest.setDenom(denom);
  msgFinalizeRequest.setAdministrator(address);

  /* Convert the add marker message to any bytes for signing */
  const msgAny = new GoogleProtobufAnyPb.Any();
  msgAny.pack(msgFinalizeRequest.serializeBinary(), protoMessage, '/');
  const binary = String.fromCharCode(...msgAny.serializeBinary());
  const message = window.btoa(binary);

  // encode message (hex)
  const hexMsg = convertUtf8ToHex(message);
  request.params.push(hexMsg);
  try {
    // send message
    const result = await connector.sendCustomRequest(request);
    // TODO verify transaction ID
    valid = !!result
    // result is a hex encoded signature
    return { valid, result, data, request };
  } catch (error) { return { valid, error, data, request }; }
};
