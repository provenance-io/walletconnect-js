import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import base64url from 'base64url';
import { createHash } from 'crypto';
import { ecdsaVerify } from 'secp256k1';
export var sha256 = function sha256(message) {
  return createHash('sha256').update(Buffer.from(message, "utf-8")).digest();
};
export var verifySignature = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(message, signature, pubKeyB64) {
    var hash, pubKeyDecoded;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            hash = sha256(message);
            pubKeyDecoded = base64url.toBuffer(pubKeyB64);
            return _context.abrupt("return", ecdsaVerify(signature, hash, pubKeyDecoded));

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function verifySignature(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();