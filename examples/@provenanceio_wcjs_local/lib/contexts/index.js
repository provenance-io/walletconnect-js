"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _walletConnectContext = require("./walletConnectContext");

Object.keys(_walletConnectContext).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _walletConnectContext[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _walletConnectContext[key];
    }
  });
});