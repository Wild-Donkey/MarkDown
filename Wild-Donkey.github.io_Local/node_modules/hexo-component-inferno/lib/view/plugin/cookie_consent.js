"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var _inferno = require("inferno");

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
 * A JSX component for alerting users about the use of cookies.
 * @module view/plugin/cookie_consent
 */
var _require = require('inferno'),
    Component = _require.Component;

var _require2 = require('../../util/cache'),
    cacheComponent = _require2.cacheComponent;
/**
 * A JSX component for alerting users about the use of cookies.
 *
 * @see https://www.osano.com/cookieconsent/
 * @example
 * <CookieConsent
 *     head={true}
 *     type="info"
 *     theme="classic"
 *     static={false}
 *     position="bottom-left"
 *     policyLink="/path/to/cookie/policy"
 *     text={{
 *         message: 'This website uses cookies to improve your experience.',
 *         dismiss: 'Got it!',
 *         allow: 'Allow cookies',
 *         deny: 'Decline',
 *         link: 'Learn more',
 *         policy: 'Cookie Policy',
 *     }}
 *     cssUrl="/path/to/cookieconsent.css"
 *     jsUrl="/path/to/cookieconsent.js" />
 */


var CookieConsent = /*#__PURE__*/function (_Component) {
  _inherits(CookieConsent, _Component);

  var _super = _createSuper(CookieConsent);

  function CookieConsent() {
    _classCallCheck(this, CookieConsent);

    return _super.apply(this, arguments);
  }

  _createClass(CookieConsent, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          head = _this$props.head,
          text = _this$props.text,
          jsUrl = _this$props.jsUrl,
          cssUrl = _this$props.cssUrl;
      var _this$props2 = this.props,
          type = _this$props2.type,
          theme = _this$props2.theme,
          position = _this$props2.position,
          policyLink = _this$props2.policyLink;
      var message = text.message,
          dismiss = text.dismiss,
          allow = text.allow,
          deny = text.deny,
          link = text.link,
          policy = text.policy;
      var js = "window.addEventListener(\"load\", () => {\n      window.cookieconsent.initialise({\n        type: ".concat(JSON.stringify(type), ",\n        theme: ").concat(JSON.stringify(theme), ",\n        static: ").concat(JSON.stringify(this.props["static"]), ",\n        position: ").concat(JSON.stringify(position), ",\n        content: {\n          message: ").concat(JSON.stringify(message), ",\n          dismiss: ").concat(JSON.stringify(dismiss), ",\n          allow: ").concat(JSON.stringify(allow), ",\n          deny: ").concat(JSON.stringify(deny), ",\n          link: ").concat(JSON.stringify(link), ",\n          policy: ").concat(JSON.stringify(policy), ",\n          href: ").concat(JSON.stringify(policyLink), ",\n        },\n        palette: {\n          popup: {\n            background: \"#edeff5\",\n            text: \"#838391\"\n          },\n          button: {\n            background: \"#4b81e8\"\n          },\n        },\n      });\n    });");

      if (head) {
        return (0, _inferno.createVNode)(1, "link", null, null, 1, {
          "rel": "stylesheet",
          "href": cssUrl
        });
      }

      return (0, _inferno.createFragment)([(0, _inferno.createVNode)(1, "script", null, null, 1, {
        "src": jsUrl,
        "defer": true
      }), (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "dangerouslySetInnerHTML": {
          __html: js
        }
      })], 4);
    }
  }]);

  return CookieConsent;
}(Component);
/**
 * Cacheable JSX component for alerting users about the use of cookies.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <CookieConsent.Cacheable
 *     head={true}
 *     plugin={{
 *         info: "info",
 *         theme: "classic",
 *         static: false,
 *         position: "bottom-left",
 *         policyLink: "/path/to/cookie/policy"
 *     }}
 *     helper={{
 *         __: function() {...},
 *         cdn: function() {...}
 *     }} />
 */


CookieConsent.Cacheable = cacheComponent(CookieConsent, 'plugin.cookieconsent', function (props) {
  var head = props.head,
      plugin = props.plugin,
      helper = props.helper;
  var _plugin$type = plugin.type,
      type = _plugin$type === void 0 ? 'info' : _plugin$type,
      _plugin$theme = plugin.theme,
      theme = _plugin$theme === void 0 ? 'edgeless' : _plugin$theme,
      _plugin$position = plugin.position,
      position = _plugin$position === void 0 ? 'bottom-left' : _plugin$position,
      _plugin$policyLink = plugin.policyLink,
      policyLink = _plugin$policyLink === void 0 ? 'https://www.cookiesandyou.com/' : _plugin$policyLink;
  return {
    head: head,
    type: type,
    theme: theme,
    position: position,
    policyLink: policyLink,
    "static": plugin["static"] || false,
    text: {
      message: helper.__('plugin.cookie_consent.message'),
      dismiss: helper.__('plugin.cookie_consent.dismiss'),
      allow: helper.__('plugin.cookie_consent.allow'),
      deny: helper.__('plugin.cookie_consent.deny'),
      link: helper.__('plugin.cookie_consent.link'),
      policy: helper.__('plugin.cookie_consent.policy')
    },
    cssUrl: helper.cdn('cookieconsent', '3.1.1', 'build/cookieconsent.min.css'),
    jsUrl: helper.cdn('cookieconsent', '3.1.1', 'build/cookieconsent.min.js')
  };
});
module.exports = CookieConsent;