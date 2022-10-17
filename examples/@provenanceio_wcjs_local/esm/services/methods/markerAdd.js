import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { convertUtf8ToHex } from '@walletconnect/utils';
import { Access, AccessGrant } from '@provenanceio/wallet-utils/esm/proto/provenance/marker/v1/accessgrant_pb';
import { MarkerStatus, MarkerType } from '@provenanceio/wallet-utils/esm/proto/provenance/marker/v1/marker_pb';
import { MsgAddMarkerRequest } from '@provenanceio/wallet-utils/esm/proto/provenance/marker/v1/tx_pb';
import { Coin } from '@provenanceio/wallet-utils/esm/proto/cosmos/base/v1beta1/coin_pb';
import * as GoogleProtobufAnyPb from 'google-protobuf/google/protobuf/any_pb';
import { WALLET_LIST, WALLET_APP_EVENTS } from '../../consts';
import { rngNum } from '../../utils'; // Wallet-lib delegate message proto:
// https://github.com/provenance-io/wallet-lib/blob/bac70a7fe6a9ad784ff4cc7fe440b68cfe598c47/src/services/message-service.ts#L396

export var markerAdd = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(state, data) {
    var valid, connector, address, walletApp, denom, amount, gasPrice, method, description, markerMsg, metadata, request, knownWalletApp, accessGrant, msgAddMarkerRequest, coin, msgAny, binary, message, hexMsg, eventData, result;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            valid = false;
            connector = state.connector, address = state.address, walletApp = state.walletApp;
            denom = data.denom, amount = data.amount, gasPrice = data.gasPrice;
            method = 'provenance_sendTransaction';
            description = 'Add Marker';
            markerMsg = 'provenance.marker.v1.MsgAddMarkerRequest';
            metadata = JSON.stringify({
              description: description,
              address: address,
              gasPrice: gasPrice,
              date: Date.now()
            }); // Custom Request

            request = {
              id: rngNum(),
              jsonrpc: '2.0',
              method: method,
              params: [metadata]
            }; // Check for a known wallet app with special callback functions

            knownWalletApp = WALLET_LIST.find(function (wallet) {
              return wallet.id === walletApp;
            });

            if (connector) {
              _context.next = 11;
              break;
            }

            return _context.abrupt("return", {
              valid: valid,
              data: data,
              request: request,
              error: 'No wallet connected'
            });

          case 11:
            /* Build the Provnance blockchain add marker msg */
            accessGrant = new AccessGrant();
            accessGrant.setAddress(address);
            accessGrant.setPermissionsList([Access.ACCESS_ADMIN, Access.ACCESS_BURN, Access.ACCESS_MINT, Access.ACCESS_DEPOSIT, Access.ACCESS_WITHDRAW, Access.ACCESS_DELETE]);
            msgAddMarkerRequest = new MsgAddMarkerRequest();
            msgAddMarkerRequest.setFromAddress(address);
            msgAddMarkerRequest.setManager(address);
            msgAddMarkerRequest.addAccessList(accessGrant);
            coin = new Coin();
            coin.setAmount(amount.toString());
            coin.setDenom(denom);
            msgAddMarkerRequest.setAmount(coin);
            msgAddMarkerRequest.setMarkerType(MarkerType.MARKER_TYPE_COIN);
            msgAddMarkerRequest.setStatus(MarkerStatus.MARKER_STATUS_FINALIZED);
            msgAddMarkerRequest.setSupplyFixed(true);
            /* Convert the add marker message to any bytes for signing */

            msgAny = new GoogleProtobufAnyPb.Any();
            msgAny.pack(msgAddMarkerRequest.serializeBinary(), markerMsg, '/');
            binary = String.fromCharCode.apply(String, _toConsumableArray(msgAny.serializeBinary()));
            message = window.btoa(binary); // encode message (hex)

            hexMsg = convertUtf8ToHex(message);
            request.params.push(hexMsg);
            _context.prev = 31;

            // If the wallet app has an eventAction (web/extension) trigger it
            if (knownWalletApp && knownWalletApp.eventAction) {
              eventData = {
                event: WALLET_APP_EVENTS.EVENT
              };
              knownWalletApp.eventAction(eventData);
            } // send message


            _context.next = 35;
            return connector.sendCustomRequest(request);

          case 35:
            result = _context.sent;
            // TODO verify transaction ID
            valid = !!result; // result is a hex encoded signature

            return _context.abrupt("return", {
              valid: valid,
              result: result,
              data: data,
              request: request
            });

          case 40:
            _context.prev = 40;
            _context.t0 = _context["catch"](31);
            return _context.abrupt("return", {
              valid: valid,
              error: _context.t0,
              data: data,
              request: request
            });

          case 43:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[31, 40]]);
  }));

  return function markerAdd(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();