"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WalletConnectService = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classPrivateFieldSet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldSet"));

var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));

var _events = _interopRequireDefault(require("events"));

var _consts = require("../consts");

var _methods = require("./methods");

var _utils = require("../utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

// Check for existing values from localStorage
var existingWCState = (0, _utils.getFromLocalStorage)('walletconnect');
var existingWCJSState = (0, _utils.getFromLocalStorage)('walletconnect-js');
var defaultState = {
  account: '',
  address: '',
  bridge: _consts.WALLETCONNECT_BRIDGE_URL,
  connected: false,
  connectionEat: null,
  connectionIat: null,
  connectionTimeout: _consts.CONNECTION_TIMEOUT,
  connector: null,
  figureConnected: false,
  isMobile: (0, _utils.isMobile)(),
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

var WalletConnectService = /*#__PURE__*/function () {
  function WalletConnectService() {
    var _this = this;

    (0, _classCallCheck2.default)(this, WalletConnectService);

    _classPrivateFieldInitSpec(this, _eventEmitter, {
      writable: true,
      value: new _events.default.EventEmitter()
    });

    _classPrivateFieldInitSpec(this, _setWalletConnectState, {
      writable: true,
      value: undefined
    });

    _classPrivateFieldInitSpec(this, _connectionTimer, {
      writable: true,
      value: 0
    });

    (0, _defineProperty2.default)(this, "state", _objectSpread({}, initialState));

    _classPrivateFieldInitSpec(this, _broadcastEvent, {
      writable: true,
      value: function value(eventName, data) {
        (0, _classPrivateFieldGet2.default)(_this, _eventEmitter).emit(eventName, data);
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
        if (!(0, _classPrivateFieldGet2.default)(_this, _connectionTimer) && _this.state.connectionEat && _this.state.connectionIat) {
          // Get the time until expiration (typically this.state.connectionTimeout, but might not be if session restored from refresh)
          var connectionTimeout = _this.state.connectionEat - _this.state.connectionIat; // Create a new timer

          var newConnectionTimer = window.setTimeout(function () {
            // When this timer expires, kill the session
            _this.disconnect();
          }, connectionTimeout * 1000); // Convert to ms (timeout takes ms)
          // Save this timer (so it can be deleted on a reset)

          (0, _classPrivateFieldSet2.default)(_this, _connectionTimer, newConnectionTimer);
        }
      }
    });

    _classPrivateFieldInitSpec(this, _resetConnectionTimeout, {
      writable: true,
      value: function value() {
        // Kill the last timer (if it exists)
        if ((0, _classPrivateFieldGet2.default)(_this, _connectionTimer)) window.clearTimeout((0, _classPrivateFieldGet2.default)(_this, _connectionTimer)); // Build a new connectionIat (time now in seconds)

        var connectionIat = Math.floor(Date.now() / 1000); // Build a new connectionEat (Iat + connectionTimeout)

        var connectionEat = _this.state.connectionTimeout + connectionIat; // Save these new values (needed for session restore functionality/page refresh)

        _this.setState({
          connectionIat: connectionIat,
          connectionEat: connectionEat
        }); // Start a new timer


        (0, _classPrivateFieldGet2.default)(_this, _startConnectionTimer).call(_this);
      }
    });

    (0, _defineProperty2.default)(this, "resetState", function () {
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
          (0, _utils.addToLocalStorage)('walletconnect-js', storageUpdates);
        }
      }
    });

    (0, _defineProperty2.default)(this, "setState", function (updatedState) {
      // Check if connected and account exists to update 'figureConnected' state
      var figureConnected = (!!_this.state.account || !!updatedState.account) && (!!_this.state.connected || !!updatedState.connected); // Loop through each to update

      _this.state = _objectSpread(_objectSpread(_objectSpread({}, _this.state), updatedState), {}, {
        figureConnected: figureConnected
      });

      _this.updateState(); // Write state changes into localStorage as needed


      (0, _classPrivateFieldGet2.default)(_this, _updateLocalStorage).call(_this, _objectSpread(_objectSpread({}, updatedState), {}, {
        figureConnected: figureConnected
      }));
    });
    (0, _defineProperty2.default)(this, "showQRCode", function (value) {
      _this.setState({
        showQRCodeModal: value
      });
    });
    (0, _defineProperty2.default)(this, "markerActivate", /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(data) {
        var result, windowMessage;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // Loading while we wait for mobile to respond
                _this.setState({
                  loading: 'markerActivate'
                });

                _context.next = 3;
                return (0, _methods.markerActivate)(_this.state, data);

              case 3:
                result = _context.sent;

                // No longer loading
                _this.setState({
                  loading: ''
                }); // Broadcast result of method


                windowMessage = result.error ? _consts.WINDOW_MESSAGES.MARKER_ACTIVATE_FAILED : _consts.WINDOW_MESSAGES.MARKER_ACTIVATE_COMPLETE;
                (0, _classPrivateFieldGet2.default)(_this, _broadcastEvent).call(_this, windowMessage, result); // Refresh auto-disconnect timer

                (0, _classPrivateFieldGet2.default)(_this, _resetConnectionTimeout).call(_this);

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
    (0, _defineProperty2.default)(this, "markerFinalize", /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(data) {
        var result, windowMessage;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // Loading while we wait for mobile to respond
                _this.setState({
                  loading: 'markerFinalize'
                });

                _context2.next = 3;
                return (0, _methods.markerFinalize)(_this.state, data);

              case 3:
                result = _context2.sent;

                // No longer loading
                _this.setState({
                  loading: ''
                }); // Broadcast result of method


                windowMessage = result.error ? _consts.WINDOW_MESSAGES.MARKER_FINALIZE_FAILED : _consts.WINDOW_MESSAGES.MARKER_FINALIZE_COMPLETE;
                (0, _classPrivateFieldGet2.default)(_this, _broadcastEvent).call(_this, windowMessage, result); // Refresh auto-disconnect timer

                (0, _classPrivateFieldGet2.default)(_this, _resetConnectionTimeout).call(_this);

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
    (0, _defineProperty2.default)(this, "markerAdd", /*#__PURE__*/function () {
      var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(data) {
        var result, windowMessage;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                // Loading while we wait for mobile to respond
                _this.setState({
                  loading: 'markerAdd'
                });

                _context3.next = 3;
                return (0, _methods.markerAdd)(_this.state, data);

              case 3:
                result = _context3.sent;

                // No longer loading
                _this.setState({
                  loading: ''
                }); // Broadcast result of method


                windowMessage = result.error ? _consts.WINDOW_MESSAGES.MARKER_ADD_FAILED : _consts.WINDOW_MESSAGES.MARKER_ADD_COMPLETE;
                (0, _classPrivateFieldGet2.default)(_this, _broadcastEvent).call(_this, windowMessage, result); // Refresh auto-disconnect timer

                (0, _classPrivateFieldGet2.default)(_this, _resetConnectionTimeout).call(_this);

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
    (0, _defineProperty2.default)(this, "cancelRequest", /*#__PURE__*/function () {
      var _ref4 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(denom) {
        var result, windowMessage;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                // Loading while we wait for mobile to respond
                _this.setState({
                  loading: 'cancelRequest'
                });

                _context4.next = 3;
                return (0, _methods.cancelRequest)(_this.state, denom);

              case 3:
                result = _context4.sent;

                // No longer loading
                _this.setState({
                  loading: ''
                }); // Broadcast result of method


                windowMessage = result.error ? _consts.WINDOW_MESSAGES.CANCEL_REQUEST_FAILED : _consts.WINDOW_MESSAGES.CANCEL_REQUEST_COMPLETE;
                (0, _classPrivateFieldGet2.default)(_this, _broadcastEvent).call(_this, windowMessage, result); // Refresh auto-disconnect timer

                (0, _classPrivateFieldGet2.default)(_this, _resetConnectionTimeout).call(_this);

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
    (0, _defineProperty2.default)(this, "connect", /*#__PURE__*/function () {
      var _ref5 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(customBridge) {
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return (0, _methods.connect)({
                  state: _this.state,
                  setState: _this.setState,
                  resetState: _this.resetState,
                  broadcast: (0, _classPrivateFieldGet2.default)(_this, _broadcastEvent),
                  customBridge: customBridge,
                  startConnectionTimer: (0, _classPrivateFieldGet2.default)(_this, _startConnectionTimer),
                  getState: (0, _classPrivateFieldGet2.default)(_this, _getState)
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
    (0, _defineProperty2.default)(this, "customAction", /*#__PURE__*/function () {
      var _ref6 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6(data) {
        var result, windowMessage;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                // Loading while we wait for mobile to respond
                _this.setState({
                  loading: 'customAction'
                });

                _context6.next = 3;
                return (0, _methods.customAction)(_this.state, data);

              case 3:
                result = _context6.sent;

                // No longer loading
                _this.setState({
                  loading: ''
                }); // Broadcast result of method


                windowMessage = result.error ? _consts.WINDOW_MESSAGES.CUSTOM_ACTION_FAILED : _consts.WINDOW_MESSAGES.CUSTOM_ACTION_COMPLETE;
                (0, _classPrivateFieldGet2.default)(_this, _broadcastEvent).call(_this, windowMessage, result); // Refresh auto-disconnect timer

                (0, _classPrivateFieldGet2.default)(_this, _resetConnectionTimeout).call(_this);

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
    (0, _defineProperty2.default)(this, "delegateHash", /*#__PURE__*/function () {
      var _ref7 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7(data) {
        var result, windowMessage;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                // Loading while we wait for mobile to respond
                _this.setState({
                  loading: 'delegateHash'
                });

                _context7.next = 3;
                return (0, _methods.delegateHash)(_this.state, data);

              case 3:
                result = _context7.sent;

                // No longer loading
                _this.setState({
                  loading: ''
                }); // Broadcast result of method


                windowMessage = result.error ? _consts.WINDOW_MESSAGES.DELEGATE_HASH_FAILED : _consts.WINDOW_MESSAGES.DELEGATE_HASH_COMPLETE;
                (0, _classPrivateFieldGet2.default)(_this, _broadcastEvent).call(_this, windowMessage, result); // Refresh auto-disconnect timer

                (0, _classPrivateFieldGet2.default)(_this, _resetConnectionTimeout).call(_this);

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
    (0, _defineProperty2.default)(this, "disconnect", /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8() {
      var _this$state;

      return _regenerator.default.wrap(function _callee8$(_context8) {
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
    (0, _defineProperty2.default)(this, "sendCoin", /*#__PURE__*/function () {
      var _ref9 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9(data) {
        var result, windowMessage;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                // Loading while we wait for mobile to respond
                _this.setState({
                  loading: 'sendCoin'
                });

                _context9.next = 3;
                return (0, _methods.sendCoin)(_this.state, data);

              case 3:
                result = _context9.sent;

                // No longer loading
                _this.setState({
                  loading: ''
                }); // Broadcast result of method


                windowMessage = result.error ? _consts.WINDOW_MESSAGES.TRANSACTION_FAILED : _consts.WINDOW_MESSAGES.TRANSACTION_COMPLETE;
                (0, _classPrivateFieldGet2.default)(_this, _broadcastEvent).call(_this, windowMessage, result); // Refresh auto-disconnect timer

                (0, _classPrivateFieldGet2.default)(_this, _resetConnectionTimeout).call(_this);

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
    (0, _defineProperty2.default)(this, "signJWT", /*#__PURE__*/function () {
      var _ref10 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee10(expires) {
        var result, windowMessage;
        return _regenerator.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                // Loading while we wait for mobile to respond
                _this.setState({
                  loading: 'signJWT'
                });

                _context10.next = 3;
                return (0, _methods.signJWT)(_this.state, _this.setState, expires);

              case 3:
                result = _context10.sent;

                // No longer loading
                _this.setState({
                  loading: ''
                }); // Broadcast result of method


                windowMessage = result.error ? _consts.WINDOW_MESSAGES.SIGN_JWT_FAILED : _consts.WINDOW_MESSAGES.SIGN_JWT_COMPLETE;
                (0, _classPrivateFieldGet2.default)(_this, _broadcastEvent).call(_this, windowMessage, result); // Refresh auto-disconnect timer

                (0, _classPrivateFieldGet2.default)(_this, _resetConnectionTimeout).call(_this);

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
    (0, _defineProperty2.default)(this, "signMessage", /*#__PURE__*/function () {
      var _ref11 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee11(customMessage) {
        var result, windowMessage;
        return _regenerator.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                // Loading while we wait for mobile to respond
                _this.setState({
                  loading: 'signMessage'
                }); // Get result back from mobile actions and wc


                _context11.next = 3;
                return (0, _methods.signMessage)(_this.state, customMessage);

              case 3:
                result = _context11.sent;

                // No longer loading
                _this.setState({
                  loading: ''
                }); // Broadcast result of method


                windowMessage = result.error ? _consts.WINDOW_MESSAGES.SIGNATURE_FAILED : _consts.WINDOW_MESSAGES.SIGNATURE_COMPLETE;
                (0, _classPrivateFieldGet2.default)(_this, _broadcastEvent).call(_this, windowMessage, result); // Refresh auto-disconnect timer

                (0, _classPrivateFieldGet2.default)(_this, _resetConnectionTimeout).call(_this);

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

  (0, _createClass2.default)(WalletConnectService, [{
    key: "addListener",
    value: function addListener(eventName, callback) {
      (0, _classPrivateFieldGet2.default)(this, _eventEmitter).addListener(eventName, callback);
    }
  }, {
    key: "on",
    value: function on(eventName, callback) {
      (0, _classPrivateFieldGet2.default)(this, _eventEmitter).addListener(eventName, callback);
    }
  }, {
    key: "removeListener",
    value: function removeListener(eventName, callback) {
      (0, _classPrivateFieldGet2.default)(this, _eventEmitter).removeListener(eventName, callback);
    }
  }, {
    key: "removeAllListeners",
    value: function removeAllListeners() {
      var _this2 = this;

      (0, _classPrivateFieldGet2.default)(this, _eventEmitter).eventNames().forEach(function (eventName) {
        (0, _classPrivateFieldGet2.default)(_this2, _eventEmitter).removeAllListeners(eventName);
      });
    } // Pull latest state values on demand (prevent stale state in callback events)

  }, {
    key: "updateState",
    value: function updateState() {
      if ((0, _classPrivateFieldGet2.default)(this, _setWalletConnectState)) {
        (0, _classPrivateFieldGet2.default)(this, _setWalletConnectState).call(this, _objectSpread({}, this.state));
      }
    }
  }, {
    key: "setStateUpdater",
    value: function setStateUpdater(setWalletConnectState) {
      (0, _classPrivateFieldSet2.default)(this, _setWalletConnectState, setWalletConnectState);
    }
  }]);
  return WalletConnectService;
}();

exports.WalletConnectService = WalletConnectService;