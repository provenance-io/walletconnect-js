"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _services = require("./services");

Object.keys(_services).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _services[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _services[key];
    }
  });
});

var _windowMessages = require("./consts/windowMessages");

Object.keys(_windowMessages).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _windowMessages[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _windowMessages[key];
    }
  });
});

var _walletList = require("./consts/walletList");

Object.keys(_walletList).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _walletList[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _walletList[key];
    }
  });
});