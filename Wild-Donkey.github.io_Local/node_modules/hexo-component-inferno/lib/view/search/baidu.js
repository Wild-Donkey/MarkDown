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
 * Baidu search engine JSX component.
 * @module view/search/baidu
 */
var _require = require('inferno'),
    Component = _require.Component;

var _require2 = require('../../util/cache'),
    cacheComponent = _require2.cacheComponent;
/**
 * Baidu search engine JSX component.
 *
 * @example
 * <Baidu url="/site/url" hint="Placeholder text" />
 */


var Baidu = /*#__PURE__*/function (_Component) {
  _inherits(Baidu, _Component);

  var _super = _createSuper(Baidu);

  function Baidu() {
    _classCallCheck(this, Baidu);

    return _super.apply(this, arguments);
  }

  _createClass(Baidu, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          url = _this$props.url,
          hint = _this$props.hint;
      var siteUrl = url.replace(/http(s)*:\/\//, '');
      var js = "(function ($) {\n            $('.searchbox-input-container').on('submit', function (e) {\n                var keyword = $('.searchbox-input[name=\"wd\"]').val();\n                window.location = 'https://www.baidu.com/s?wd=site:".concat(siteUrl, " ' + keyword;\n                return false;\n            });\n        })(jQuery);\n        (function (document, $) {\n            $(document).on('click', '.navbar-main .search', function () {\n                $('.searchbox').toggleClass('show');\n            }).on('click', '.searchbox .searchbox-mask', function () {\n                $('.searchbox').removeClass('show');\n            }).on('click', '.searchbox-close', function () {\n                $('.searchbox').removeClass('show');\n            });\n        })(document, jQuery);");
      return (0, _inferno.createFragment)([(0, _inferno.createVNode)(1, "div", "searchbox", (0, _inferno.createVNode)(1, "div", "searchbox-container", (0, _inferno.createVNode)(1, "div", "searchbox-header", [(0, _inferno.createVNode)(1, "form", "searchbox-input-container", (0, _inferno.createVNode)(64, "input", "searchbox-input", null, 1, {
        "name": "wd",
        "type": "text",
        "placeholder": hint
      }), 2), (0, _inferno.createVNode)(1, "a", "searchbox-close", "\xD7", 16, {
        "href": "javascript:;"
      })], 4), 2), 2), (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "dangerouslySetInnerHTML": {
          __html: js
        }
      })], 4);
    }
  }]);

  return Baidu;
}(Component);
/**
 * Cacheable Baidu search engine JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <Baidu.Cacheable
 *     config={{ url: '/site/url' }}
 *     helper={{ __: function() {...} }} />
 */


Baidu.Cacheable = cacheComponent(Baidu, 'search.baidu', function (props) {
  var config = props.config,
      helper = props.helper;
  return {
    url: config.url,
    hint: helper.__('search.hint')
  };
});
module.exports = Baidu;