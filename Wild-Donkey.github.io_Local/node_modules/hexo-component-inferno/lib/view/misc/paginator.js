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
 * Paginator JSX component.
 * @module view/misc/paginator
 */
var _require = require('inferno'),
    Component = _require.Component;
/**
 * Paginator JSX component.
 *
 * @name Paginator
 * @example
 * <Paginator
 *     current={1}
 *     total={10}
 *     baseUrl="/page/base/url"
 *     path="/config/pagination/dir"
 *     urlFor={ function () {...} }
 *     prevTitle="Prev"
 *     nextTitle="Next" />
 */


module.exports = /*#__PURE__*/function (_Component) {
  _inherits(_class, _Component);

  var _super = _createSuper(_class);

  function _class() {
    _classCallCheck(this, _class);

    return _super.apply(this, arguments);
  }

  _createClass(_class, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          current = _this$props.current,
          total = _this$props.total,
          baseUrl = _this$props.baseUrl,
          path = _this$props.path,
          urlFor = _this$props.urlFor,
          prevTitle = _this$props.prevTitle,
          nextTitle = _this$props.nextTitle;

      function getPageUrl(i) {
        return urlFor(i === 1 ? baseUrl : baseUrl + path + '/' + i + '/');
      }

      function pagination(c, m) {
        var current = c;
        var last = m;
        var delta = 1;
        var left = current - delta;
        var right = current + delta + 1;
        var range = [];
        var elements = [];
        var l;

        for (var i = 1; i <= last; i++) {
          if (i === 1 || i === last || i >= left && i < right) {
            range.push(i);
          }
        }

        for (var _i = 0, _range = range; _i < _range.length; _i++) {
          var _i2 = _range[_i];

          if (l) {
            if (_i2 - l === 2) {
              elements.push((0, _inferno.createVNode)(1, "li", null, (0, _inferno.createVNode)(1, "a", "pagination-link", l + 1, 0, {
                "href": getPageUrl(l + 1)
              }), 2));
            } else if (_i2 - l !== 1) {
              elements.push((0, _inferno.createVNode)(1, "li", null, (0, _inferno.createVNode)(1, "span", "pagination-ellipsis", null, 1, {
                "dangerouslySetInnerHTML": {
                  __html: '&hellip;'
                }
              }), 2));
            }
          }

          elements.push((0, _inferno.createVNode)(1, "li", null, (0, _inferno.createVNode)(1, "a", "pagination-link".concat(c === _i2 ? ' is-current' : ''), _i2, 0, {
            "href": getPageUrl(_i2)
          }), 2));
          l = _i2;
        }

        return elements;
      }

      return (0, _inferno.createVNode)(1, "nav", "pagination", [(0, _inferno.createVNode)(1, "div", "pagination-previous".concat(current > 1 ? '' : ' is-invisible is-hidden-mobile'), (0, _inferno.createVNode)(1, "a", null, prevTitle, 0, {
        "href": getPageUrl(current - 1)
      }), 2), (0, _inferno.createVNode)(1, "div", "pagination-next".concat(current < total ? '' : ' is-invisible is-hidden-mobile'), (0, _inferno.createVNode)(1, "a", null, nextTitle, 0, {
        "href": getPageUrl(current + 1)
      }), 2), (0, _inferno.createVNode)(1, "ul", "pagination-list is-hidden-mobile", pagination(current, total), 0)], 4, {
        "role": "navigation",
        "aria-label": "pagination"
      });
    }
  }]);

  return _class;
}(Component);