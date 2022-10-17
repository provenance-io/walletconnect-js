import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { convertUtf8ToHex } from '@walletconnect/utils';
import { buildMessage, createAnyMessageBase64 } from '@provenanceio/wallet-utils';
import { WALLET_LIST, WALLET_APP_EVENTS } from '../../consts';
import { rngNum } from '../../utils';
export var sendCoin = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(state, data) {
    var valid, connector, address, walletApp, toAddress, initialAmount, _data$denom, initialDenom, gasPrice, method, type, amount, denom, amountString, description, sendMessage, metadata, request, knownWalletApp, messageMsgSend, message, hexMsg, eventData, result;

    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            valid = false;
            connector = state.connector, address = state.address, walletApp = state.walletApp;
            toAddress = data.to, initialAmount = data.amount, _data$denom = data.denom, initialDenom = _data$denom === void 0 ? 'hash' : _data$denom, gasPrice = data.gasPrice;
            method = 'provenance_sendTransaction';
            type = 'MsgSend';
            amount = initialAmount;
            denom = initialDenom.toLowerCase();

            if (denom === 'hash') {
              // Convert hash amount to nhash (cannot send hash, can only send nhash)
              amount = initialAmount * Math.pow(10, 9);
              denom = 'nhash';
            } // Set amount to string value


            amountString = "".concat(amount);
            description = "Send Coin (".concat(denom, ")");
            sendMessage = {
              fromAddress: address,
              toAddress: toAddress,
              amountList: [{
                denom: denom,
                amount: amountString
              }]
            };
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
              _context.next = 16;
              break;
            }

            return _context.abrupt("return", {
              valid: valid,
              data: data,
              request: request,
              error: 'No wallet connected'
            });

          case 16:
            messageMsgSend = buildMessage(type, sendMessage);
            message = createAnyMessageBase64(type, messageMsgSend); // encode message (hex)

            hexMsg = convertUtf8ToHex(message);
            request.params.push(hexMsg);
            _context.prev = 20;

            // If the wallet app has an eventAction (web/extension) trigger it
            if (knownWalletApp && knownWalletApp.eventAction) {
              eventData = {
                event: WALLET_APP_EVENTS.EVENT
              };
              knownWalletApp.eventAction(eventData);
            } // send message


            _context.next = 24;
            return connector.sendCustomRequest(request);

          case 24:
            result = _context.sent;
            // TODO verify transaction ID
            valid = !!result; // result is a hex encoded signature

            return _context.abrupt("return", {
              valid: valid,
              result: result,
              data: data,
              request: request
            });

          case 29:
            _context.prev = 29;
            _context.t0 = _context["catch"](20);
            return _context.abrupt("return", {
              valid: valid,
              error: _context.t0,
              data: data,
              request: request
            });

          case 32:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[20, 29]]);
  }));

  return function sendCoin(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();