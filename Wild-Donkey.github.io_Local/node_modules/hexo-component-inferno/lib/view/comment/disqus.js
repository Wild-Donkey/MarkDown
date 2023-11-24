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
 * Disqus comment JSX component.
 * @module view/comment/disqus
 */
var _require = require('inferno'),
    Component = _require.Component;

var _require2 = require('../../util/cache'),
    cacheComponent = _require2.cacheComponent;
/**
 * Disqus comment JSX component.
 *
 * @see https://disqus.com/admin/install/platforms/universalcode/
 * @example
 * <Disqus
 *     shortname="******"
 *     disqusId="******"
 *     permalink="/page/permanent/path"
 *     path="/path/to/page" />
 */


var Disqus = /*#__PURE__*/function (_Component) {
  _inherits(Disqus, _Component);

  var _super = _createSuper(Disqus);

  function Disqus() {
    _classCallCheck(this, Disqus);

    return _super.apply(this, arguments);
  }

  _createClass(Disqus, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          shortname = _this$props.shortname,
          disqusId = _this$props.disqusId,
          path = _this$props.path,
          permalink = _this$props.permalink;

      if (!shortname) {
        return (0, _inferno.createVNode)(1, "div", "notification is-danger", [(0, _inferno.createTextVNode)("You forgot to set the "), (0, _inferno.createVNode)(1, "code", null, "shortname", 16), (0, _inferno.createTextVNode)(" for Disqus. Please set it in"), (0, _inferno.createTextVNode)(' '), (0, _inferno.createVNode)(1, "code", null, "_config.yml", 16), (0, _inferno.createTextVNode)(".")], 0);
      }

      var js = "var disqus_config = function () {\n            this.page.url = '".concat(permalink, "';\n            this.page.identifier = '").concat(disqusId || path, "';\n        };\n        (function() {\n            var d = document, s = d.createElement('script');  \n            s.src = '//' + '").concat(shortname, "' + '.disqus.com/embed.js';\n            s.setAttribute('data-timestamp', +new Date());\n            (d.head || d.body).appendChild(s);\n        })();");
      return (0, _inferno.createFragment)([(0, _inferno.createVNode)(1, "div", null, (0, _inferno.createVNode)(1, "noscript", null, [(0, _inferno.createTextVNode)("Please enable JavaScript to view the"), (0, _inferno.createTextVNode)(' '), (0, _inferno.createVNode)(1, "a", null, "comments powered by Disqus.", 16, {
        "href": "//disqus.com/?ref_noscript"
      })], 0), 2, {
        "id": "disqus_thread"
      }), (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "dangerouslySetInnerHTML": {
          __html: js
        }
      })], 4);
    }
  }]);

  return Disqus;
}(Component);
/**
 * Cacheable Disqus comment JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <Disqus.Cacheable
 *     comment={{ shortname: '*******' }}
 *     page={{
 *         path: '/path/to/page',
 *         disqusId: '******',
 *         permalink: '/page/permanent/link'
 *     }} />
 */


Disqus.Cacheable = cacheComponent(Disqus, 'comment.disqus', function (props) {
  var comment = props.comment,
      page = props.page;
  return {
    path: page.path,
    shortname: comment.shortname,
    disqusId: page.disqusId,
    permalink: page.permalink
  };
});
module.exports = Disqus;