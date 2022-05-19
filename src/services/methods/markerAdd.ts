import { convertUtf8ToHex } from "@walletconnect/utils";
import { Access, AccessGrant } from "@provenanceio/wallet-lib/lib/proto/provenance/marker/v1/accessgrant_pb";
import { MarkerStatus, MarkerType } from "@provenanceio/wallet-lib/lib/proto/provenance/marker/v1/marker_pb";
import { MsgAddMarkerRequest } from "@provenanceio/wallet-lib/lib/proto/provenance/marker/v1/tx_pb";
import { Coin } from "@provenanceio/wallet-lib/lib/proto/cosmos/base/v1beta1/coin_pb";
import * as GoogleProtobufAnyPb from 'google-protobuf/google/protobuf/any_pb';
import { MarkerAddData } from '../../types';
import { State } from '../walletConnectService';

// Wallet-lib delegate message proto:
// https://github.com/provenance-io/wallet-lib/blob/bac70a7fe6a9ad784ff4cc7fe440b68cfe598c47/src/services/message-service.ts#L396
export const markerAdd = async (state: State, data: MarkerAddData) => {
  let valid = false;
  const { connector, address } = state;
  const { denom, amount, gasPrice } = data;
  const method = 'provenance_sendTransaction';
  const description = 'Add Marker';
  const markerMsg = 'provenance.marker.v1.MsgAddMarkerRequest';
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

  /* Build the Provnance blockchain add marker msg */
  const accessGrant = new AccessGrant();
  accessGrant.setAddress(address);
  accessGrant.setPermissionsList([
    Access.ACCESS_ADMIN,
    Access.ACCESS_BURN,
    Access.ACCESS_MINT,
    Access.ACCESS_DEPOSIT,
    Access.ACCESS_WITHDRAW,
    Access.ACCESS_DELETE
  ]);

  const msgAddMarkerRequest = new MsgAddMarkerRequest();
  msgAddMarkerRequest.setFromAddress(address);
  msgAddMarkerRequest.setManager(address);
  msgAddMarkerRequest.addAccessList(accessGrant);

  const coin = new Coin();
  coin.setAmount(amount.toString());
  coin.setDenom(denom);
  msgAddMarkerRequest.setAmount(coin);
  msgAddMarkerRequest.setMarkerType(MarkerType.MARKER_TYPE_COIN);
  msgAddMarkerRequest.setStatus(MarkerStatus.MARKER_STATUS_FINALIZED);
  msgAddMarkerRequest.setSupplyFixed(true);

  /* Convert the add marker message to any bytes for signing */
  const msgAny = new GoogleProtobufAnyPb.Any();
  msgAny.pack(msgAddMarkerRequest.serializeBinary(), markerMsg, '/');
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
