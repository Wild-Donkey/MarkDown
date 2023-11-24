"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var _inferno = require("inferno");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * Web app meta tags.
 * @module view/misc/web_app
 */
var _require = require('inferno'),
    Component = _require.Component;

var _require2 = require('../../util/cache'),
    cacheComponent = _require2.cacheComponent;
/**
 * Web app meta tags.
 *
 * @example
 * <WebApp
 *     name="******"
 *     manifest="/path/to/manifest.json"
 *     tileIcon="/path/to/image"
 *     themeColor="#000000"
 *     icons={[
 *         { src: '/path/to/image', sizes: '128x128 256x256' },
 *         { src: '/path/to/image', sizes: '512x512' },
 *     ]} />
 */


var WebApp = /*#__PURE__*/function (_Component) {
  _inherits(WebApp, _Component);

  var _super = _createSuper(WebApp);

  function WebApp() {
    _classCallCheck(this, WebApp);

    return _super.apply(this, arguments);
  }

  _createClass(WebApp, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          name = _this$props.name,
          manifest = _this$props.manifest,
          tileIcon = _this$props.tileIcon,
          themeColor = _this$props.themeColor;
      var icons = [];

      if (Array.isArray(this.props.icons)) {
        var _ref;

        icons = this.props.icons.map(function (icon) {
          var sizes = icon.sizes,
              src = icon.src;

          if (src && sizes) {
            return icon.sizes.split(/\s+/).map(function (size) {
              return {
                sizes: size,
                src: src
              };
            });
          }

          return null;
        });
        icons = icons.filter(Boolean);
        icons = (_ref = []).concat.apply(_ref, _toConsumableArray(icons));
      }

      return (0, _inferno.createFragment)([(0, _inferno.createVNode)(1, "link", null, null, 1, {
        "rel": "manifest",
        "href": manifest
      }), themeColor ? (0, _inferno.createVNode)(1, "meta", null, null, 1, {
        "name": "theme-color",
        "content": themeColor
      }) : null, (0, _inferno.createVNode)(1, "meta", null, null, 1, {
        "name": "application-name",
        "content": name
      }), tileIcon ? (0, _inferno.createVNode)(1, "meta", null, null, 1, {
        "name": "msapplication-TileImage",
        "content": tileIcon
      }) : null, themeColor ? (0, _inferno.createVNode)(1, "meta", null, null, 1, {
        "name": "msapplication-TileColor",
        "content": themeColor
      }) : null, (0, _inferno.createVNode)(1, "meta", null, null, 1, {
        "name": "apple-mobile-web-app-capable",
        "content": "yes"
      }), (0, _inferno.createVNode)(1, "meta", null, null, 1, {
        "name": "apple-mobile-web-app-title",
        "content": name
      }), (0, _inferno.createVNode)(1, "meta", null, null, 1, {
        "name": "apple-mobile-web-app-status-bar-style",
        "content": "default"
      }), icons.map(function (icon) {
        return (0, _inferno.createVNode)(1, "link", null, null, 1, {
          "rel": "apple-touch-icon",
          "sizes": icon.sizes,
          "href": icon.src
        });
      })], 0);
    }
  }]);

  return WebApp;
}(Component);
/**
 * Cacheable web app meta tags.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}) and manifest generator ({@link module:hexo/generator/manifest}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <WebApp.Cacheable
 *     name="******"
 *     themeColor="#000000"
 *     favicon="/path/to/image"
 *     icons={[
 *         { src: '/path/to/image', sizes: '128x128 256x256' },
 *         { src: '/path/to/image', sizes: '512x512' },
 *     ]}
 *     helper={{ url_for: function() {...} }} />
 */


WebApp.Cacheable = cacheComponent(WebApp, 'misc.webapp', function (props) {
  var name = props.name,
      themeColor = props.themeColor,
      favicon = props.favicon,
      icons = props.icons,
      helper = props.helper;
  var tileIcon = null;

  if (Array.isArray(icons)) {
    tileIcon = icons.find(function (icon) {
      return icon.sizes.toLowerCase().indexOf('144x144') > -1;
    });

    if (tileIcon) {
      tileIcon = tileIcon.src;
    } else if (icons.length) {
      tileIcon = icons[0].src;
    }
  }

  if (!tileIcon) {
    tileIcon = favicon;
  }

  return {
    name: name,
    icons: icons,
    tileIcon: tileIcon,
    themeColor: themeColor,
    manifest: helper.url_for('/manifest.json')
  };
});
module.exports = WebApp;