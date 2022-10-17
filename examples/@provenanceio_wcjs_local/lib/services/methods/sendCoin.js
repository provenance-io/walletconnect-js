"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendCoin = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("@walletconnect/utils");

var _walletUtils = require("@provenanceio/wallet-utils");

var _consts = require("../../consts");

var _utils2 = require("../../utils");

var sendCoin = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(state, data) {
    var valid, connector, address, walletApp, toAddress, initialAmount, _data$denom, initialDenom, gasPrice, method, type, amount, denom, amountString, description, sendMessage, metadata, request, knownWalletApp, messageMsgSend, message, hexMsg, eventData, result;

    return _regenerator.default.wrap(function _callee$(_context) {
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
              id: (0, _utils2.rngNum)(),
              jsonrpc: '2.0',
              method: method,
              params: [metadata]
            }; // Check for a known wallet app with special callback functions

            knownWalletApp = _consts.WALLET_LIST.find(function (wallet) {
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
            messageMsgSend = (0, _walletUtils.buildMessage)(type, sendMessage);
            message = (0, _walletUtils.createAnyMessageBase64)(type, messageMsgSend); // encode message (hex)

            hexMsg = (0, _utils.convertUtf8ToHex)(message);
            request.params.push(hexMsg);
            _context.prev = 20;

            // If the wallet app has an eventAction (web/extension) trigger it
            if (knownWalletApp && knownWalletApp.eventAction) {
              eventData = {
                event: _consts.WALLET_APP_EVENTS.EVENT
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

exports.sendCoin = sendCoin;