import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { convertUtf8ToHex } from '@walletconnect/utils';
import { MsgCancelRequest } from '@provenanceio/wallet-utils/esm/proto/provenance/marker/v1/tx_pb';
import * as GoogleProtobufAnyPb from 'google-protobuf/google/protobuf/any_pb';
import { WALLET_LIST, WALLET_APP_EVENTS } from '../../consts';
import { rngNum } from '../../utils';
export var cancelRequest = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(state, denom) {
    var valid, connector, address, walletApp, method, description, protoMessage, metadata, request, knownWalletApp, msgCancelRequest, msgAny, binary, message, hexMsg, eventData, result;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            valid = false;
            connector = state.connector, address = state.address, walletApp = state.walletApp;
            method = 'provenance_sendTransaction';
            description = 'Cancel Request';
            protoMessage = 'provenance.marker.v1.MsgCancelRequest';
            metadata = JSON.stringify({
              description: description,
              address: address,
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
              _context.next = 10;
              break;
            }

            return _context.abrupt("return", {
              valid: valid,
              data: denom,
              request: request,
              error: 'No wallet connected'
            });

          case 10:
            msgCancelRequest = new MsgCancelRequest();
            msgCancelRequest.setDenom(denom);
            msgCancelRequest.setAdministrator(address);
            /* Convert the add marker message to any bytes for signing */

            msgAny = new GoogleProtobufAnyPb.Any();
            msgAny.pack(msgCancelRequest.serializeBinary(), protoMessage, '/');
            binary = String.fromCharCode.apply(String, _toConsumableArray(msgAny.serializeBinary()));
            message = window.btoa(binary); // encode message (hex)

            hexMsg = convertUtf8ToHex(message);
            request.params.push(hexMsg);
            _context.prev = 19;

            // If the wallet app has an eventAction (web/extension) trigger it
            if (knownWalletApp && knownWalletApp.eventAction) {
              eventData = {
                event: WALLET_APP_EVENTS.EVENT
              };
              knownWalletApp.eventAction(eventData);
            } // send message


            _context.next = 23;
            return connector.sendCustomRequest(request);

          case 23:
            result = _context.sent;
            // TODO verify transaction ID
            valid = !!result; // result is a hex encoded signature

            return _context.abrupt("return", {
              valid: valid,
              result: result,
              data: denom,
              request: request
            });

          case 28:
            _context.prev = 28;
            _context.t0 = _context["catch"](19);
            return _context.abrupt("return", {
              valid: valid,
              error: _context.t0,
              data: denom,
              request: request
            });

          case 31:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[19, 28]]);
  }));

  return function cancelRequest(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();