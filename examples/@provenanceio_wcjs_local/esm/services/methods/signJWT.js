import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import base64url from 'base64url';
import { convertUtf8ToHex } from '@walletconnect/utils';
import { verifySignature } from '../../helpers';
import { WALLET_LIST, WALLET_APP_EVENTS } from '../../consts';
import { rngNum } from '../../utils';
export var signJWT = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(state, setState, expires) {
    var valid, now, defaultExpires, finalExpires, connector, address, pubKeyB64, walletApp, method, description, metadata, request, knownWalletApp, header, headerEncoded, payload, payloadEncoded, JWT, hexJWT, eventData, result, signature, signedPayloadEncoded, signedJWT;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
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
              id: rngNum(),
              jsonrpc: '2.0',
              method: method,
              params: [metadata]
            }; // Check for a known wallet app with special callback functions

            knownWalletApp = WALLET_LIST.find(function (wallet) {
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
            headerEncoded = base64url(header);
            payload = JSON.stringify({
              sub: pubKeyB64,
              iss: 'provenance.io',
              iat: now,
              exp: finalExpires,
              addr: address
            });
            payloadEncoded = base64url(payload);
            JWT = "".concat(headerEncoded, ".").concat(payloadEncoded);
            hexJWT = convertUtf8ToHex(JWT);
            request.params.push(hexJWT);
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
            // result is a hex encoded signature
            // const signature = Uint8Array.from(Buffer.from(result, 'hex'));
            signature = Buffer.from(result, 'hex'); // verify signature

            _context.next = 27;
            return verifySignature(JWT, signature, pubKeyB64);

          case 27:
            valid = _context.sent;
            signedPayloadEncoded = base64url(signature);
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