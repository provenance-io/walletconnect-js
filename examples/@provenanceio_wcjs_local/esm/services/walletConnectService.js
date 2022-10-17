import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classPrivateFieldSet from "@babel/runtime/helpers/esm/classPrivateFieldSet";
import _classPrivateFieldGet from "@babel/runtime/helpers/esm/classPrivateFieldGet";
import _regeneratorRuntime from "@babel/runtime/regenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

import events from 'events';
import { WINDOW_MESSAGES, CONNECTION_TIMEOUT, WALLETCONNECT_BRIDGE_URL } from '../consts';
import { markerActivate as markerActivateMethod, markerAdd as markerAddMethod, cancelRequest as cancelRequestMethod, connect as connectMethod, customAction as customActionMethod, delegateHash as delegateHashMethod, sendCoin as sendCoinMethod, signJWT as signJWTMethod, signMessage as signMessageMethod, markerFinalize as markerFinalizeMethod } from './methods';
import { getFromLocalStorage, addToLocalStorage, isMobile } from '../utils'; // Check for existing values from localStorage

var existingWCState = getFromLocalStorage('walletconnect');
var existingWCJSState = getFromLocalStorage('walletconnect-js');
var defaultState = {
  account: '',
  address: '',
  bridge: WALLETCONNECT_BRIDGE_URL,
  connected: false,
  connectionEat: null,
  connectionIat: null,
  connectionTimeout: CONNECTION_TIMEOUT,
  connector: null,
  figureConnected: false,
  isMobile: isMobile(),
  loading: '',
  newAccount: false,
  peer: null,
  publicKey: '',
  QRCode: '',
  QRCodeUrl: '',
  showQRCodeModal: false,
  signedJWT: '',
  walletApp: '',
  walletInfo: {}
}; // Pull values out of local storage if they exist

var getAccountItem = function getAccountItem(itemName) {
  var accounts = existingWCState.accounts; // Make sure accounts exist

  if (!accounts || !Array.isArray(accounts) || !accounts.length) return ''; // Check the accounts type, array of strings vs array of single object

  var firstValue = accounts[0];
  var accountArrayType = typeof firstValue === 'string'; // [ address, publicKey, jwt ]

  if (accountArrayType) {
    var accountsArray = accounts;

    switch (itemName) {
      case 'address':
        return accountsArray[0];

      case 'publicKey':
        return accountsArray[1];

      case 'jwt':
        return accountsArray[2];
      // No walletInfo in old array method

      case 'walletInfo':
        return {};

      default:
        return '';
    }
  }

  var accountsObj = accounts[0];
  return accountsObj[itemName];
};

var initialState = {
  account: existingWCJSState.account || defaultState.account,
  address: getAccountItem('address') || defaultState.address,
  bridge: existingWCState.bridge || defaultState.bridge,
  connected: existingWCState.connected || defaultState.connected,
  connectionEat: existingWCJSState.connectionEat || defaultState.connectionEat,
  connectionIat: existingWCJSState.connectionIat || defaultState.connectionIat,
  connectionTimeout: existingWCJSState.connectionTimeout || defaultState.connectionTimeout,
  connector: existingWCState || defaultState.connector,
  figureConnected: !!existingWCJSState.account && defaultState.connected,
  isMobile: defaultState.isMobile,
  loading: defaultState.loading,
  newAccount: existingWCJSState.newAccount || defaultState.newAccount,
  peer: defaultState.peer,
  publicKey: getAccountItem('publicKey') || defaultState.publicKey,
  QRCode: defaultState.QRCode,
  QRCodeUrl: defaultState.QRCodeUrl,
  showQRCodeModal: defaultState.showQRCodeModal,
  signedJWT: getAccountItem('jwt') || defaultState.signedJWT,
  walletApp: existingWCJSState.walletApp || defaultState.walletApp,
  walletInfo: getAccountItem('walletInfo') || defaultState.walletInfo
};

var _eventEmitter = /*#__PURE__*/new WeakMap();

var _setWalletConnectState = /*#__PURE__*/new WeakMap();

var _connectionTimer = /*#__PURE__*/new WeakMap();

var _broadcastEvent = /*#__PURE__*/new WeakMap();

var _getState = /*#__PURE__*/new WeakMap();

var _startConnectionTimer = /*#__PURE__*/new WeakMap();

var _resetConnectionTimeout = /*#__PURE__*/new WeakMap();

var _updateLocalStorage = /*#__PURE__*/new WeakMap();

export var WalletConnectService = /*#__PURE__*/function () {
  function WalletConnectService() {
    var _this = this;

    _classCallCheck(this, WalletConnectService);

    _classPrivateFieldInitSpec(this, _eventEmitter, {
      writable: true,
      value: new events.EventEmitter()
    });

    _classPrivateFieldInitSpec(this, _setWalletConnectState, {
      writable: true,
      value: undefined
    });

    _classPrivateFieldInitSpec(this, _connectionTimer, {
      writable: true,
      value: 0
    });

    _defineProperty(this, "state", _objectSpread({}, initialState));

    _classPrivateFieldInitSpec(this, _broadcastEvent, {
      writable: true,
      value: function value(eventName, data) {
        _classPrivateFieldGet(_this, _eventEmitter).emit(eventName, data);
      }
    });

    _classPrivateFieldInitSpec(this, _getState, {
      writable: true,
      value: function value() {
        return _this.state;
      }
    });

    _classPrivateFieldInitSpec(this, _startConnectionTimer, {
      writable: true,
      value: function value() {
        // Can't start a timer if one is already running (make sure we have Eat and Iat too)
        if (!_classPrivateFieldGet(_this, _connectionTimer) && _this.state.connectionEat && _this.state.connectionIat) {
          // Get the time until expiration (typically this.state.connectionTimeout, but might not be if session restored from refresh)
          var connectionTimeout = _this.state.connectionEat - _this.state.connectionIat; // Create a new timer

          var newConnectionTimer = window.setTimeout(function () {
            // When this timer expires, kill the session
            _this.disconnect();
          }, connectionTimeout * 1000); // Convert to ms (timeout takes ms)
          // Save this timer (so it can be deleted on a reset)

          _classPrivateFieldSet(_this, _connectionTimer, newConnectionTimer);
        }
      }
    });

    _classPrivateFieldInitSpec(this, _resetConnectionTimeout, {
      writable: true,
      value: function value() {
        // Kill the last timer (if it exists)
        if (_classPrivateFieldGet(_this, _connectionTimer)) window.clearTimeout(_classPrivateFieldGet(_this, _connectionTimer)); // Build a new connectionIat (time now in seconds)

        var connectionIat = Math.floor(Date.now() / 1000); // Build a new connectionEat (Iat + connectionTimeout)

        var connectionEat = _this.state.connectionTimeout + connectionIat; // Save these new values (needed for session restore functionality/page refresh)

        _this.setState({
          connectionIat: connectionIat,
          connectionEat: connectionEat
        }); // Start a new timer


        _classPrivateFieldGet(_this, _startConnectionTimer).call(_this);
      }
    });

    _defineProperty(this, "resetState", function () {
      _this.state = _objectSpread({}, defaultState);

      _this.updateState();
    });

    _classPrivateFieldInitSpec(this, _updateLocalStorage, {
      writable: true,
      value: function value(updatedState) {
        // Special values to look for
        var account = updatedState.account,
            connectionEat = updatedState.connectionEat,
            connectionIat = updatedState.connectionIat,
            connectionTimeout = updatedState.connectionTimeout,
            figureConnected = updatedState.figureConnected,
            newAccount = updatedState.newAccount,
            signedJWT = updatedState.signedJWT,
            walletApp = updatedState.walletApp; // If the value was changed, add it to the localStorage updates

        var storageUpdates = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, account !== undefined && {
          account: account
        }), connectionEat !== undefined && {
          connectionEat: connectionEat
        }), connectionIat !== undefined && {
          connectionIat: connectionIat
        }), connectionTimeout !== undefined && {
          connectionTimeout: connectionTimeout
        }), figureConnected !== undefined && {
          figureConnected: figureConnected
        }), newAccount !== undefined && {
          newAccount: newAccount
        }), signedJWT !== undefined && {
          signedJWT: signedJWT
        }), walletApp !== undefined && {
          walletApp: walletApp
        }); // If we have updated 1 or more special values, update localStorage


        if (Object.keys(storageUpdates).length) {
          addToLocalStorage('walletconnect-js', storageUpdates);
        }
      }
    });

    _defineProperty(this, "setState", function (updatedState) {
      // Check if connected and account exists to update 'figureConnected' state
      var figureConnected = (!!_this.state.account || !!updatedState.account) && (!!_this.state.connected || !!updatedState.connected); // Loop through each to update

      _this.state = _objectSpread(_objectSpread(_objectSpread({}, _this.state), updatedState), {}, {
        figureConnected: figureConnected
      });

      _this.updateState(); // Write state changes into localStorage as needed


      _classPrivateFieldGet(_this, _updateLocalStorage).call(_this, _objectSpread(_objectSpread({}, updatedState), {}, {
        figureConnected: figureConnected
      }));
    });

    _defineProperty(this, "showQRCode", function (value) {
      _this.setState({
        showQRCodeModal: value
      });
    });

    _defineProperty(this, "markerActivate", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(data) {
        var result, windowMessage;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // Loading while we wait for mobile to respond
                _this.setState({
                  loading: 'markerActivate'
                });

                _context.next = 3;
                return markerActivateMethod(_this.state, data);

              case 3:
                result = _context.sent;

                // No longer loading
                _this.setState({
                  loading: ''
                }); // Broadcast result of method


                windowMessage = result.error ? WINDOW_MESSAGES.MARKER_ACTIVATE_FAILED : WINDOW_MESSAGES.MARKER_ACTIVATE_COMPLETE;

                _classPrivateFieldGet(_this, _broadcastEvent).call(_this, windowMessage, result); // Refresh auto-disconnect timer


                _classPrivateFieldGet(_this, _resetConnectionTimeout).call(_this);

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());

    _defineProperty(this, "markerFinalize", /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(data) {
        var result, windowMessage;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // Loading while we wait for mobile to respond
                _this.setState({
                  loading: 'markerFinalize'
                });

                _context2.next = 3;
                return markerFinalizeMethod(_this.state, data);

              case 3:
                result = _context2.sent;

                // No longer loading
                _this.setState({
                  loading: ''
                }); // Broadcast result of method


                windowMessage = result.error ? WINDOW_MESSAGES.MARKER_FINALIZE_FAILED : WINDOW_MESSAGES.MARKER_FINALIZE_COMPLETE;

                _classPrivateFieldGet(_this, _broadcastEvent).call(_this, windowMessage, result); // Refresh auto-disconnect timer


                _classPrivateFieldGet(_this, _resetConnectionTimeout).call(_this);

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());

    _defineProperty(this, "markerAdd", /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(data) {
        var result, windowMessage;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                // Loading while we wait for mobile to respond
                _this.setState({
                  loading: 'markerAdd'
                });

                _context3.next = 3;
                return markerAddMethod(_this.state, data);

              case 3:
                result = _context3.sent;

                // No longer loading
                _this.setState({
                  loading: ''
                }); // Broadcast result of method


                windowMessage = result.error ? WINDOW_MESSAGES.MARKER_ADD_FAILED : WINDOW_MESSAGES.MARKER_ADD_COMPLETE;

                _classPrivateFieldGet(_this, _broadcastEvent).call(_this, windowMessage, result); // Refresh auto-disconnect timer


                _classPrivateFieldGet(_this, _resetConnectionTimeout).call(_this);

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }());

    _defineProperty(this, "cancelRequest", /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(denom) {
        var result, windowMessage;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                // Loading while we wait for mobile to respond
                _this.setState({
                  loading: 'cancelRequest'
                });

                _context4.next = 3;
                return cancelRequestMethod(_this.state, denom);

              case 3:
                result = _context4.sent;

                // No longer loading
                _this.setState({
                  loading: ''
                }); // Broadcast result of method


                windowMessage = result.error ? WINDOW_MESSAGES.CANCEL_REQUEST_FAILED : WINDOW_MESSAGES.CANCEL_REQUEST_COMPLETE;

                _classPrivateFieldGet(_this, _broadcastEvent).call(_this, windowMessage, result); // Refresh auto-disconnect timer


                _classPrivateFieldGet(_this, _resetConnectionTimeout).call(_this);

              case 8:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    }());

    _defineProperty(this, "connect", /*#__PURE__*/function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(customBridge) {
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return connectMethod({
                  state: _this.state,
                  setState: _this.setState,
                  resetState: _this.resetState,
                  broadcast: _classPrivateFieldGet(_this, _broadcastEvent),
                  customBridge: customBridge,
                  startConnectionTimer: _classPrivateFieldGet(_this, _startConnectionTimer),
                  getState: _classPrivateFieldGet(_this, _getState)
                });

              case 2:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      return function (_x5) {
        return _ref5.apply(this, arguments);
      };
    }());

    _defineProperty(this, "customAction", /*#__PURE__*/function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(data) {
        var result, windowMessage;
        return _regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                // Loading while we wait for mobile to respond
                _this.setState({
                  loading: 'customAction'
                });

                _context6.next = 3;
                return customActionMethod(_this.state, data);

              case 3:
                result = _context6.sent;

                // No longer loading
                _this.setState({
                  loading: ''
                }); // Broadcast result of method


                windowMessage = result.error ? WINDOW_MESSAGES.CUSTOM_ACTION_FAILED : WINDOW_MESSAGES.CUSTOM_ACTION_COMPLETE;

                _classPrivateFieldGet(_this, _broadcastEvent).call(_this, windowMessage, result); // Refresh auto-disconnect timer


                _classPrivateFieldGet(_this, _resetConnectionTimeout).call(_this);

              case 8:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      return function (_x6) {
        return _ref6.apply(this, arguments);
      };
    }());

    _defineProperty(this, "delegateHash", /*#__PURE__*/function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(data) {
        var result, windowMessage;
        return _regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                // Loading while we wait for mobile to respond
                _this.setState({
                  loading: 'delegateHash'
                });

                _context7.next = 3;
                return delegateHashMethod(_this.state, data);

              case 3:
                result = _context7.sent;

                // No longer loading
                _this.setState({
                  loading: ''
                }); // Broadcast result of method


                windowMessage = result.error ? WINDOW_MESSAGES.DELEGATE_HASH_FAILED : WINDOW_MESSAGES.DELEGATE_HASH_COMPLETE;

                _classPrivateFieldGet(_this, _broadcastEvent).call(_this, windowMessage, result); // Refresh auto-disconnect timer


                _classPrivateFieldGet(_this, _resetConnectionTimeout).call(_this);

              case 8:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      return function (_x7) {
        return _ref7.apply(this, arguments);
      };
    }());

    _defineProperty(this, "disconnect", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8() {
      var _this$state;

      return _regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              if (!(_this !== null && _this !== void 0 && (_this$state = _this.state) !== null && _this$state !== void 0 && _this$state.connector)) {
                _context8.next = 3;
                break;
              }

              _context8.next = 3;
              return _this.state.connector.killSession();

            case 3:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    })));

    _defineProperty(this, "sendCoin", /*#__PURE__*/function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9(data) {
        var result, windowMessage;
        return _regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                // Loading while we wait for mobile to respond
                _this.setState({
                  loading: 'sendCoin'
                });

                _context9.next = 3;
                return sendCoinMethod(_this.state, data);

              case 3:
                result = _context9.sent;

                // No longer loading
                _this.setState({
                  loading: ''
                }); // Broadcast result of method


                windowMessage = result.error ? WINDOW_MESSAGES.TRANSACTION_FAILED : WINDOW_MESSAGES.TRANSACTION_COMPLETE;

                _classPrivateFieldGet(_this, _broadcastEvent).call(_this, windowMessage, result); // Refresh auto-disconnect timer


                _classPrivateFieldGet(_this, _resetConnectionTimeout).call(_this);

              case 8:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      return function (_x8) {
        return _ref9.apply(this, arguments);
      };
    }());

    _defineProperty(this, "signJWT", /*#__PURE__*/function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee10(expires) {
        var result, windowMessage;
        return _regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                // Loading while we wait for mobile to respond
                _this.setState({
                  loading: 'signJWT'
                });

                _context10.next = 3;
                return signJWTMethod(_this.state, _this.setState, expires);

              case 3:
                result = _context10.sent;

                // No longer loading
                _this.setState({
                  loading: ''
                }); // Broadcast result of method


                windowMessage = result.error ? WINDOW_MESSAGES.SIGN_JWT_FAILED : WINDOW_MESSAGES.SIGN_JWT_COMPLETE;

                _classPrivateFieldGet(_this, _broadcastEvent).call(_this, windowMessage, result); // Refresh auto-disconnect timer


                _classPrivateFieldGet(_this, _resetConnectionTimeout).call(_this);

              case 8:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      return function (_x9) {
        return _ref10.apply(this, arguments);
      };
    }());

    _defineProperty(this, "signMessage", /*#__PURE__*/function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee11(customMessage) {
        var result, windowMessage;
        return _regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                // Loading while we wait for mobile to respond
                _this.setState({
                  loading: 'signMessage'
                }); // Get result back from mobile actions and wc


                _context11.next = 3;
                return signMessageMethod(_this.state, customMessage);

              case 3:
                result = _context11.sent;

                // No longer loading
                _this.setState({
                  loading: ''
                }); // Broadcast result of method


                windowMessage = result.error ? WINDOW_MESSAGES.SIGNATURE_FAILED : WINDOW_MESSAGES.SIGNATURE_COMPLETE;

                _classPrivateFieldGet(_this, _broadcastEvent).call(_this, windowMessage, result); // Refresh auto-disconnect timer


                _classPrivateFieldGet(_this, _resetConnectionTimeout).call(_this);

              case 8:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      }));

      return function (_x10) {
        return _ref11.apply(this, arguments);
      };
    }());
  }

  _createClass(WalletConnectService, [{
    key: "addListener",
    value: function addListener(eventName, callback) {
      _classPrivateFieldGet(this, _eventEmitter).addListener(eventName, callback);
    }
  }, {
    key: "on",
    value: function on(eventName, callback) {
      _classPrivateFieldGet(this, _eventEmitter).addListener(eventName, callback);
    }
  }, {
    key: "removeListener",
    value: function removeListener(eventName, callback) {
      _classPrivateFieldGet(this, _eventEmitter).removeListener(eventName, callback);
    }
  }, {
    key: "removeAllListeners",
    value: function removeAllListeners() {
      var _this2 = this;

      _classPrivateFieldGet(this, _eventEmitter).eventNames().forEach(function (eventName) {
        _classPrivateFieldGet(_this2, _eventEmitter).removeAllListeners(eventName);
      });
    } // Pull latest state values on demand (prevent stale state in callback events)

  }, {
    key: "updateState",
    value: function updateState() {
      if (_classPrivateFieldGet(this, _setWalletConnectState)) {
        _classPrivateFieldGet(this, _setWalletConnectState).call(this, _objectSpread({}, this.state));
      }
    }
  }, {
    key: "setStateUpdater",
    value: function setStateUpdater(setWalletConnectState) {
      _classPrivateFieldSet(this, _setWalletConnectState, setWalletConnectState);
    }
  }]);

  return WalletConnectService;
}();