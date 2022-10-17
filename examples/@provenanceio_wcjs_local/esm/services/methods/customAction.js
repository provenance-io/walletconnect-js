import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { convertUtf8ToHex } from '@walletconnect/utils';
import { WALLET_LIST, WALLET_APP_EVENTS } from '../../consts';
import { rngNum } from '../../utils';
export var customAction = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(state, data) {
    var _request$params;

    var valid, rawB64Message, _data$description, description, _data$method, method, gasPrice, connector, address, walletApp, metadata, request, knownWalletApp, b64MessageArray, hexMsgArray, eventData, result;

    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            valid = false;
            rawB64Message = data.message, _data$description = data.description, description = _data$description === void 0 ? 'Custom Action' : _data$description, _data$method = data.method, method = _data$method === void 0 ? 'provenance_sendTransaction' : _data$method, gasPrice = data.gasPrice;
            connector = state.connector, address = state.address, walletApp = state.walletApp;
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
              _context.next = 8;
              break;
            }

            return _context.abrupt("return", {
              valid: valid,
              data: data,
              request: request,
              error: 'No wallet connected'
            });

          case 8:
            // If message isn't an array, turn it into one
            b64MessageArray = Array.isArray(rawB64Message) ? rawB64Message : [rawB64Message]; // Convert to hex

            hexMsgArray = b64MessageArray.map(function (msg) {
              return convertUtf8ToHex(msg);
            });

            (_request$params = request.params).push.apply(_request$params, _toConsumableArray(hexMsgArray));

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
            // TODO verify transaction ID
            valid = !!result; // result is a hex encoded signature

            return _context.abrupt("return", {
              valid: valid,
              result: result,
              data: data,
              request: request
            });

          case 20:
            _context.prev = 20;
            _context.t0 = _context["catch"](11);
            return _context.abrupt("return", {
              valid: valid,
              error: _context.t0,
              data: data,
              request: request
            });

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[11, 20]]);
  }));

  return function customAction(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();