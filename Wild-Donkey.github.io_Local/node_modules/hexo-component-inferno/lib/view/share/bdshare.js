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
 * Baidu share buttons JSX component.
 * @module view/share/bdshare
 */
var _require = require('inferno'),
    Component = _require.Component;

var _require2 = require('../../util/cache'),
    cacheComponent = _require2.cacheComponent;
/**
 * Baidu share buttons JSX component.
 *
 * @see http://share.baidu.com/code
 * @example
 * <BdShare />
 */


var BdShare = /*#__PURE__*/function (_Component) {
  _inherits(BdShare, _Component);

  var _super = _createSuper(BdShare);

  function BdShare() {
    _classCallCheck(this, BdShare);

    return _super.apply(this, arguments);
  }

  _createClass(BdShare, [{
    key: "render",
    value: function render() {
      var js = 'window._bd_share_config = { "common": { "bdSnsKey": {}, "bdText": "", "bdMini": "2", "bdPic": "", "bdStyle": "0", "bdSize": "16" }, "share": {} }; with (document) 0[(getElementsByTagName(\'head\')[0] || body).appendChild(createElement(\'script\')).src = \'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=\' + ~(-new Date() / 36e5)];';
      return (0, _inferno.createFragment)([(0, _inferno.createVNode)(1, "div", "bdsharebuttonbox", [(0, _inferno.createVNode)(1, "a", "bds_more", null, 1, {
        "href": "#",
        "data-cmd": "more"
      }), (0, _inferno.createVNode)(1, "a", "bds_qzone", null, 1, {
        "href": "#",
        "data-cmd": "qzone",
        "title": "分享到QQ空间"
      }), (0, _inferno.createVNode)(1, "a", "bds_tsina", null, 1, {
        "href": "#",
        "data-cmd": "tsina",
        "title": "分享到新浪微博"
      }), (0, _inferno.createVNode)(1, "a", "bds_tqq", null, 1, {
        "href": "#",
        "data-cmd": "tqq",
        "title": "分享到腾讯微博"
      }), (0, _inferno.createVNode)(1, "a", "bds_renren", null, 1, {
        "href": "#",
        "data-cmd": "renren",
        "title": "分享到人人网"
      }), (0, _inferno.createVNode)(1, "a", "bds_weixin", null, 1, {
        "href": "#",
        "data-cmd": "weixin",
        "title": "分享到微信"
      })], 4), (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "dangerouslySetInnerHTML": {
          __html: js
        }
      })], 4);
    }
  }]);

  return BdShare;
}(Component);
/**
 * Cacheable Baidu share buttons JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <BdShare.Cacheable />
 */


BdShare.Cacheable = cacheComponent(BdShare, 'share.bdshare', function (props) {
  return {};
});
module.exports = BdShare;