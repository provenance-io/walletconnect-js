"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _QRCodeModal = require("./QRCodeModal");

Object.keys(_QRCodeModal).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _QRCodeModal[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _QRCodeModal[key];
    }
  });
});