"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifySignature = exports.sha256 = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _base64url = _interopRequireDefault(require("base64url"));

var _crypto = require("crypto");

var _secp256k = require("secp256k1");

var sha256 = function sha256(message) {
  return (0, _crypto.createHash)('sha256').update(Buffer.from(message, "utf-8")).digest();
};

exports.sha256 = sha256;

var verifySignature = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(message, signature, pubKeyB64) {
    var hash, pubKeyDecoded;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            hash = sha256(message);
            pubKeyDecoded = _base64url.default.toBuffer(pubKeyB64);
            return _context.abrupt("return", (0, _secp256k.ecdsaVerify)(signature, hash, pubKeyDecoded));

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

exports.verifySignature = verifySignature;