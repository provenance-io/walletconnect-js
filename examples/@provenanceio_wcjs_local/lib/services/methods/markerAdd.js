"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.markerAdd = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("@walletconnect/utils");

var _accessgrant_pb = require("@provenanceio/wallet-utils/esm/proto/provenance/marker/v1/accessgrant_pb");

var _marker_pb = require("@provenanceio/wallet-utils/esm/proto/provenance/marker/v1/marker_pb");

var _tx_pb = require("@provenanceio/wallet-utils/esm/proto/provenance/marker/v1/tx_pb");

var _coin_pb = require("@provenanceio/wallet-utils/esm/proto/cosmos/base/v1beta1/coin_pb");

var GoogleProtobufAnyPb = _interopRequireWildcard(require("google-protobuf/google/protobuf/any_pb"));

var _consts = require("../../consts");

var _utils2 = require("../../utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Wallet-lib delegate message proto:
// https://github.com/provenance-io/wallet-lib/blob/bac70a7fe6a9ad784ff4cc7fe440b68cfe598c47/src/services/message-service.ts#L396
var markerAdd = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(state, data) {
    var valid, connector, address, walletApp, denom, amount, gasPrice, method, description, markerMsg, metadata, request, knownWalletApp, accessGrant, msgAddMarkerRequest, coin, msgAny, binary, message, hexMsg, eventData, result;
    return _regenerator.default.wrap(function _callee$(_context) {
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
            /* Build the Provnance blockchain add marker msg */
            accessGrant = new _accessgrant_pb.AccessGrant();
            accessGrant.setAddress(address);
            accessGrant.setPermissionsList([_accessgrant_pb.Access.ACCESS_ADMIN, _accessgrant_pb.Access.ACCESS_BURN, _accessgrant_pb.Access.ACCESS_MINT, _accessgrant_pb.Access.ACCESS_DEPOSIT, _accessgrant_pb.Access.ACCESS_WITHDRAW, _accessgrant_pb.Access.ACCESS_DELETE]);
            msgAddMarkerRequest = new _tx_pb.MsgAddMarkerRequest();
            msgAddMarkerRequest.setFromAddress(address);
            msgAddMarkerRequest.setManager(address);
            msgAddMarkerRequest.addAccessList(accessGrant);
            coin = new _coin_pb.Coin();
            coin.setAmount(amount.toString());
            coin.setDenom(denom);
            msgAddMarkerRequest.setAmount(coin);
            msgAddMarkerRequest.setMarkerType(_marker_pb.MarkerType.MARKER_TYPE_COIN);
            msgAddMarkerRequest.setStatus(_marker_pb.MarkerStatus.MARKER_STATUS_FINALIZED);
            msgAddMarkerRequest.setSupplyFixed(true);
            /* Convert the add marker message to any bytes for signing */

            msgAny = new GoogleProtobufAnyPb.Any();
            msgAny.pack(msgAddMarkerRequest.serializeBinary(), markerMsg, '/');
            binary = String.fromCharCode.apply(String, (0, _toConsumableArray2.default)(msgAny.serializeBinary()));
            message = window.btoa(binary); // encode message (hex)

            hexMsg = (0, _utils.convertUtf8ToHex)(message);
            request.params.push(hexMsg);
            _context.prev = 31;

            // If the wallet app has an eventAction (web/extension) trigger it
            if (knownWalletApp && knownWalletApp.eventAction) {
              eventData = {
                event: _consts.WALLET_APP_EVENTS.EVENT
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

exports.markerAdd = markerAdd;