import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { convertUtf8ToHex } from '@walletconnect/utils';
import { verifySignature } from '../../helpers';
import { WALLET_LIST, WALLET_APP_EVENTS } from '../../consts';
import { rngNum } from '../../utils';
export var signMessage = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(state, message) {
    var valid, connector, address, pubKeyB64, walletApp, method, description, metadata, request, knownWalletApp, hexMsg, eventData, result, signature;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            valid = false;
            connector = state.connector, address = state.address, pubKeyB64 = state.publicKey, walletApp = state.walletApp;
            method = 'provenance_sign';
            description = 'Sign Message';
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
              _context.next = 9;
              break;
            }

            return _context.abrupt("return", {
              valid: valid,
              data: message,
              request: request,
              error: 'No wallet connected'
            });

          case 9:
            // encode message (hex)
            hexMsg = convertUtf8ToHex(message);
            request.params.push(hexMsg);
            _context.prev = 11;

            // If the wallet app has an eventAction (web/extension) trigger it
            if (knownWalletApp && knownWalletApp.eventAction) {
              eventData = {
                event: WALLET_APP_EVENTS.EVENT
              };
              knownWalletApp.eventAction(eventData);
            } // send message


            _context.next = 15;
            return connector.sendCustomRequest(request);

          case 15:
            result = _context.sent;
            // result is a hex encoded signature
            signature = Uint8Array.from(Buffer.from(result, 'hex')); // verify signature

            _context.next = 19;
            return verifySignature(message, signature, pubKeyB64);

          case 19:
            valid = _context.sent;
            return _context.abrupt("return", {
              valid: valid,
              result: result,
              data: message,
              request: request
            });

          case 23:
            _context.prev = 23;
            _context.t0 = _context["catch"](11);
            return _context.abrupt("return", {
              valid: valid,
              error: _context.t0,
              data: message,
              request: request
            });

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[11, 23]]);
  }));

  return function signMessage(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();