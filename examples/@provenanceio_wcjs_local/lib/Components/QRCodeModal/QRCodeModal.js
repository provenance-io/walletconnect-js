"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QRCodeModal = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _consts = require("../../consts");

var _appStoreBadge = _interopRequireDefault(require("../../images/appStoreBadge.svg"));

var _googlePlayBadge = _interopRequireDefault(require("../../images/googlePlayBadge.png"));

var _images = require("../../images");

var _CopyButton, _Text2, _AppStoreIcons, _svg, _Text3, _svg2, _Text4, _Text5;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var QRCodeModalContainer = /*#__PURE__*/_styledComponents.default.div.withConfig({
  displayName: "QRCodeModal__QRCodeModalContainer",
  componentId: "sc-faaaal-0"
})(["top:0;left:0;position:fixed;height:100%;width:100%;display:flex;justify-content:center;align-items:center;background:rgba(0,0,0,0.5);color:#444444;z-index:1000;"]);

var QRModalContent = /*#__PURE__*/_styledComponents.default.div.withConfig({
  displayName: "QRCodeModal__QRModalContent",
  componentId: "sc-faaaal-1"
})(["width:400px;transition:1s all;position:relative;border-radius:10px;background:#eeeeee;padding:40px;display:flex;text-align:center;flex-wrap:wrap;flex-direction:row;justify-content:center;align-items:flex-start;box-shadow:1px 1px 4px 1px rgba(0,0,0,0.25);"]);

var CloseQRModal = /*#__PURE__*/_styledComponents.default.div.withConfig({
  displayName: "QRCodeModal__CloseQRModal",
  componentId: "sc-faaaal-2"
})(["background:#ffffff;height:24px;width:24px;position:absolute;top:10px;right:10px;cursor:pointer;border-radius:100%;display:flex;justify-content:center;align-items:center;"]);

var Toggle = /*#__PURE__*/_styledComponents.default.div.withConfig({
  displayName: "QRCodeModal__Toggle",
  componentId: "sc-faaaal-3"
})(["padding:4px;border-radius:5px;width:80%;display:flex;justify-content:space-between;align-items:center;background:#dddddd;margin-bottom:20px;"]);

var ToggleNotch = /*#__PURE__*/_styledComponents.default.div.withConfig({
  displayName: "QRCodeModal__ToggleNotch",
  componentId: "sc-faaaal-4"
})(["color:#5588dd;transition:500ms all;padding:4px 10px;font-weight:700;", " flex-basis:50%;border-radius:4px;cursor:pointer;text-align:center;user-select:none;"], function (_ref) {
  var active = _ref.active;
  return active && 'background: #FFFFFF;';
});

var Text = /*#__PURE__*/_styledComponents.default.p.withConfig({
  displayName: "QRCodeModal__Text",
  componentId: "sc-faaaal-5"
})(["font-size:1.5rem;margin:0;", ""], function (_ref2) {
  var link = _ref2.link;
  return link && "\n    color: #5588DD;\n    cursor: pointer;\n  ";
});

var CopyButton = /*#__PURE__*/_styledComponents.default.button.withConfig({
  displayName: "QRCodeModal__CopyButton",
  componentId: "sc-faaaal-6"
})(["font-size:10px;margin:0 28px 18px auto;"]);

var ImgContainer = /*#__PURE__*/_styledComponents.default.div.withConfig({
  displayName: "QRCodeModal__ImgContainer",
  componentId: "sc-faaaal-7"
})(["flex-basis:100%;margin-top:10px;"]);

var WalletRow = /*#__PURE__*/_styledComponents.default.a.withConfig({
  displayName: "QRCodeModal__WalletRow",
  componentId: "sc-faaaal-8"
})(["display:flex;align-items:center;margin-top:10px;flex-basis:100%;color:#333333;border-radius:4px;padding:10px 18px;transition:500ms all;text-align:left;&:hover{background:#ffffff;}"]);

var WalletRowNonLink = /*#__PURE__*/_styledComponents.default.div.withConfig({
  displayName: "QRCodeModal__WalletRowNonLink",
  componentId: "sc-faaaal-9"
})(["display:flex;align-items:center;margin-top:10px;flex-basis:100%;color:#333333;border-radius:4px;padding:10px 18px;transition:500ms all;text-align:left;cursor:pointer;input{width:100%;margin-top:10px;padding:10px;border-radius:5px;border:1px solid #aaaaaa;color:#444444;}&:hover{background:#ffffff;}"]);

var WalletTitle = /*#__PURE__*/_styledComponents.default.div.withConfig({
  displayName: "QRCodeModal__WalletTitle",
  componentId: "sc-faaaal-10"
})(["font-weight:900;font-size:2rem;color:", ";user-select:none;"], function (_ref3) {
  var custom = _ref3.custom;
  return custom ? '#4889fa' : '#333333';
});

var WalletIcon = /*#__PURE__*/_styledComponents.default.img.withConfig({
  displayName: "QRCodeModal__WalletIcon",
  componentId: "sc-faaaal-11"
})(["background:#ffffff;border-radius:4px;height:30px;width:30px;margin-right:20px;padding:4px;"]);

var AppStoreIcons = /*#__PURE__*/_styledComponents.default.div.withConfig({
  displayName: "QRCodeModal__AppStoreIcons",
  componentId: "sc-faaaal-12"
})(["display:flex;width:100%;justify-content:center;align-items:center;margin-top:4px;"]);

var AppIcon = /*#__PURE__*/_styledComponents.default.a.withConfig({
  displayName: "QRCodeModal__AppIcon",
  componentId: "sc-faaaal-13"
})(["margin:0 6px;"]);

var ReloadNotice = /*#__PURE__*/_styledComponents.default.div.withConfig({
  displayName: "QRCodeModal__ReloadNotice",
  componentId: "sc-faaaal-14"
})(["position:absolute;top:0;left:0;height:100%;width:100%;background:#eeeeee;padding:60px 40px 40px 40px;border-radius:10px;display:flex;flex-direction:column;flex-wrap:wrap;", "{margin-bottom:34px;}button{margin-top:6px;padding:10px;box-sizing:border-box;cursor:pointer;border-radius:8px;border:1px solid #aaaaaa;background:white;}"], Text);

var QRCodeModal = function QRCodeModal(_ref4) {
  var _Text, _ImgContainer, _CopyButton2;

  var className = _ref4.className,
      wcs = _ref4.walletConnectService,
      _ref4$title = _ref4.title,
      title = _ref4$title === void 0 ? 'Scan the QRCode with your mobile Provenance Blockchain Wallet.' : _ref4$title,
      devWallets = _ref4.devWallets;
  var state = wcs.state;
  var showQRCodeModal = state.showQRCodeModal,
      QRCode = state.QRCode,
      QRCodeUrl = state.QRCodeUrl,
      isMobile = state.isMobile;
  var encodedQRCodeUrl = encodeURIComponent(QRCodeUrl);
  var options = ['qr', isMobile ? 'mobile' : 'desktop']; // Which tab of the popup is currently open (qr/desktop/mobile)

  var _useState = (0, _react.useState)('qr'),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      view = _useState2[0],
      setView = _useState2[1]; // Copy the QR code value as a string


  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      copied = _useState4[0],
      setCopied = _useState4[1];

  var _useState5 = (0, _react.useState)(-1),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
      timeoutInstance = _useState6[0],
      setTimeoutInstance = _useState6[1]; // List of mobile wallets after their dynamic links have been fetched (async)


  var _useState7 = (0, _react.useState)([]),
      _useState8 = (0, _slicedToArray2.default)(_useState7, 2),
      mobileWallets = _useState8[0],
      setMobileWallets = _useState8[1];

  var _useState9 = (0, _react.useState)(true),
      _useState10 = (0, _slicedToArray2.default)(_useState9, 2),
      initialLoad = _useState10[0],
      setInitialLoad = _useState10[1]; // Display a message to the user that a reload is required


  var _useState11 = (0, _react.useState)(false),
      _useState12 = (0, _slicedToArray2.default)(_useState11, 2),
      showReloadNotice = _useState12[0],
      setShowReloadNotice = _useState12[1]; // On unload, remove any running 'copied' timeoutInstances (prevent memory leaks)


  (0, _react.useEffect)(function () {
    return function () {
      if (timeoutInstance) clearTimeout(timeoutInstance);
    };
  }, [timeoutInstance]); // --------------------------------------------
  // Build all the mobile wallet dynamic links
  // --------------------------------------------
  // When a user visits the site on mobile, they will get a "mobile" tab instead of "desktop"
  // The links to those "mobile wallets" are dynamic (iOS vs Android).  To get the links we must fetch

  (0, _react.useEffect)(function () {
    var asyncBuildMobileWallets = function asyncBuildMobileWallets() {
      return _consts.WALLET_LIST.filter(function (_ref5) {
        var type = _ref5.type;
        return type === 'mobile';
      }).map( /*#__PURE__*/function () {
        var _ref6 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(wallet) {
          var dynamicUrl, allMobileWallets;
          return _regenerator.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!wallet.generateUrl) {
                    _context.next = 6;
                    break;
                  }

                  _context.next = 3;
                  return wallet.generateUrl(QRCodeUrl);

                case 3:
                  dynamicUrl = _context.sent;
                  // Add this wallet to the state wallet list with this generated url
                  allMobileWallets = [].concat((0, _toConsumableArray2.default)(mobileWallets), [_objectSpread(_objectSpread({}, wallet), {}, {
                    dynamicUrl: dynamicUrl
                  })]);
                  setMobileWallets(allMobileWallets);

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref6.apply(this, arguments);
        };
      }());
    }; // Only run this when the modal is open and once for each wallet


    if (showQRCodeModal && initialLoad) {
      setInitialLoad(false);
      asyncBuildMobileWallets();
    }
  }, [QRCodeUrl, mobileWallets, initialLoad, showQRCodeModal]); // -----------------------------------------------------------------------------------------------
  // Ability to copy the QR code to the clipboard as a string (success message has a timeout)
  // -----------------------------------------------------------------------------------------------

  var copyToClipboard = function copyToClipboard() {
    navigator.clipboard.writeText(encodedQRCodeUrl).then(function () {
      clearTimeout(timeoutInstance);
      setCopied(true);
      var newTimeoutInstance = window.setTimeout(function () {
        setCopied(false);
      }, 3000);
      setTimeoutInstance(newTimeoutInstance);
    });
  }; // -----------------------------------------------
  // Build the QR Code and mobile download view
  // -----------------------------------------------


  var renderQRView = function renderQRView() {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, _Text || (_Text = /*#__PURE__*/_react.default.createElement(Text, {
      className: "wcjs-qr-text"
    }, title)), _ImgContainer || (_ImgContainer = /*#__PURE__*/_react.default.createElement(ImgContainer, {
      className: "wcjs-qr-img"
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: QRCode,
      alt: "WalletConnect QR Code"
    }))), copied ? _CopyButton || (_CopyButton = /*#__PURE__*/_react.default.createElement(CopyButton, {
      disabled: true,
      className: "wcjs-qr-copy"
    }, "QR Code Copied")) : _CopyButton2 || (_CopyButton2 = /*#__PURE__*/_react.default.createElement(CopyButton, {
      onClick: copyToClipboard,
      className: "wcjs-qr-copy"
    }, "Copy QR Code")), _Text2 || (_Text2 = /*#__PURE__*/_react.default.createElement(Text, {
      className: "wcjs-qr-text"
    }, "Download Provenance Mobile Wallet")), _AppStoreIcons || (_AppStoreIcons = /*#__PURE__*/_react.default.createElement(AppStoreIcons, {
      className: "wcjs-qr-appicons"
    }, /*#__PURE__*/_react.default.createElement(AppIcon, {
      href: _consts.APP_STORE_APPLE,
      target: "_blank",
      rel: "no-referrer",
      title: "Get the Provenance Blockchain Wallet in the Apple App store."
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: _appStoreBadge.default,
      height: "42px",
      alt: "Apple App Store badge"
    })), /*#__PURE__*/_react.default.createElement(AppIcon, {
      href: _consts.APP_STORE_GOOGLE_PLAY,
      target: "_blank",
      rel: "no-referrer",
      title: "Get the Provenance Blockchain Wallet in the Google Play store."
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: _googlePlayBadge.default,
      height: "42px",
      alt: "Google Play Store badge"
    })))));
  }; // ----------------------------------------
  // Use clicks one of the desktop wallets
  // ----------------------------------------


  var handleDesktopWalletClick = function handleDesktopWalletClick(event, wallet) {
    var runEventAction = function runEventAction() {
      // If the wallet has an eventAction (they should all have an event action...)
      if (wallet.eventAction) {
        // Set the name of the wallet into the walletconnect-js state (to use as a reference)
        // If a custom extension ID has been set, note it (need to handle this better)
        wcs.setState({
          walletApp: wallet.id
        }); // Build eventdata to send to the extension

        var eventData = {
          uri: encodedQRCodeUrl,
          event: 'walletconnect_init'
        }; // Trigger the event action based on the wallet

        wallet.eventAction(eventData);
      }
    }; // Wallet includes a self-existence check function


    if (wallet.walletCheck) {
      // Use function to see if wallet exists
      var walletExists = wallet.walletCheck(); // Wallet exists, run the proper event action

      if (walletExists) runEventAction(); // Wallet doesn't exist, send the user to the wallets download url (if provided)
      else if (wallet.walletUrl) {
        window.open(wallet.walletUrl);
        setShowReloadNotice(true);
      }
    } else {
      // No self-existence check required, just run the event action for this wallet
      runEventAction();
    }
  }; // -------------------------------
  // Build all the desktop wallets
  // -------------------------------


  var buildDesktopWallets = function buildDesktopWallets() {
    return _consts.WALLET_LIST // Pull out all web/extension wallets.
    // If they are in dev mode we don't render them unless they're included in the devWallets override array
    .filter(function (_ref7) {
      var type = _ref7.type,
          dev = _ref7.dev,
          id = _ref7.id;
      return (type === 'web' || type === 'extension') && (!dev || (devWallets === null || devWallets === void 0 ? void 0 : devWallets.includes(id)));
    }).map(function (wallet) {
      var id = wallet.id,
          icon = wallet.icon,
          walletTitle = wallet.title;
      return /*#__PURE__*/_react.default.createElement(WalletRowNonLink, {
        onClick: function onClick(e) {
          return handleDesktopWalletClick(e, wallet);
        },
        key: id,
        className: "wcjs-qr-row-nonlink"
      }, !!icon && /*#__PURE__*/_react.default.createElement(WalletIcon, {
        src: _images.WALLET_ICONS[icon],
        className: "wcjs-qr-icon"
      }), /*#__PURE__*/_react.default.createElement(WalletTitle, {
        className: "wcjs-qr-title"
      }, walletTitle));
    });
  }; // ------------------------------------------------------------------
  // For every built mobile dynamic link, build out the wallet row
  // ------------------------------------------------------------------


  var buildMobileWallets = function buildMobileWallets() {
    return mobileWallets.map(function (wallet) {
      var dynamicUrl = wallet.dynamicUrl,
          walletTitle = wallet.title,
          icon = wallet.icon,
          id = wallet.id;

      if (dynamicUrl) {
        return /*#__PURE__*/_react.default.createElement(WalletRow, {
          className: "wcjs-qr-row",
          href: dynamicUrl,
          rel: "noopener noreferrer",
          target: "_blank",
          key: id,
          onClick: function onClick() {
            // Update the walletApp value to be this mobile wallet id
            wcs.setState({
              walletApp: wallet.id
            });
          }
        }, !!icon && /*#__PURE__*/_react.default.createElement(WalletIcon, {
          src: _images.WALLET_ICONS[icon],
          className: "wcjs-qr-icon"
        }), /*#__PURE__*/_react.default.createElement(WalletTitle, {
          className: "wcjs-qr-title"
        }, walletTitle));
      }

      return /*#__PURE__*/_react.default.createElement(Text, {
        className: "wcjs-qr-text"
      }, "Unable to fetch ", walletTitle, " link. Please try again later.");
    });
  };

  var DesktopWalletsList = buildDesktopWallets();
  return showQRCodeModal ? /*#__PURE__*/_react.default.createElement(QRCodeModalContainer, {
    className: className,
    id: "wcjs-qr-modal",
    onClick: function onClick() {
      return wcs.showQRCode(false);
    }
  }, /*#__PURE__*/_react.default.createElement(QRModalContent, {
    onClick: function onClick(e) {
      return e.stopPropagation();
    },
    className: "wcjs-qr-content"
  }, /*#__PURE__*/_react.default.createElement(CloseQRModal, {
    onClick: function onClick() {
      return wcs.showQRCode(false);
    },
    className: "wcjs-qr-close"
  }, _svg || (_svg = /*#__PURE__*/_react.default.createElement("svg", {
    viewBox: "0 0 10 10",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1",
    height: "1.4rem"
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: "M8.99984 1L5.09375 5L8.99984 9"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M1.00016 1L4.90625 5L1.00016 9"
  })))), /*#__PURE__*/_react.default.createElement(Toggle, {
    className: "wcjs-qr-toggle"
  }, options.includes('qr') && /*#__PURE__*/_react.default.createElement(ToggleNotch, {
    active: view === 'qr',
    onClick: function onClick() {
      return setView('qr');
    },
    className: "wcjs-qr-notch ".concat(view === 'qr' ? 'active' : '')
  }, "QR Code"), options.includes('desktop') && /*#__PURE__*/_react.default.createElement(ToggleNotch, {
    active: view === 'desktop',
    onClick: function onClick() {
      return setView('desktop');
    },
    className: "wcjs-qr-notch ".concat(view === 'desktop' ? 'active' : '')
  }, "Desktop"), options.includes('mobile') && /*#__PURE__*/_react.default.createElement(ToggleNotch, {
    active: view === 'mobile',
    onClick: function onClick() {
      return setView('mobile');
    },
    className: "wcjs-qr-notch ".concat(view === 'mobile' ? 'active' : '')
  }, "Mobile")), view === 'qr' ? renderQRView() : _Text3 || (_Text3 = /*#__PURE__*/_react.default.createElement(Text, {
    className: "wcjs-qr-text"
  }, "Select wallet")), view === 'desktop' && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, !!showReloadNotice && /*#__PURE__*/_react.default.createElement(ReloadNotice, {
    className: "wcjs-qr-reload"
  }, /*#__PURE__*/_react.default.createElement(CloseQRModal, {
    onClick: function onClick() {
      return setShowReloadNotice(false);
    },
    className: "wcjs-qr-close"
  }, _svg2 || (_svg2 = /*#__PURE__*/_react.default.createElement("svg", {
    viewBox: "0 0 10 10",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1",
    height: "1.4rem"
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: "M8.99984 1L5.09375 5L8.99984 9"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M1.00016 1L4.90625 5L1.00016 9"
  })))), _Text4 || (_Text4 = /*#__PURE__*/_react.default.createElement(Text, {
    className: "wcjs-qr-text"
  }, "Note: You must reload this page after installing the Provenance Blockchain Wallet extension.")), /*#__PURE__*/_react.default.createElement("button", {
    onClick: function onClick() {
      return setShowReloadNotice(false);
    }
  }, "Back"), /*#__PURE__*/_react.default.createElement("button", {
    onClick: function onClick() {
      return window.location.reload();
    }
  }, "Reload")), DesktopWalletsList.length ? DesktopWalletsList : _Text5 || (_Text5 = /*#__PURE__*/_react.default.createElement(Text, {
    className: "wcjs-qr-text"
  }, "No desktop wallets currently available."))), view === 'mobile' && buildMobileWallets())) : null;
};

exports.QRCodeModal = QRCodeModal;