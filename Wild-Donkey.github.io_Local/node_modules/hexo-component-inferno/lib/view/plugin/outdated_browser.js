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
 * Outdated browser detection plugin JSX component.
 * @module view/plugin/outdated_browser
 */
var _require = require('inferno'),
    Component = _require.Component;

var _require2 = require('../../util/cache'),
    cacheComponent = _require2.cacheComponent;
/**
 * Outdated browser detection plugin JSX component.
 *
 * @see https://github.com/outdatedbrowser/outdated-browser
 * @example
 * <OutdatedBrowser
 *     head={true}
 *     cssUrl="/path/to/outdatedbrowser.css"
 *     jsUrl="/path/to/outdatedbrowser.js" />
 */


var OutdatedBrowser = /*#__PURE__*/function (_Component) {
  _inherits(OutdatedBrowser, _Component);

  var _super = _createSuper(OutdatedBrowser);

  function OutdatedBrowser() {
    _classCallCheck(this, OutdatedBrowser);

    return _super.apply(this, arguments);
  }

  _createClass(OutdatedBrowser, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          head = _this$props.head,
          jsUrl = _this$props.jsUrl,
          cssUrl = _this$props.cssUrl;
      var js = "window.addEventListener(\"load\", function () {\n            outdatedBrowser({\n                bgColor: '#f25648',\n                color: '#ffffff',\n                lowerThan: 'object-fit' // display on IE11 or below\n            });\n        });";

      if (head) {
        return (0, _inferno.createVNode)(1, "link", null, null, 1, {
          "rel": "stylesheet",
          "href": cssUrl
        });
      }

      return (0, _inferno.createFragment)([(0, _inferno.createVNode)(1, "div", null, [(0, _inferno.createVNode)(1, "h6", null, "Your browser is out-of-date!", 16), (0, _inferno.createVNode)(1, "p", null, [(0, _inferno.createTextVNode)("Update your browser to view this website correctly.&npsb;"), (0, _inferno.createVNode)(1, "a", null, [(0, _inferno.createTextVNode)("Update my browser now"), (0, _inferno.createTextVNode)(' ')], 0, {
        "id": "btnUpdateBrowser",
        "href": "http://outdatedbrowser.com/"
      })], 4), (0, _inferno.createVNode)(1, "p", "last", (0, _inferno.createVNode)(1, "a", null, "\xD7", 16, {
        "href": "#",
        "id": "btnCloseUpdateBrowser",
        "title": "Close"
      }), 2)], 4, {
        "id": "outdated"
      }), (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "src": jsUrl,
        "defer": true
      }), (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "dangerouslySetInnerHTML": {
          __html: js
        }
      })], 4);
    }
  }]);

  return OutdatedBrowser;
}(Component);
/**
 * Cacheable outdated browser detection plugin JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <OutdatedBrowser.Cacheable
 *     head={true}
 *     helper={{ cdn: function() {...} }} />
 */


OutdatedBrowser.Cacheable = cacheComponent(OutdatedBrowser, 'plugin.outdatedbrowser', function (props) {
  var head = props.head,
      helper = props.helper;
  return {
    head: head,
    cssUrl: helper.cdn('outdatedbrowser', '1.1.5', 'outdatedbrowser/outdatedbrowser.min.css'),
    jsUrl: helper.cdn('outdatedbrowser', '1.1.5', 'outdatedbrowser/outdatedbrowser.min.js')
  };
});
module.exports = OutdatedBrowser;