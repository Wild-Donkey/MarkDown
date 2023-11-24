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
 * Waline comment JSX component.
 * @module view/comment/waline
 */
var _require = require('inferno'),
    Component = _require.Component;

var _require2 = require('../../util/cache'),
    cacheComponent = _require2.cacheComponent;
/**
 * Waline comment JSX component.
 *
 * @see https://waline.js.org/guide/get-started.html
 * @example
 * <Waline
 *     serverURL="https://path/to/waline/server"
 *     path="window.location.pathname"
 *     lang="zh-CN"
 *     visitor={false}
 *     emoji={['https://cdn.jsdelivr.net/gh/walinejs/emojis/weibo']}
 *     dark=""
 *     meta={['nick', 'mail', 'link']}
 *     requiredMeta={[]}
 *     login="enable"
 *     wordLimit={0},
 *     pageSize={10}
 *     uploadImage={true}
 *     highlight={true}
 *     math={false}
 *     copyright={true}
 *     locale={{placeholder: '', ...}}
 *     jsUrl="/path/to/Waline.js" />
 */


var Waline = /*#__PURE__*/function (_Component) {
  _inherits(Waline, _Component);

  var _super = _createSuper(Waline);

  function Waline() {
    _classCallCheck(this, Waline);

    return _super.apply(this, arguments);
  }

  _createClass(Waline, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          serverURL = _this$props.serverURL,
          _this$props$path = _this$props.path,
          path = _this$props$path === void 0 ? 'window.location.pathname' : _this$props$path,
          _this$props$lang = _this$props.lang,
          lang = _this$props$lang === void 0 ? 'zh-CN' : _this$props$lang,
          _this$props$visitor = _this$props.visitor,
          visitor = _this$props$visitor === void 0 ? false : _this$props$visitor,
          _this$props$emoji = _this$props.emoji,
          emoji = _this$props$emoji === void 0 ? ['https://cdn.jsdelivr.net/gh/walinejs/emojis/weibo'] : _this$props$emoji,
          _this$props$dark = _this$props.dark,
          dark = _this$props$dark === void 0 ? '' : _this$props$dark,
          _this$props$meta = _this$props.meta,
          meta = _this$props$meta === void 0 ? ['nick', 'mail', 'link'] : _this$props$meta,
          _this$props$requiredM = _this$props.requiredMeta,
          requiredMeta = _this$props$requiredM === void 0 ? [] : _this$props$requiredM,
          _this$props$login = _this$props.login,
          login = _this$props$login === void 0 ? 'enable' : _this$props$login,
          _this$props$wordLimit = _this$props.wordLimit,
          wordLimit = _this$props$wordLimit === void 0 ? 0 : _this$props$wordLimit,
          _this$props$pageSize = _this$props.pageSize,
          pageSize = _this$props$pageSize === void 0 ? 10 : _this$props$pageSize,
          _this$props$uploadIma = _this$props.uploadImage,
          uploadImage = _this$props$uploadIma === void 0 ? true : _this$props$uploadIma,
          _this$props$highlight = _this$props.highlight,
          highlight = _this$props$highlight === void 0 ? true : _this$props$highlight,
          _this$props$math = _this$props.math,
          math = _this$props$math === void 0 ? false : _this$props$math,
          _this$props$copyright = _this$props.copyright,
          copyright = _this$props$copyright === void 0 ? true : _this$props$copyright,
          locale = _this$props.locale,
          jsUrl = _this$props.jsUrl;

      if (!serverURL) {
        return (0, _inferno.createVNode)(1, "div", "notification is-danger", [(0, _inferno.createTextVNode)("You forgot to set the "), (0, _inferno.createVNode)(1, "code", null, "server_url", 16), (0, _inferno.createTextVNode)(" for Waline. Please set it in"), (0, _inferno.createTextVNode)(' '), (0, _inferno.createVNode)(1, "code", null, "_config.yml", 16), (0, _inferno.createTextVNode)(".")], 0);
      }

      var js = "Waline({\n            el: '#waline-thread',\n            serverURL: ".concat(JSON.stringify(serverURL), ",\n            path: ").concat(path, ",\n            ").concat(lang ? "lang: ".concat(JSON.stringify(lang), ",") : '', "\n            ", "visitor: ".concat(JSON.stringify(visitor), ","), "\n            ").concat(emoji ? "emoji: ".concat(JSON.stringify(emoji), ",") : '', "\n            ").concat(dark ? "dark: ".concat(JSON.stringify(dark), ",") : '', "\n            ").concat(meta ? "meta: ".concat(JSON.stringify(meta), ",") : '', "\n            ").concat(Array.isArray(requiredMeta) ? "requiredMeta: ".concat(JSON.stringify(requiredMeta), ",") : '', "\n            ").concat(login ? "login: ".concat(JSON.stringify(login), ",") : '', "\n            ").concat(wordLimit ? "wordLimit: ".concat(JSON.stringify(wordLimit), ",") : '', "\n            ").concat(pageSize ? "pageSize: ".concat(JSON.stringify(pageSize), ",") : '', "\n            ").concat(uploadImage === false ? "uploadImage: false," : '', "\n            ").concat(highlight === false ? "highlight: false," : '', "\n            ").concat(math === false ? "math: false," : '', "\n            ", "copyright: ".concat(JSON.stringify(copyright), ","), "\n            ").concat(locale ? "locale: ".concat(JSON.stringify(locale), ",") : '', "\n        });");
      return (0, _inferno.createFragment)([(0, _inferno.createVNode)(1, "div", "content", null, 1, {
        "id": "waline-thread"
      }), (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "src": jsUrl
      }), (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "dangerouslySetInnerHTML": {
          __html: js
        }
      })], 4);
    }
  }]);

  return Waline;
}(Component);
/**
 * Cacheable Waline comment JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <Waline.Cacheable
 *     comment={{
 *         server_url: "https://path/to/waline/server",
 *         path: "window.location.pathname",
 *         lang: "zh-CN",
 *         visitor: false,
 *         emoji: "https://cdn.jsdelivr.net/gh/walinejs/emojis/weibo",
 *         dark: "",
 *         meta: ['nick', 'mail', 'link'],
 *         required_meta: [],
 *         login: false,
 *         word_limit: 0,
 *         page_size: 10,
 *         upload_image: true,
 *         highlight: true,
 *         math: false,
 *         copyright: true,
 *         locale: {placeholder: '', ...}
 *     }}
 *     helper={{ cdn: function() {...} }} />
 */


Waline.Cacheable = cacheComponent(Waline, 'comment.waline', function (props) {
  var comment = props.comment,
      helper = props.helper,
      page = props.page,
      config = props.config;
  return {
    serverURL: comment.server_url,
    path: comment.path,
    lang: comment.lang || page.lang || page.language || config.language || 'zh-CN',
    visitor: comment.visitor,
    emoji: comment.emoji,
    dark: comment.dark,
    meta: comment.meta,
    requiredMeta: comment.required_meta,
    login: comment.login,
    wordLimit: comment.word_limit,
    pageSize: comment.page_size,
    uploadImage: comment.upload_image,
    highlight: comment.highlight,
    math: comment.math,
    copyright: comment.copyright,
    locale: comment.locale,
    jsUrl: helper.cdn('@waline/client', '1.5.4', 'dist/Waline.min.js')
  };
});
module.exports = Waline;