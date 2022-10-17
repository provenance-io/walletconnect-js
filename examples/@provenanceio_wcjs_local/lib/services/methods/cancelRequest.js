"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelRequest = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("@walletconnect/utils");

var _tx_pb = require("@provenanceio/wallet-utils/esm/proto/provenance/marker/v1/tx_pb");

var GoogleProtobufAnyPb = _interopRequireWildcard(require("google-protobuf/google/protobuf/any_pb"));

var _consts = require("../../consts");

var _utils2 = require("../../utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var cancelRequest = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(state, denom) {
    var valid, connector, address, walletApp, method, description, protoMessage, metadata, request, knownWalletApp, msgCancelRequest, msgAny, binary, message, hexMsg, eventData, result;
    return _regenerator.default.wrap(function _callee$(_context) {
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
              id: (0, _utils2.rngNum)(),
              jsonrpc: '2.0',
              method: method,
              params: [metadata]
            }; // Check for a known wallet app with special callback functions

            knownWalletApp = _consts.WALLET_LIST.find(function (wallet) {
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
            msgCancelRequest = new _tx_pb.MsgCancelRequest();
            msgCancelRequest.setDenom(denom);
            msgCancelRequest.setAdministrator(address);
            /* Convert the add marker message to any bytes for signing */

            msgAny = new GoogleProtobufAnyPb.Any();
            msgAny.pack(msgCancelRequest.serializeBinary(), protoMessage, '/');
            binary = String.fromCharCode.apply(String, (0, _toConsumableArray2.default)(msgAny.serializeBinary()));
            message = window.btoa(binary); // encode message (hex)

            hexMsg = (0, _utils.convertUtf8ToHex)(message);
            request.params.push(hexMsg);
            _context.prev = 19;

            // If the wallet app has an eventAction (web/extension) trigger it
            if (knownWalletApp && knownWalletApp.eventAction) {
              eventData = {
                event: _consts.WALLET_APP_EVENTS.EVENT
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

exports.cancelRequest = cancelRequest;