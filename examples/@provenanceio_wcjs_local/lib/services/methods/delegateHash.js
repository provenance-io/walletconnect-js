"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.delegateHash = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("@walletconnect/utils");

var _walletUtils = require("@provenanceio/wallet-utils");

var _consts = require("../../consts");

var _utils2 = require("../../utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

// Wallet-lib delegate message proto:
// https://github.com/provenance-io/wallet-lib/blob/bac70a7fe6a9ad784ff4cc7fe440b68cfe598c47/src/services/message-service.ts#L396
var delegateHash = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(state, data) {
    var valid, method, type, description, connector, address, walletApp, validatorAddress, sendAmountHash, gasPrice, metadata, request, knownWalletApp, sendAmountNHash, sendMessage, messageMsgSend, message, hexMsg, sentAmount, eventData, result;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            valid = false;
            method = 'provenance_sendTransaction';
            type = 'MsgDelegate';
            description = 'Delegate Hash';
            connector = state.connector, address = state.address, walletApp = state.walletApp;
            validatorAddress = data.validatorAddress, sendAmountHash = data.amount, gasPrice = data.gasPrice;
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
            // Convert hash amount to nhash (cannot send hash, can only send nhash)
            sendAmountNHash = sendAmountHash * Math.pow(10, 9);
            sendMessage = {
              delegatorAddress: address,
              validatorAddress: validatorAddress,
              amount: {
                denom: 'nhash',
                amount: sendAmountNHash
              }
            };
            messageMsgSend = (0, _walletUtils.buildMessage)(type, sendMessage);
            message = (0, _walletUtils.createAnyMessageBase64)(type, messageMsgSend); // encode message (hex)

            hexMsg = (0, _utils.convertUtf8ToHex)(message);
            request.params.push(hexMsg); // Convert the amountList back into Hash (was converted to nHash before sending)

            sentAmount = {
              denom: 'hash',
              amount: sendAmountHash
            };
            _context.prev = 18;

            // If the wallet app has an eventAction (web/extension) trigger it
            if (knownWalletApp && knownWalletApp.eventAction) {
              eventData = {
                event: _consts.WALLET_APP_EVENTS.EVENT
              };
              knownWalletApp.eventAction(eventData);
            } // send message


            _context.next = 22;
            return connector.sendCustomRequest(request);

          case 22:
            result = _context.sent;
            // TODO verify transaction ID
            valid = !!result; // result is a hex encoded signature

            return _context.abrupt("return", {
              valid: valid,
              result: result,
              data: _objectSpread(_objectSpread({}, data), {}, {
                sentAmount: sentAmount
              }),
              request: request
            });

          case 27:
            _context.prev = 27;
            _context.t0 = _context["catch"](18);
            return _context.abrupt("return", {
              valid: valid,
              error: _context.t0,
              data: _objectSpread(_objectSpread({}, data), {}, {
                sentAmount: sentAmount
              }),
              request: request
            });

          case 30:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[18, 27]]);
  }));

  return function delegateHash(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.delegateHash = delegateHash;