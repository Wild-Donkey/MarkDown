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
 * follow.it widget JSX component.
 * @module view/widget/followit
 */
var _require = require('inferno'),
    Component = _require.Component;

var _require2 = require('../../util/cache'),
    cacheComponent = _require2.cacheComponent;
/**
 * follow.it widget JSX component.
 *
 * @see https://follow.it/
 * @example
 * <FollowIt
 *     title="Widget title"
 *     description="Description text"
 *     buttonTitle="Subscribe now"
 *     actionUrl="https://api.follow.it/subscription-form/******" />
 */


var FollowIt = /*#__PURE__*/function (_Component) {
  _inherits(FollowIt, _Component);

  var _super = _createSuper(FollowIt);

  function FollowIt() {
    _classCallCheck(this, FollowIt);

    return _super.apply(this, arguments);
  }

  _createClass(FollowIt, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          title = _this$props.title,
          description = _this$props.description,
          actionUrl = _this$props.actionUrl,
          buttonTitle = _this$props.buttonTitle;
      return (0, _inferno.createVNode)(1, "div", "card widget", (0, _inferno.createVNode)(1, "div", "card-content", (0, _inferno.createVNode)(1, "div", "menu", [(0, _inferno.createVNode)(1, "h3", "menu-label", title, 0), (0, _inferno.createVNode)(1, "form", null, [(0, _inferno.createVNode)(1, "div", "field has-addons", [(0, _inferno.createVNode)(1, "div", "control has-icons-left is-expanded", [(0, _inferno.createVNode)(64, "input", "input", null, 1, {
        "name": "email",
        "type": "email",
        "placeholder": "Email"
      }), (0, _inferno.createVNode)(1, "span", "icon is-small is-left", (0, _inferno.createVNode)(1, "i", "fas fa-envelope"), 2)], 4), (0, _inferno.createVNode)(1, "div", "control", (0, _inferno.createVNode)(64, "input", "button", null, 1, {
        "type": "submit",
        "value": buttonTitle
      }), 2)], 4), description ? (0, _inferno.createVNode)(1, "p", "help", description, 0) : null], 0, {
        "action": actionUrl,
        "method": "post",
        "target": "_blank"
      })], 4), 2), 2, {
        "data-type": "subscribe-email"
      });
    }
  }]);

  return FollowIt;
}(Component);
/**
 * Cacheable follow.it widget JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <FollowIt.Cacheable
 *     widget={{
 *         description: 'Description text',
 *         action_url: '******'
 *     }}
 *     helper={{ __: function() {...} }} />
 */


FollowIt.Cacheable = cacheComponent(FollowIt, 'widget.followit', function (props) {
  var helper = props.helper,
      widget = props.widget;
  var action_url = widget.action_url,
      description = widget.description;
  return {
    description: description,
    actionUrl: action_url,
    title: helper.__('widget.followit'),
    buttonTitle: helper.__('widget.subscribe')
  };
});
module.exports = FollowIt;