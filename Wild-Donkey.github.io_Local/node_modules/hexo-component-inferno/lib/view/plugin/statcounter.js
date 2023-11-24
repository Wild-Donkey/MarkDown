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
 * Statcounter statistics plugin JSX component.
 * @module view/plugin/statcounter
 */
var _require = require('inferno'),
    Component = _require.Component;

var _require2 = require('../../util/cache'),
    cacheComponent = _require2.cacheComponent;
/**
 * Statcounter statistics plugin JSX component.
 *
 * @see https://statcounter.com/
 * @example
 * <Statcounter project="******" security="******" />
 */


var Statcounter = /*#__PURE__*/function (_Component) {
  _inherits(Statcounter, _Component);

  var _super = _createSuper(Statcounter);

  function Statcounter() {
    _classCallCheck(this, Statcounter);

    return _super.apply(this, arguments);
  }

  _createClass(Statcounter, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          project = _this$props.project,
          security = _this$props.security;
      var js = "\n      var sc_project=".concat(JSON.stringify(project), ";\n      var sc_invisible=1;\n      var sc_security=").concat(JSON.stringify(security), ";\n      var sc_https=1;\n      var sc_remove_link=1;");
      return (0, _inferno.createFragment)([(0, _inferno.createVNode)(1, "script", null, null, 1, {
        "dangerouslySetInnerHTML": {
          __html: js
        }
      }), (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "src": "https://www.statcounter.com/counter/counter.js",
        "async": true
      }), (0, _inferno.createVNode)(1, "noscript", null, (0, _inferno.createVNode)(1, "div", "statcounter", (0, _inferno.createVNode)(1, "img", "statcounter", null, 1, {
        "src": "https://c.statcounter.com/".concat(project, "/0/").concat(security, "/1/"),
        "alt": "real time web analytics"
      }), 2), 2)], 4);
    }
  }]);

  return Statcounter;
}(Component);
/**
 * Cacheable Statcounter statistics plugin JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <Statcounter.Cacheable
 *     head={false}
 *     plugin={{ project: '******', security: '******' }} />
 */


Statcounter.Cacheable = cacheComponent(Statcounter, 'plugin.statcounter', function (props) {
  var head = props.head,
      plugin = props.plugin;
  var project = plugin.project,
      security = plugin.security;

  if (head || !project || !security) {
    return null;
  }

  return {
    project: project,
    security: security
  };
});
module.exports = Statcounter.Cacheable;