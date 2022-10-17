"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _urls = require("./urls");

Object.keys(_urls).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _urls[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _urls[key];
    }
  });
});

var _windowMessages = require("./windowMessages");

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

var _dynamicLinkInfo = require("./dynamicLinkInfo");

Object.keys(_dynamicLinkInfo).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _dynamicLinkInfo[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _dynamicLinkInfo[key];
    }
  });
});

var _connectionTimeouts = require("./connectionTimeouts");

Object.keys(_connectionTimeouts).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _connectionTimeouts[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _connectionTimeouts[key];
    }
  });
});

var _walletList = require("./walletList");

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

var _walletAppEvents = require("./walletAppEvents");

Object.keys(_walletAppEvents).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _walletAppEvents[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _walletAppEvents[key];
    }
  });
});