import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { FIREBASE_FETCH_WALLET_URL, FIGURE_WEB_WALLET_URL } from './urls';
import { DYNAMIC_LINK_INFO_PROD } from './dynamicLinkInfo';
export var WALLET_LIST = [{
  id: 'provenance_mobile',
  type: 'mobile',
  title: 'Provenance Wallet',
  icon: 'provenance',
  generateUrl: function () {
    var _generateUrl = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(QRCodeUrl) {
      var url, linkData, linkProd;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              url = FIREBASE_FETCH_WALLET_URL;
              linkData = encodeURIComponent(decodeURIComponent(QRCodeUrl));
              linkProd = "".concat(DYNAMIC_LINK_INFO_PROD.link, "?data=").concat(linkData); // First fetch prod, then dev

              return _context.abrupt("return", fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                  dynamicLinkInfo: _objectSpread(_objectSpread({}, DYNAMIC_LINK_INFO_PROD), {}, {
                    link: linkProd
                  })
                })
              }).then(function (response) {
                return response.json();
              }).then(function (_ref) {
                var shortLink = _ref.shortLink;
                return shortLink;
              }).catch(function () {
                return 'unavailable';
              }));

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function generateUrl(_x) {
      return _generateUrl.apply(this, arguments);
    }

    return generateUrl;
  }()
}, {
  id: 'provenance_extension',
  type: 'extension',
  title: 'Provenance Blockchain Wallet',
  icon: 'provenance',
  eventAction: function eventAction(eventData) {
    var sendMessageEvent = new CustomEvent('provWalletSendMessage', {
      detail: eventData
    });
    window.document.dispatchEvent(sendMessageEvent);
  },
  walletUrl: 'https://chrome.google.com/webstore/detail/provenance-blockchain-wal/pfcpdmimlaffecihgamfbnfffmdlhkmh',
  walletCheck: function walletCheck() {
    var _window, _window2, _window2$provenance;

    return ((_window = window) === null || _window === void 0 ? void 0 : _window.provenance) && ((_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$provenance = _window2.provenance) === null || _window2$provenance === void 0 ? void 0 : _window2$provenance.isProvenance);
  }
}, {
  dev: true,
  id: 'figure_web',
  type: 'web',
  title: 'Figure Wallet',
  icon: 'figure',
  eventAction: function eventAction(_ref2) {
    var uri = _ref2.uri,
        address = _ref2.address,
        event = _ref2.event;
    // Build a full set of urlSearchParams to append to the url
    var searchParams = new URLSearchParams();
    if (uri) searchParams.append('wc', uri);
    if (address) searchParams.append('address', address);
    if (event) searchParams.append('event', event);
    var searchParamsString = searchParams.toString();
    var url = "".concat(FIGURE_WEB_WALLET_URL).concat(searchParamsString ? "?".concat(searchParamsString) : '');
    var width = 600;
    var height = window.outerHeight < 750 ? window.outerHeight : 550;
    var top = window.outerHeight / 2 + window.screenY - height / 2;
    var left = window.outerWidth / 2 + window.screenX - width / 2;
    var windowOptions = "popup=1 height=".concat(height, " width=").concat(width, " top=").concat(top, " left=").concat(left, " resizable=1, scrollbars=1, fullscreen=0, toolbar=0, menubar=0, status=1");
    window.open(url, undefined, windowOptions);
  }
}];