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
 * Paypal donation JSX component.
 * @module view/donate/paypal
 */
var _require = require('inferno'),
    Component = _require.Component;

var _require2 = require('../../util/cache'),
    cacheComponent = _require2.cacheComponent;
/**
 * Paypal donation JSX component.
 *
 * @see https://www.paypal.com/donate/buttons
 * @example
 * <Paypal
 *     title="******"
 *     business="******"
 *     currencyCode="******" />
 */


var Paypal = /*#__PURE__*/function (_Component) {
  _inherits(Paypal, _Component);

  var _super = _createSuper(Paypal);

  function Paypal() {
    _classCallCheck(this, Paypal);

    return _super.apply(this, arguments);
  }

  _createClass(Paypal, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          title = _this$props.title,
          business = _this$props.business,
          currencyCode = _this$props.currencyCode;

      if (!business || !currencyCode) {
        return (0, _inferno.createVNode)(1, "div", "notification is-danger", [(0, _inferno.createTextVNode)("You forgot to set the "), (0, _inferno.createVNode)(1, "code", null, "business", 16), (0, _inferno.createTextVNode)(" or "), (0, _inferno.createVNode)(1, "code", null, "currency_code", 16), (0, _inferno.createTextVNode)(" for Paypal. Please set it in "), (0, _inferno.createVNode)(1, "code", null, "_config.yml", 16), (0, _inferno.createTextVNode)(".")], 4);
      }

      return (0, _inferno.createFragment)([(0, _inferno.createVNode)(1, "a", "button donate", [(0, _inferno.createVNode)(1, "span", "icon is-small", (0, _inferno.createVNode)(1, "i", "fab fa-paypal"), 2), (0, _inferno.createVNode)(1, "span", null, title, 0)], 4, {
        "data-type": "paypal",
        "onclick": "document.getElementById('paypal-donate-form').submit()"
      }), (0, _inferno.createVNode)(1, "form", null, [(0, _inferno.createVNode)(64, "input", null, null, 1, {
        "type": "hidden",
        "name": "cmd",
        "value": "_donations"
      }), (0, _inferno.createVNode)(64, "input", null, null, 1, {
        "type": "hidden",
        "name": "business",
        "value": business
      }), (0, _inferno.createVNode)(64, "input", null, null, 1, {
        "type": "hidden",
        "name": "currency_code",
        "value": currencyCode
      })], 4, {
        "action": "https://www.paypal.com/cgi-bin/webscr",
        "method": "post",
        "target": "_blank",
        "rel": "noopener",
        "id": "paypal-donate-form"
      })], 4);
    }
  }]);

  return Paypal;
}(Component);
/**
 * Cacheable Paypal donation JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <Paypal.Cacheable
 *     donate={{ type: 'paypal', business: '******' currency_code: '******' }}
 *     helper={{ __: function() {...} }} />
 */


Paypal.Cacheable = cacheComponent(Paypal, 'donate.paypal', function (props) {
  var donate = props.donate,
      helper = props.helper;
  return {
    business: donate.business,
    currencyCode: donate.currency_code,
    title: helper.__('donate.' + donate.type)
  };
});
module.exports = Paypal;