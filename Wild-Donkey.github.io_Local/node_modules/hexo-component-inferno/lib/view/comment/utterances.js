"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var _inferno = require("inferno");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
 * Utterances comment JSX component.
 * @module view/comment/utterances
 */
var _require = require('inferno'),
    Component = _require.Component;

var _require2 = require('../../util/cache'),
    cacheComponent = _require2.cacheComponent;
/**
 * Utterances comment JSX component.
 *
 * @see https://utteranc.es/
 * @example
 * <Utterances
 *     repo="******"
 *     issueTerm="******"
 *     issueNumber={123}
 *     label="******"
 *     theme="******" />
 */


var Utterances = /*#__PURE__*/function (_Component) {
  _inherits(Utterances, _Component);

  var _super = _createSuper(Utterances);

  function Utterances() {
    _classCallCheck(this, Utterances);

    return _super.apply(this, arguments);
  }

  _createClass(Utterances, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          repo = _this$props.repo,
          issueTerm = _this$props.issueTerm,
          issueNumber = _this$props.issueNumber,
          label = _this$props.label,
          theme = _this$props.theme;

      if (!repo || !issueTerm && !issueNumber) {
        return (0, _inferno.createVNode)(1, "div", "notification is-danger", [(0, _inferno.createTextVNode)("You forgot to set the "), (0, _inferno.createVNode)(1, "code", null, "repo", 16), (0, _inferno.createTextVNode)(", "), (0, _inferno.createVNode)(1, "code", null, "issue_term", 16), (0, _inferno.createTextVNode)(", or"), (0, _inferno.createTextVNode)(' '), (0, _inferno.createVNode)(1, "code", null, "issue_number", 16), (0, _inferno.createTextVNode)(" for Utterances. Please set it in "), (0, _inferno.createVNode)(1, "code", null, "_config.yml", 16), (0, _inferno.createTextVNode)(".")], 0);
      }

      var config = {
        repo: repo
      };

      if (issueTerm) {
        config['issue-term'] = issueTerm;
      } else {
        config['issue-number'] = issueNumber;
      }

      if (label) {
        config.label = label;
      }

      if (theme) {
        config.theme = theme;
      }

      return (0, _inferno.normalizeProps)((0, _inferno.createVNode)(1, "script", null, null, 1, _objectSpread(_objectSpread({
        "src": "https://utteranc.es/client.js"
      }, config), {}, {
        "crossorigin": "anonymous",
        "async": true
      })));
    }
  }]);

  return Utterances;
}(Component);
/**
 * Cacheable Utterances comment JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <Utterances.Cacheable
 *     comment={{
 *         repo: '******',
 *         issue_term: "******"
 *         issue_number: {123}
 *         label: "******"
 *         theme: "******"
 *     }} />
 */


Utterances.Cacheable = cacheComponent(Utterances, 'comment.utterances', function (props) {
  var _props$comment = props.comment,
      repo = _props$comment.repo,
      issue_term = _props$comment.issue_term,
      issue_number = _props$comment.issue_number,
      label = _props$comment.label,
      theme = _props$comment.theme;
  return {
    repo: repo,
    issueTerm: issue_term,
    issueNumber: issue_number,
    label: label,
    theme: theme
  };
});
module.exports = Utterances;