"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useWalletConnectService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = require("react");

var _services = require("../services");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var useWalletConnectService = function useWalletConnectService() {
  var walletConnectService = (0, _react.useRef)(new _services.WalletConnectService()).current; // Note: Why does wallet-lib use "useRef" here?

  var _useState = (0, _react.useState)(_objectSpread({}, walletConnectService.state)),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      walletConnectState = _useState2[0],
      setWalletConnectState = _useState2[1];

  (0, _react.useEffect)(function () {
    walletConnectService.setStateUpdater(setWalletConnectState); // Whenever we change the react state, update the class state

    return function () {
      return walletConnectService.removeAllListeners();
    };
  }, [walletConnectService]);
  return {
    walletConnectState: walletConnectState,
    walletConnectService: walletConnectService
  };
};

exports.useWalletConnectService = useWalletConnectService;