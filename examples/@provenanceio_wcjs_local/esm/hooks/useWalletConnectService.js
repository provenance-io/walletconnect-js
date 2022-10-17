import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { useEffect, useRef, useState } from 'react'; // eslint-disable-line import/no-extraneous-dependencies, no-unused-vars

import { WalletConnectService } from '../services';
export var useWalletConnectService = function useWalletConnectService() {
  var walletConnectService = useRef(new WalletConnectService()).current; // Note: Why does wallet-lib use "useRef" here?

  var _useState = useState(_objectSpread({}, walletConnectService.state)),
      _useState2 = _slicedToArray(_useState, 2),
      walletConnectState = _useState2[0],
      setWalletConnectState = _useState2[1];

  useEffect(function () {
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