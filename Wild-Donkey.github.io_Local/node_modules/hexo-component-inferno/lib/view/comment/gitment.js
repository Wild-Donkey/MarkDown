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
 * Gitment comment JSX component.
 * @module view/comment/gitment
 * @deprecated
 */
var crypto = require('crypto');

var _require = require('inferno'),
    Component = _require.Component;

var _require2 = require('../../util/cache'),
    cacheComponent = _require2.cacheComponent;
/**
 * Gitment comment JSX component.
 *
 * @deprecated
 * @see https://github.com/imsun/gitment
 * @example
 * <Gitment
 *     id="******",
 *     repo="******",
 *     owner="******",
 *     clientId="******",
 *     clientSecret="******",
 *     perPage={10},
 *     maxCommentHeight={250} />
 */


var Gitment = /*#__PURE__*/function (_Component) {
  _inherits(Gitment, _Component);

  var _super = _createSuper(Gitment);

  function Gitment() {
    _classCallCheck(this, Gitment);

    return _super.apply(this, arguments);
  }

  _createClass(Gitment, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          id = _this$props.id,
          repo = _this$props.repo,
          owner = _this$props.owner,
          clientId = _this$props.clientId,
          clientSecret = _this$props.clientSecret,
          _this$props$perPage = _this$props.perPage,
          perPage = _this$props$perPage === void 0 ? 20 : _this$props$perPage,
          _this$props$maxCommen = _this$props.maxCommentHeight,
          maxCommentHeight = _this$props$maxCommen === void 0 ? 250 : _this$props$maxCommen;

      if (!id || !repo || !owner || !clientId || !clientSecret) {
        return (0, _inferno.createVNode)(1, "div", "notification is-danger", [(0, _inferno.createTextVNode)("You forgot to set the "), (0, _inferno.createVNode)(1, "code", null, "owner", 16), (0, _inferno.createTextVNode)(", "), (0, _inferno.createVNode)(1, "code", null, "repo", 16), (0, _inferno.createTextVNode)(", "), (0, _inferno.createVNode)(1, "code", null, "clientId", 16), (0, _inferno.createTextVNode)(", or"), (0, _inferno.createTextVNode)(' '), (0, _inferno.createVNode)(1, "code", null, "clientSecret", 16), (0, _inferno.createTextVNode)(" for Gitment. Please set it in "), (0, _inferno.createVNode)(1, "code", null, "_config.yml", 16), (0, _inferno.createTextVNode)(".")], 0);
      }

      var js = "var gitment = new Gitment({\n            id: '".concat(id, "',\n            repo: '").concat(repo, "',\n            owner: '").concat(owner, "',\n            oauth: {\n                client_id: '").concat(clientId, "',\n                client_secret: '").concat(clientSecret, "',\n            },\n            perPage: ").concat(perPage, ",\n            maxCommentHeight: ").concat(maxCommentHeight, "\n        })\n        gitment.render('comment-container')");
      return (0, _inferno.createFragment)([(0, _inferno.createVNode)(1, "div", null, null, 1, {
        "id": "comment-container"
      }), (0, _inferno.createVNode)(1, "link", null, null, 1, {
        "rel": "stylesheet",
        "href": "https://imsun.github.io/gitment/style/default.css"
      }), (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "src": "https://imsun.github.io/gitment/dist/gitment.browser.js"
      }), (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "dangerouslySetInnerHTML": {
          __html: js
        }
      })], 4);
    }
  }]);

  return Gitment;
}(Component);
/**
 * Cacheable Gitment comment JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @deprecated
 * @see module:util/cache.cacheComponent
 * @example
 * <Gitment.Cacheable
 *     comment={{
 *         repo: '******',
 *         owner: '******',
 *         client_id: '******',
 *         client_secret: '******',
 *         per_page: 10,
 *         max_comment_height: 250
 *     }}
 *     page={{ path: '/path/to/page' }} />
 */


Gitment.Cacheable = cacheComponent(Gitment, 'comment.gitment', function (props) {
  var comment = props.comment;
  var id = crypto.createHash('md5').update(props.page.path).digest('hex');
  return {
    id: id,
    repo: comment.repo,
    owner: comment.owner,
    clientId: comment.client_id,
    clientSecret: comment.client_secret,
    perPage: comment.per_page,
    maxCommentHeight: comment.max_comment_height
  };
});
module.exports = Gitment;