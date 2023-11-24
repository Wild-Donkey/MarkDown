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
 * Google AdSense widget JSX component.
 * @module view/widget/adsense
 */
var _require = require('inferno'),
    Component = _require.Component;

var _require2 = require('../../util/cache'),
    cacheComponent = _require2.cacheComponent;
/**
 * Google AdSense widget JSX component.
 *
 * @see https://www.google.com/adsense/new/
 * @example
 * <AdSense
 *     title="Widget title"
 *     clientId="******"
 *     slotId="******" />
 */


var AdSense = /*#__PURE__*/function (_Component) {
  _inherits(AdSense, _Component);

  var _super = _createSuper(AdSense);

  function AdSense() {
    _classCallCheck(this, AdSense);

    return _super.apply(this, arguments);
  }

  _createClass(AdSense, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          title = _this$props.title,
          clientId = _this$props.clientId,
          slotId = _this$props.slotId;

      if (!clientId || !slotId) {
        return (0, _inferno.createVNode)(1, "div", "card widget", (0, _inferno.createVNode)(1, "div", "card-content", (0, _inferno.createVNode)(1, "div", "notification is-danger", [(0, _inferno.createTextVNode)("You need to set "), (0, _inferno.createVNode)(1, "code", null, "client_id", 16), (0, _inferno.createTextVNode)(" and "), (0, _inferno.createVNode)(1, "code", null, "slot_id", 16), (0, _inferno.createTextVNode)(" to show this AD unit. Please set it in "), (0, _inferno.createVNode)(1, "code", null, "_config.yml", 16), (0, _inferno.createTextVNode)(".")], 4), 2), 2);
      }

      return (0, _inferno.createVNode)(1, "div", "card widget", (0, _inferno.createVNode)(1, "div", "card-content", (0, _inferno.createVNode)(1, "div", "menu", [(0, _inferno.createVNode)(1, "h3", "menu-label", title, 0), (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "async": true,
        "src": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      }), (0, _inferno.createVNode)(1, "ins", "adsbygoogle", null, 1, {
        "style": "display:block",
        "data-ad-client": clientId,
        "data-ad-slot": slotId,
        "data-ad-format": "auto",
        "data-full-width-responsive": "true"
      }), (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "dangerouslySetInnerHTML": {
          __html: '(adsbygoogle = window.adsbygoogle || []).push({});'
        }
      })], 4), 2), 2, {
        "data-type": "adsense"
      });
    }
  }]);

  return AdSense;
}(Component);
/**
 * Cacheable Google AdSense widget JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <AdSense.Cacheable
 *     widget={{ client_id: '******', slot_id: '******' }}
 *     helper={{ __: function() {...} }} />
 */


AdSense.Cacheable = cacheComponent(AdSense, 'widget.adsense', function (props) {
  var widget = props.widget,
      helper = props.helper;
  var client_id = widget.client_id,
      slot_id = widget.slot_id;
  return {
    title: helper.__('widget.adsense'),
    clientId: client_id,
    slotId: slot_id
  };
});
module.exports = AdSense;