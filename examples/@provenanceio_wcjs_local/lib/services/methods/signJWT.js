"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signJWT = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _base64url = _interopRequireDefault(require("base64url"));

var _utils = require("@walletconnect/utils");

var _helpers = require("../../helpers");

var _consts = require("../../consts");

var _utils2 = require("../../utils");

var signJWT = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(state, setState, expires) {
    var valid, now, defaultExpires, finalExpires, connector, address, pubKeyB64, walletApp, method, description, metadata, request, knownWalletApp, header, headerEncoded, payload, payloadEncoded, JWT, hexJWT, eventData, result, signature, signedPayloadEncoded, signedJWT;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            valid = false;
            now = Math.floor(Date.now() / 1000); // Current time

            defaultExpires = now + 86400; // (24hours)

            finalExpires = expires || defaultExpires;
            connector = state.connector, address = state.address, pubKeyB64 = state.publicKey, walletApp = state.walletApp;
            method = 'provenance_sign';
            description = 'Sign JWT Token';
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
              _context.next = 12;
              break;
            }

            return _context.abrupt("return", {
              valid: valid,
              data: finalExpires,
              request: request,
              error: 'No wallet connected'
            });

          case 12:
            // Build JWT
            header = JSON.stringify({
              alg: 'ES256K',
              typ: 'JWT'
            });
            headerEncoded = (0, _base64url.default)(header);
            payload = JSON.stringify({
              sub: pubKeyB64,
              iss: 'provenance.io',
              iat: now,
              exp: finalExpires,
              addr: address
            });
            payloadEncoded = (0, _base64url.default)(payload);
            JWT = "".concat(headerEncoded, ".").concat(payloadEncoded);
            hexJWT = (0, _utils.convertUtf8ToHex)(JWT);
            request.params.push(hexJWT);
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
            // result is a hex encoded signature
            // const signature = Uint8Array.from(Buffer.from(result, 'hex'));
            signature = Buffer.from(result, 'hex'); // verify signature

            _context.next = 27;
            return (0, _helpers.verifySignature)(JWT, signature, pubKeyB64);

          case 27:
            valid = _context.sent;
            signedPayloadEncoded = (0, _base64url.default)(signature);
            signedJWT = "".concat(headerEncoded, ".").concat(payloadEncoded, ".").concat(signedPayloadEncoded); // Update JWT within the wcjs state

            setState({
              signedJWT: signedJWT
            });
            return _context.abrupt("return", {
              valid: valid,
              result: result,
              data: finalExpires,
              signedJWT: signedJWT,
              request: request
            });

          case 34:
            _context.prev = 34;
            _context.t0 = _context["catch"](19);
            return _context.abrupt("return", {
              valid: valid,
              error: "".concat(_context.t0),
              data: finalExpires,
              request: request
            });

          case 37:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[19, 34]]);
  }));

  return function signJWT(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.signJWT = signJWT;