"use strict";

var _inferno = require("inferno");

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

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
 * External links widget JSX component.
 * @module view/widget/links
 */
var _require = require('url'),
    URL = _require.URL;

var _require2 = require('inferno'),
    Component = _require2.Component;

var _require3 = require('../../util/cache'),
    cacheComponent = _require3.cacheComponent;
/**
 * External links widget JSX component.
 *
 * @example
 * <Links
 *     title="Widget title"
 *     links={{
 *         'Link Name 1': '/path/to/external/site',
 *         'Link Name 2': {
 *              'link': '/path/to/external/site',
 *              'hide_hostname': true,
 *        }
 *     }} />
 */


var Links = /*#__PURE__*/function (_Component) {
  _inherits(Links, _Component);

  var _super = _createSuper(Links);

  function Links() {
    _classCallCheck(this, Links);

    return _super.apply(this, arguments);
  }

  _createClass(Links, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          title = _this$props.title,
          links = _this$props.links;
      return (0, _inferno.createVNode)(1, "div", "card widget", (0, _inferno.createVNode)(1, "div", "card-content", (0, _inferno.createVNode)(1, "div", "menu", [(0, _inferno.createVNode)(1, "h3", "menu-label", title, 0), (0, _inferno.createVNode)(1, "ul", "menu-list", Object.keys(links).map(function (i) {
        var hostname = links[i];
        if (_typeof(hostname) === 'object') hostname = !hostname.hide_hostname;else try {
          hostname = new URL(hostname).hostname;
        } catch (e) {}
        return (0, _inferno.createVNode)(1, "li", null, (0, _inferno.createVNode)(1, "a", "level is-mobile", [(0, _inferno.createVNode)(1, "span", "level-left", (0, _inferno.createVNode)(1, "span", "level-item", i, 0), 2), hostname ? (0, _inferno.createVNode)(1, "span", "level-right", (0, _inferno.createVNode)(1, "span", "level-item tag", hostname, 0), 2) : null], 0, {
          "href": links[i],
          "target": "_blank",
          "rel": "noopener"
        }), 2);
      }), 0)], 4), 2), 2, {
        "data-type": "links"
      });
    }
  }]);

  return Links;
}(Component);
/**
 * Cacheable external links widget JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <Links.Cacheable
 *     links={{
 *         'Link Name 1': '/path/to/external/site',
 *         'Link Name 2': '/path/to/external/site'
 *     }}
 *     helper={{ __: function() {...} }} />
 */


Links.Cacheable = cacheComponent(Links, 'widget.links', function (props) {
  var helper = props.helper,
      widget = props.widget;

  if (!Object.keys(widget.links).length) {
    return null;
  }

  return {
    title: helper.__('widget.links'),
    links: widget.links
  };
});
module.exports = Links;