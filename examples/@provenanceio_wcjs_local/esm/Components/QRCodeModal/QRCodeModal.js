import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";

var _CopyButton, _Text2, _AppStoreIcons, _svg, _Text3, _svg2, _Text4, _Text5;

import _regeneratorRuntime from "@babel/runtime/regenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars

import styled from 'styled-components';
import { APP_STORE_GOOGLE_PLAY, APP_STORE_APPLE, WALLET_LIST } from '../../consts';
import appleAppStoreImg from '../../images/appStoreBadge.svg';
import googlePlayImg from '../../images/googlePlayBadge.png';
import { WALLET_ICONS } from '../../images';
var QRCodeModalContainer = /*#__PURE__*/styled.div.withConfig({
  displayName: "QRCodeModal__QRCodeModalContainer",
  componentId: "sc-faaaal-0"
})(["top:0;left:0;position:fixed;height:100%;width:100%;display:flex;justify-content:center;align-items:center;background:rgba(0,0,0,0.5);color:#444444;z-index:1000;"]);
var QRModalContent = /*#__PURE__*/styled.div.withConfig({
  displayName: "QRCodeModal__QRModalContent",
  componentId: "sc-faaaal-1"
})(["width:400px;transition:1s all;position:relative;border-radius:10px;background:#eeeeee;padding:40px;display:flex;text-align:center;flex-wrap:wrap;flex-direction:row;justify-content:center;align-items:flex-start;box-shadow:1px 1px 4px 1px rgba(0,0,0,0.25);"]);
var CloseQRModal = /*#__PURE__*/styled.div.withConfig({
  displayName: "QRCodeModal__CloseQRModal",
  componentId: "sc-faaaal-2"
})(["background:#ffffff;height:24px;width:24px;position:absolute;top:10px;right:10px;cursor:pointer;border-radius:100%;display:flex;justify-content:center;align-items:center;"]);
var Toggle = /*#__PURE__*/styled.div.withConfig({
  displayName: "QRCodeModal__Toggle",
  componentId: "sc-faaaal-3"
})(["padding:4px;border-radius:5px;width:80%;display:flex;justify-content:space-between;align-items:center;background:#dddddd;margin-bottom:20px;"]);
var ToggleNotch = /*#__PURE__*/styled.div.withConfig({
  displayName: "QRCodeModal__ToggleNotch",
  componentId: "sc-faaaal-4"
})(["color:#5588dd;transition:500ms all;padding:4px 10px;font-weight:700;", " flex-basis:50%;border-radius:4px;cursor:pointer;text-align:center;user-select:none;"], function (_ref) {
  var active = _ref.active;
  return active && 'background: #FFFFFF;';
});
var Text = /*#__PURE__*/styled.p.withConfig({
  displayName: "QRCodeModal__Text",
  componentId: "sc-faaaal-5"
})(["font-size:1.5rem;margin:0;", ""], function (_ref2) {
  var link = _ref2.link;
  return link && "\n    color: #5588DD;\n    cursor: pointer;\n  ";
});
var CopyButton = /*#__PURE__*/styled.button.withConfig({
  displayName: "QRCodeModal__CopyButton",
  componentId: "sc-faaaal-6"
})(["font-size:10px;margin:0 28px 18px auto;"]);
var ImgContainer = /*#__PURE__*/styled.div.withConfig({
  displayName: "QRCodeModal__ImgContainer",
  componentId: "sc-faaaal-7"
})(["flex-basis:100%;margin-top:10px;"]);
var WalletRow = /*#__PURE__*/styled.a.withConfig({
  displayName: "QRCodeModal__WalletRow",
  componentId: "sc-faaaal-8"
})(["display:flex;align-items:center;margin-top:10px;flex-basis:100%;color:#333333;border-radius:4px;padding:10px 18px;transition:500ms all;text-align:left;&:hover{background:#ffffff;}"]);
var WalletRowNonLink = /*#__PURE__*/styled.div.withConfig({
  displayName: "QRCodeModal__WalletRowNonLink",
  componentId: "sc-faaaal-9"
})(["display:flex;align-items:center;margin-top:10px;flex-basis:100%;color:#333333;border-radius:4px;padding:10px 18px;transition:500ms all;text-align:left;cursor:pointer;input{width:100%;margin-top:10px;padding:10px;border-radius:5px;border:1px solid #aaaaaa;color:#444444;}&:hover{background:#ffffff;}"]);
var WalletTitle = /*#__PURE__*/styled.div.withConfig({
  displayName: "QRCodeModal__WalletTitle",
  componentId: "sc-faaaal-10"
})(["font-weight:900;font-size:2rem;color:", ";user-select:none;"], function (_ref3) {
  var custom = _ref3.custom;
  return custom ? '#4889fa' : '#333333';
});
var WalletIcon = /*#__PURE__*/styled.img.withConfig({
  displayName: "QRCodeModal__WalletIcon",
  componentId: "sc-faaaal-11"
})(["background:#ffffff;border-radius:4px;height:30px;width:30px;margin-right:20px;padding:4px;"]);
var AppStoreIcons = /*#__PURE__*/styled.div.withConfig({
  displayName: "QRCodeModal__AppStoreIcons",
  componentId: "sc-faaaal-12"
})(["display:flex;width:100%;justify-content:center;align-items:center;margin-top:4px;"]);
var AppIcon = /*#__PURE__*/styled.a.withConfig({
  displayName: "QRCodeModal__AppIcon",
  componentId: "sc-faaaal-13"
})(["margin:0 6px;"]);
var ReloadNotice = /*#__PURE__*/styled.div.withConfig({
  displayName: "QRCodeModal__ReloadNotice",
  componentId: "sc-faaaal-14"
})(["position:absolute;top:0;left:0;height:100%;width:100%;background:#eeeeee;padding:60px 40px 40px 40px;border-radius:10px;display:flex;flex-direction:column;flex-wrap:wrap;", "{margin-bottom:34px;}button{margin-top:6px;padding:10px;box-sizing:border-box;cursor:pointer;border-radius:8px;border:1px solid #aaaaaa;background:white;}"], Text);
export var QRCodeModal = function QRCodeModal(_ref4) {
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

  var _useState = useState('qr'),
      _useState2 = _slicedToArray(_useState, 2),
      view = _useState2[0],
      setView = _useState2[1]; // Copy the QR code value as a string


  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      copied = _useState4[0],
      setCopied = _useState4[1];

  var _useState5 = useState(-1),
      _useState6 = _slicedToArray(_useState5, 2),
      timeoutInstance = _useState6[0],
      setTimeoutInstance = _useState6[1]; // List of mobile wallets after their dynamic links have been fetched (async)


  var _useState7 = useState([]),
      _useState8 = _slicedToArray(_useState7, 2),
      mobileWallets = _useState8[0],
      setMobileWallets = _useState8[1];

  var _useState9 = useState(true),
      _useState10 = _slicedToArray(_useState9, 2),
      initialLoad = _useState10[0],
      setInitialLoad = _useState10[1]; // Display a message to the user that a reload is required


  var _useState11 = useState(false),
      _useState12 = _slicedToArray(_useState11, 2),
      showReloadNotice = _useState12[0],
      setShowReloadNotice = _useState12[1]; // On unload, remove any running 'copied' timeoutInstances (prevent memory leaks)


  useEffect(function () {
    return function () {
      if (timeoutInstance) clearTimeout(timeoutInstance);
    };
  }, [timeoutInstance]); // --------------------------------------------
  // Build all the mobile wallet dynamic links
  // --------------------------------------------
  // When a user visits the site on mobile, they will get a "mobile" tab instead of "desktop"
  // The links to those "mobile wallets" are dynamic (iOS vs Android).  To get the links we must fetch

  useEffect(function () {
    var asyncBuildMobileWallets = function asyncBuildMobileWallets() {
      return WALLET_LIST.filter(function (_ref5) {
        var type = _ref5.type;
        return type === 'mobile';
      }).map( /*#__PURE__*/function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(wallet) {
          var dynamicUrl, allMobileWallets;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
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
                  allMobileWallets = [].concat(_toConsumableArray(mobileWallets), [_objectSpread(_objectSpread({}, wallet), {}, {
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
    return /*#__PURE__*/React.createElement(React.Fragment, null, _Text || (_Text = /*#__PURE__*/React.createElement(Text, {
      className: "wcjs-qr-text"
    }, title)), _ImgContainer || (_ImgContainer = /*#__PURE__*/React.createElement(ImgContainer, {
      className: "wcjs-qr-img"
    }, /*#__PURE__*/React.createElement("img", {
      src: QRCode,
      alt: "WalletConnect QR Code"
    }))), copied ? _CopyButton || (_CopyButton = /*#__PURE__*/React.createElement(CopyButton, {
      disabled: true,
      className: "wcjs-qr-copy"
    }, "QR Code Copied")) : _CopyButton2 || (_CopyButton2 = /*#__PURE__*/React.createElement(CopyButton, {
      onClick: copyToClipboard,
      className: "wcjs-qr-copy"
    }, "Copy QR Code")), _Text2 || (_Text2 = /*#__PURE__*/React.createElement(Text, {
      className: "wcjs-qr-text"
    }, "Download Provenance Mobile Wallet")), _AppStoreIcons || (_AppStoreIcons = /*#__PURE__*/React.createElement(AppStoreIcons, {
      className: "wcjs-qr-appicons"
    }, /*#__PURE__*/React.createElement(AppIcon, {
      href: APP_STORE_APPLE,
      target: "_blank",
      rel: "no-referrer",
      title: "Get the Provenance Blockchain Wallet in the Apple App store."
    }, /*#__PURE__*/React.createElement("img", {
      src: appleAppStoreImg,
      height: "42px",
      alt: "Apple App Store badge"
    })), /*#__PURE__*/React.createElement(AppIcon, {
      href: APP_STORE_GOOGLE_PLAY,
      target: "_blank",
      rel: "no-referrer",
      title: "Get the Provenance Blockchain Wallet in the Google Play store."
    }, /*#__PURE__*/React.createElement("img", {
      src: googlePlayImg,
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
    return WALLET_LIST // Pull out all web/extension wallets.
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
      return /*#__PURE__*/React.createElement(WalletRowNonLink, {
        onClick: function onClick(e) {
          return handleDesktopWalletClick(e, wallet);
        },
        key: id,
        className: "wcjs-qr-row-nonlink"
      }, !!icon && /*#__PURE__*/React.createElement(WalletIcon, {
        src: WALLET_ICONS[icon],
        className: "wcjs-qr-icon"
      }), /*#__PURE__*/React.createElement(WalletTitle, {
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
        return /*#__PURE__*/React.createElement(WalletRow, {
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
        }, !!icon && /*#__PURE__*/React.createElement(WalletIcon, {
          src: WALLET_ICONS[icon],
          className: "wcjs-qr-icon"
        }), /*#__PURE__*/React.createElement(WalletTitle, {
          className: "wcjs-qr-title"
        }, walletTitle));
      }

      return /*#__PURE__*/React.createElement(Text, {
        className: "wcjs-qr-text"
      }, "Unable to fetch ", walletTitle, " link. Please try again later.");
    });
  };

  var DesktopWalletsList = buildDesktopWallets();
  return showQRCodeModal ? /*#__PURE__*/React.createElement(QRCodeModalContainer, {
    className: className,
    id: "wcjs-qr-modal",
    onClick: function onClick() {
      return wcs.showQRCode(false);
    }
  }, /*#__PURE__*/React.createElement(QRModalContent, {
    onClick: function onClick(e) {
      return e.stopPropagation();
    },
    className: "wcjs-qr-content"
  }, /*#__PURE__*/React.createElement(CloseQRModal, {
    onClick: function onClick() {
      return wcs.showQRCode(false);
    },
    className: "wcjs-qr-close"
  }, _svg || (_svg = /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 10 10",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1",
    height: "1.4rem"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.99984 1L5.09375 5L8.99984 9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M1.00016 1L4.90625 5L1.00016 9"
  })))), /*#__PURE__*/React.createElement(Toggle, {
    className: "wcjs-qr-toggle"
  }, options.includes('qr') && /*#__PURE__*/React.createElement(ToggleNotch, {
    active: view === 'qr',
    onClick: function onClick() {
      return setView('qr');
    },
    className: "wcjs-qr-notch ".concat(view === 'qr' ? 'active' : '')
  }, "QR Code"), options.includes('desktop') && /*#__PURE__*/React.createElement(ToggleNotch, {
    active: view === 'desktop',
    onClick: function onClick() {
      return setView('desktop');
    },
    className: "wcjs-qr-notch ".concat(view === 'desktop' ? 'active' : '')
  }, "Desktop"), options.includes('mobile') && /*#__PURE__*/React.createElement(ToggleNotch, {
    active: view === 'mobile',
    onClick: function onClick() {
      return setView('mobile');
    },
    className: "wcjs-qr-notch ".concat(view === 'mobile' ? 'active' : '')
  }, "Mobile")), view === 'qr' ? renderQRView() : _Text3 || (_Text3 = /*#__PURE__*/React.createElement(Text, {
    className: "wcjs-qr-text"
  }, "Select wallet")), view === 'desktop' && /*#__PURE__*/React.createElement(React.Fragment, null, !!showReloadNotice && /*#__PURE__*/React.createElement(ReloadNotice, {
    className: "wcjs-qr-reload"
  }, /*#__PURE__*/React.createElement(CloseQRModal, {
    onClick: function onClick() {
      return setShowReloadNotice(false);
    },
    className: "wcjs-qr-close"
  }, _svg2 || (_svg2 = /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 10 10",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1",
    height: "1.4rem"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.99984 1L5.09375 5L8.99984 9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M1.00016 1L4.90625 5L1.00016 9"
  })))), _Text4 || (_Text4 = /*#__PURE__*/React.createElement(Text, {
    className: "wcjs-qr-text"
  }, "Note: You must reload this page after installing the Provenance Blockchain Wallet extension.")), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setShowReloadNotice(false);
    }
  }, "Back"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return window.location.reload();
    }
  }, "Reload")), DesktopWalletsList.length ? DesktopWalletsList : _Text5 || (_Text5 = /*#__PURE__*/React.createElement(Text, {
    className: "wcjs-qr-text"
  }, "No desktop wallets currently available."))), view === 'mobile' && buildMobileWallets())) : null;
};