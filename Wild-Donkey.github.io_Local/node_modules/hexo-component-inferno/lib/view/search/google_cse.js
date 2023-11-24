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
 * Google custom search engine JSX component.
 * @module view/search/google_cse
 */
var _require = require('inferno'),
    Component = _require.Component;

var _require2 = require('../../util/cache'),
    cacheComponent = _require2.cacheComponent;
/**
 * Google custom search engine JSX component.
 *
 * @see https://cse.google.com/cse/create/new
 * @example
 * <GoogleCSE
 *     cx="******"
 *     hint="Placeholder text"
 *     jsUrl="******" />
 */


var GoogleCSE = /*#__PURE__*/function (_Component) {
  _inherits(GoogleCSE, _Component);

  var _super = _createSuper(GoogleCSE);

  function GoogleCSE() {
    _classCallCheck(this, GoogleCSE);

    return _super.apply(this, arguments);
  }

  _createClass(GoogleCSE, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          cx = _this$props.cx,
          hint = _this$props.hint,
          jsUrl = _this$props.jsUrl;
      var css = '.searchbox .searchbox-body { background: white; }';
      var js1 = "(function() {\n            var cx = '".concat(cx, "';\n            var gcse = document.createElement('script');\n            gcse.type = 'text/javascript';\n            gcse.async = true;\n            gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;\n            var s = document.getElementsByTagName('script')[0];\n            s.parentNode.insertBefore(gcse, s);\n        })();");
      return (0, _inferno.createFragment)([(0, _inferno.createVNode)(1, "style", null, null, 1, {
        "dangerouslySetInnerHTML": {
          __html: css
        }
      }), (0, _inferno.createVNode)(1, "div", "searchbox", [(0, _inferno.createVNode)(1, "div", "searchbox-container", [(0, _inferno.createVNode)(1, "div", "searchbox-header", [(0, _inferno.createVNode)(1, "div", "searchbox-input-container", (0, _inferno.createVNode)(64, "input", "searchbox-input", null, 1, {
        "type": "text",
        "placeholder": hint
      }), 2), (0, _inferno.createVNode)(1, "a", "searchbox-close", "\xD7", 16, {
        "href": "javascript:;"
      })], 4), function () {
        if (cx) {
          var innerHtml = '<gcse:searchresults-only></gcse:searchresults-only>';
          return (0, _inferno.createVNode)(1, "div", "searchbox-body", null, 1, {
            "dangerouslySetInnerHTML": {
              __html: innerHtml
            }
          });
        }

        return (0, _inferno.createVNode)(1, "div", "notification is-danger", [(0, _inferno.createTextVNode)("It seems that you forget to set the "), (0, _inferno.createVNode)(1, "code", null, "cx", 16), (0, _inferno.createTextVNode)(" value for the Google CSE. Please set it in "), (0, _inferno.createVNode)(1, "code", null, "_config.yml", 16), (0, _inferno.createTextVNode)(".")], 4);
      }()], 0), cx ? (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "dangerouslySetInnerHTML": {
          __html: js1
        }
      }) : null], 0), (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "src": jsUrl
      })], 4);
    }
  }]);

  return GoogleCSE;
}(Component);
/**
 * Cacheable Google custom search engine JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <GoogleCSE.Cacheable
 *     search={{ cx: '******' }}
 *     helper={{
 *         __: function() {...},
 *         url_for: function() {...}
 *     }} />
 */


GoogleCSE.Cacheable = cacheComponent(GoogleCSE, 'search.google', function (props) {
  var helper = props.helper,
      search = props.search;
  return {
    cx: search.cx,
    hint: helper.__('search.hint'),
    jsUrl: helper.url_for('/js/google_cse.js')
  };
});
module.exports = GoogleCSE;