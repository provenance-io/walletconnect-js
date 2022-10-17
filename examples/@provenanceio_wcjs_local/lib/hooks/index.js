"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _useWalletConnectService = require("./useWalletConnectService");

Object.keys(_useWalletConnectService).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useWalletConnectService[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _useWalletConnectService[key];
    }
  });
});