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
 * Valine comment JSX component.
 * @module view/comment/valine
 */
var _require = require('inferno'),
    Component = _require.Component;

var _require2 = require('../../util/cache'),
    cacheComponent = _require2.cacheComponent;
/**
 * Valine comment JSX component.
 *
 * @see https://valine.js.org/quickstart.html
 * @example
 * <Valine
 *     appId="******"
 *     appKey="******"
 *     placeholder="******"
 *     avatar="mm"
 *     avatarForce={false}
 *     meta={['nick', 'mail', 'link']}
 *     pageSize={10}
 *     lang="zh-CN"
 *     visitor={false}
 *     highlight={true}
 *     recordIP={false}
 *     serverURLs="http[s]://[tab/us].avoscloud.com"
 *     emojiCDN=""
 *     emojiMaps={null}
 *     enableQQ={false}
 *     requiredFields={[]}
 *     jsUrl="/path/to/Valine.js" />
 */


var Valine = /*#__PURE__*/function (_Component) {
  _inherits(Valine, _Component);

  var _super = _createSuper(Valine);

  function Valine() {
    _classCallCheck(this, Valine);

    return _super.apply(this, arguments);
  }

  _createClass(Valine, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          appId = _this$props.appId,
          appKey = _this$props.appKey,
          placeholder = _this$props.placeholder,
          _this$props$avatar = _this$props.avatar,
          avatar = _this$props$avatar === void 0 ? 'mm' : _this$props$avatar,
          _this$props$avatarFor = _this$props.avatarForce,
          avatarForce = _this$props$avatarFor === void 0 ? false : _this$props$avatarFor,
          _this$props$meta = _this$props.meta,
          meta = _this$props$meta === void 0 ? ['nick', 'mail', 'link'] : _this$props$meta,
          _this$props$pageSize = _this$props.pageSize,
          pageSize = _this$props$pageSize === void 0 ? 10 : _this$props$pageSize,
          _this$props$lang = _this$props.lang,
          lang = _this$props$lang === void 0 ? 'zh-CN' : _this$props$lang,
          _this$props$visitor = _this$props.visitor,
          visitor = _this$props$visitor === void 0 ? false : _this$props$visitor,
          _this$props$highlight = _this$props.highlight,
          highlight = _this$props$highlight === void 0 ? true : _this$props$highlight,
          _this$props$recordIP = _this$props.recordIP,
          recordIP = _this$props$recordIP === void 0 ? false : _this$props$recordIP,
          _this$props$serverURL = _this$props.serverURLs,
          serverURLs = _this$props$serverURL === void 0 ? '' : _this$props$serverURL,
          _this$props$emojiCDN = _this$props.emojiCDN,
          emojiCDN = _this$props$emojiCDN === void 0 ? '' : _this$props$emojiCDN,
          _this$props$emojiMaps = _this$props.emojiMaps,
          emojiMaps = _this$props$emojiMaps === void 0 ? null : _this$props$emojiMaps,
          _this$props$enableQQ = _this$props.enableQQ,
          enableQQ = _this$props$enableQQ === void 0 ? false : _this$props$enableQQ,
          _this$props$requiredF = _this$props.requiredFields,
          fields = _this$props$requiredF === void 0 ? [] : _this$props$requiredF,
          jsUrl = _this$props.jsUrl;

      if (!appId || !appKey) {
        return (0, _inferno.createVNode)(1, "div", "notification is-danger", [(0, _inferno.createTextVNode)("You forgot to set the "), (0, _inferno.createVNode)(1, "code", null, "app_id", 16), (0, _inferno.createTextVNode)(" or "), (0, _inferno.createVNode)(1, "code", null, "app_key", 16), (0, _inferno.createTextVNode)(" for Valine. Please set it in "), (0, _inferno.createVNode)(1, "code", null, "_config.yml", 16), (0, _inferno.createTextVNode)(".")], 4);
      }

      var js = "new Valine({\n            el: '#valine-thread',\n            appId: ".concat(JSON.stringify(appId), ",\n            appKey: ").concat(JSON.stringify(appKey), ",\n            ").concat(placeholder ? "placeholder: ".concat(JSON.stringify(placeholder), ",") : '', "\n            ").concat(avatar ? "avatar: ".concat(JSON.stringify(avatar), ",") : '', "\n            ", "avatarForce: ".concat(JSON.stringify(avatarForce), ","), "\n            ").concat(meta ? "meta: ".concat(JSON.stringify(meta), ",") : '', "\n            ").concat(pageSize ? "pageSize: ".concat(JSON.stringify(pageSize), ",") : '', "\n            ").concat(lang ? "lang: ".concat(JSON.stringify(lang), ",") : '', "\n            ", "visitor: ".concat(JSON.stringify(visitor), ","), "\n            ", "highlight: ".concat(JSON.stringify(highlight), ","), "\n            ", "recordIP: ".concat(JSON.stringify(recordIP), ","), "\n            ").concat(serverURLs ? "serverURLs: ".concat(JSON.stringify(serverURLs), ",") : '', "\n            ").concat(emojiCDN ? "emojiCDN: ".concat(JSON.stringify(emojiCDN), ",") : '', "\n            ").concat(emojiMaps ? "emojiMaps: ".concat(JSON.stringify(emojiMaps), ",") : '', "\n            ", "enableQQ: ".concat(JSON.stringify(enableQQ), ","), "\n            ").concat(Array.isArray(fields) ? "requiredFields: ".concat(JSON.stringify(fields), ",") : '', "\n        });");
      return (0, _inferno.createFragment)([(0, _inferno.createVNode)(1, "div", "content", null, 1, {
        "id": "valine-thread"
      }), (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "src": "//cdn.jsdelivr.net/npm/leancloud-storage@3/dist/av-min.js"
      }), (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "src": jsUrl
      }), (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "dangerouslySetInnerHTML": {
          __html: js
        }
      })], 4);
    }
  }]);

  return Valine;
}(Component);
/**
 * Cacheable Valine comment JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <Valine.Cacheable
 *     comment={{
 *         app_id: "******"
 *         app_key: "******"
 *         placeholder: "******"
 *         avatar: "mm"
 *         avatar_force: false
 *         meta: ['nick', 'mail', 'link']
 *         page_size: 10
 *         lang: "zh-CN"
 *         visitor: false
 *         highlight: true
 *         record_ip: false
 *         server_urls: "http[s]://[tab/us].avoscloud.com"
 *         emoji_cdn: ""
 *         emoji_maps: null
 *         enable_qq: false
 *         required_fields: []
 *     }}
 *     helper={{ cdn: function() {...} }} />
 */


Valine.Cacheable = cacheComponent(Valine, 'comment.valine', function (props) {
  var comment = props.comment,
      helper = props.helper,
      page = props.page,
      config = props.config;
  return {
    appId: comment.app_id,
    appKey: comment.app_key,
    placeholder: comment.placeholder,
    avatar: comment.avatar,
    avatarForce: comment.avatar_force,
    meta: comment.meta,
    pageSize: comment.page_size,
    lang: comment.lang || page.lang || page.language || config.language || 'zh-CN',
    visitor: comment.visitor,
    highlight: comment.highlight,
    recordIP: comment.record_ip,
    serverURLs: comment.server_urls,
    emojiCDN: comment.emoji_cdn,
    emojiMaps: comment.emoji_maps,
    enableQQ: comment.enable_qq,
    requiredFields: comment.required_fields,
    jsUrl: helper.cdn('valine', '1.4.16', 'dist/Valine.min.js')
  };
});
module.exports = Valine;