"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useWalletConnect = exports.WalletConnectContextProvider = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _services = require("../services");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var StateContext = /*#__PURE__*/(0, _react.createContext)(undefined);
var walletConnectService = new _services.WalletConnectService();

var WalletConnectContextProvider = function WalletConnectContextProvider(_ref) {
  var children = _ref.children,
      timeout = _ref.timeout;

  var _useState = (0, _react.useState)(_objectSpread({}, walletConnectService.state)),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      walletConnectState = _useState2[0],
      setWalletConnectState = _useState2[1];

  var address = walletConnectState.address;
  (0, _react.useEffect)(function () {
    walletConnectService.setStateUpdater(setWalletConnectState); // Whenever we change the react state, update the class state
    // If custom props are passed in, update the defaults

    if (timeout) {
      walletConnectService.setState({
        connectionTimeout: timeout
      });
    } // Check if we have an address and public key, if so, auto-reconnect to session


    if (address) walletConnectService.connect();
    return function () {
      return walletConnectService.removeAllListeners();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return /*#__PURE__*/_react.default.createElement(StateContext.Provider, {
    value: {
      walletConnectService: walletConnectService,
      walletConnectState: walletConnectState
    }
  }, children);
};

exports.WalletConnectContextProvider = WalletConnectContextProvider;

var useWalletConnect = function useWalletConnect() {
  var context = (0, _react.useContext)(StateContext);

  if (context === undefined) {
    throw new Error('useWalletConnect must be used within a WalletConnectContextProvider');
  }

  return context;
};

exports.useWalletConnect = useWalletConnect;