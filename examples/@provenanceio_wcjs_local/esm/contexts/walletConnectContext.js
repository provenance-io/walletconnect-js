import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React, { createContext, useContext, useEffect, useState } from 'react';
import { WalletConnectService } from '../services';
var StateContext = /*#__PURE__*/createContext(undefined);
var walletConnectService = new WalletConnectService();

var WalletConnectContextProvider = function WalletConnectContextProvider(_ref) {
  var children = _ref.children,
      timeout = _ref.timeout;

  var _useState = useState(_objectSpread({}, walletConnectService.state)),
      _useState2 = _slicedToArray(_useState, 2),
      walletConnectState = _useState2[0],
      setWalletConnectState = _useState2[1];

  var address = walletConnectState.address;
  useEffect(function () {
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

  return /*#__PURE__*/React.createElement(StateContext.Provider, {
    value: {
      walletConnectService: walletConnectService,
      walletConnectState: walletConnectState
    }
  }, children);
};

var useWalletConnect = function useWalletConnect() {
  var context = useContext(StateContext);

  if (context === undefined) {
    throw new Error('useWalletConnect must be used within a WalletConnectContextProvider');
  }

  return context;
};

export { WalletConnectContextProvider, useWalletConnect };