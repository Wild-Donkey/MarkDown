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

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * Table of contents widget JSX component.
 * @module view/widget/toc
 */
var _require = require('hexo-util'),
    getTocObj = _require.tocObj,
    unescapeHTML = _require.unescapeHTML;

var _require2 = require('inferno'),
    Component = _require2.Component;

var _require3 = require('../../util/cache'),
    cacheComponent = _require3.cacheComponent;
/**
 * Export a tree of headings of an article
 * @private
 * @example
 * getToc('HTML content...');
 * // {
 * //    "1": {
 * //        "id": "How-to-enable-table-of-content-for-a-post",
 * //        "text": "How to enable table of content for a post",
 * //        "index": "1"
 * //    },
 * //    "2": {
 * //        "1": {
 * //            "1": {
 * //                "id": "Third-level-title",
 * //                "text": "Third level title",
 * //                "index": "2.1.1"
 * //            },
 * //            "id": "Second-level-title",
 * //            "text": "Second level title",
 * //            "index": "2.1"
 * //        },
 * //        "2": {
 * //            "id": "Another-second-level-title",
 * //            "text": "Another second level title",
 * //            "index": "2.2"
 * //        },
 * //        "id": "First-level-title",
 * //        "text": "First level title",
 * //        "index": "2"
 * //    }
 * // }
 */


function getToc(content, maxDepth) {
  var toc = {};
  var tocObj = getTocObj(content, {
    min_depth: 1,
    max_depth: 6
  });
  var minLevels = Array.from(new Set(tocObj.map(function (item) {
    return item.level;
  }))).sort(function (a, b) {
    return a - b;
  }).slice(0, maxDepth);
  var levels = new Array(minLevels.length).fill(0);
  tocObj.forEach(function (item) {
    if (!minLevels.includes(item.level)) {
      return;
    }

    var text = item.text,
        id = item.id;
    var level = item.level - minLevels[0];

    for (var i = 0; i < levels.length; i++) {
      if (i > level) {
        levels[i] = 0;
      } else if (i < level) {
        if (levels[i] === 0) {
          // if headings start with a lower level heading, set the former heading index to 1
          // e.g. h3, h2, h1, h2, h3 => 1.1.1, 1.2, 2, 2.1, 2.1.1
          levels[i] = 1;
        }
      } else {
        levels[i] += 1;
      }
    }

    var node = toc;

    var _iterator = _createForOfIteratorHelper(levels.slice(0, level + 1)),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _i = _step.value;

        if (!(_i in node)) {
          node[_i] = {};
        }

        node = node[_i];
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    node.id = id;
    node.text = text;
    node.index = levels.slice(0, level + 1).join('.');
  });
  return toc;
}
/**
 * Table of contents widget JSX component.
 *
 * @example
 * <Toc
 *     title="Widget title"
 *     content="HTML content"
 *     showIndex={true}
 *     collapsed={true}
 *     maxDepth={3}
 *     jsUrl="******" />
 */


var Toc = /*#__PURE__*/function (_Component) {
  _inherits(Toc, _Component);

  var _super = _createSuper(Toc);

  function Toc() {
    _classCallCheck(this, Toc);

    return _super.apply(this, arguments);
  }

  _createClass(Toc, [{
    key: "renderToc",
    value: function renderToc(toc) {
      var _this = this;

      var showIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var result;
      var keys = Object.keys(toc).filter(function (key) {
        return !['id', 'index', 'text'].includes(key);
      }).map(function (key) {
        return parseInt(key, 10);
      }).sort(function (a, b) {
        return a - b;
      });

      if (keys.length > 0) {
        result = (0, _inferno.createVNode)(1, "ul", "menu-list", keys.map(function (i) {
          return _this.renderToc(toc[i], showIndex);
        }), 0);
      }

      if ('id' in toc && 'index' in toc && 'text' in toc) {
        result = (0, _inferno.createVNode)(1, "li", null, [(0, _inferno.createVNode)(1, "a", "level is-mobile", (0, _inferno.createVNode)(1, "span", "level-left", [showIndex ? (0, _inferno.createVNode)(1, "span", "level-item", toc.index, 0) : null, (0, _inferno.createVNode)(1, "span", "level-item", unescapeHTML(toc.text), 0)], 0), 2, {
          "href": '#' + toc.id
        }), result], 0);
      }

      return result;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          showIndex = _this$props.showIndex,
          _this$props$maxDepth = _this$props.maxDepth,
          maxDepth = _this$props$maxDepth === void 0 ? 3 : _this$props$maxDepth,
          _this$props$collapsed = _this$props.collapsed,
          collapsed = _this$props$collapsed === void 0 ? true : _this$props$collapsed;
      var toc = getToc(this.props.content, maxDepth);

      if (!Object.keys(toc).length) {
        return null;
      }

      var css = '#toc .menu-list > li > a.is-active + .menu-list { display: block; }' + '#toc .menu-list > li > a + .menu-list { display: none; }';
      return (0, _inferno.createVNode)(1, "div", "card widget", [(0, _inferno.createVNode)(1, "div", "card-content", (0, _inferno.createVNode)(1, "div", "menu", [(0, _inferno.createVNode)(1, "h3", "menu-label", this.props.title, 0), this.renderToc(toc, showIndex)], 0), 2), collapsed ? (0, _inferno.createVNode)(1, "style", null, null, 1, {
        "dangerouslySetInnerHTML": {
          __html: css
        }
      }) : null, (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "src": this.props.jsUrl,
        "defer": true
      })], 0, {
        "id": "toc",
        "data-type": "toc"
      });
    }
  }]);

  return Toc;
}(Component);
/**
 * Cacheable table of contents widget JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <Toc.Cacheable
 *     config={{ toc: true }}
 *     page={{ layout: 'post', content: 'HTML content' }}
 *     widget={{ index: true, collapsed: true, depth: 3 }}
 *     helper={{
 *         _p: function() {...},
 *         url_for: function() {...}
 *     }} /> />
 */


Toc.Cacheable = cacheComponent(Toc, 'widget.toc', function (props) {
  var config = props.config,
      page = props.page,
      widget = props.widget,
      helper = props.helper;
  var layout = page.layout,
      content = page.content,
      encrypt = page.encrypt,
      origin = page.origin;
  var index = widget.index,
      _widget$collapsed = widget.collapsed,
      collapsed = _widget$collapsed === void 0 ? true : _widget$collapsed,
      _widget$depth = widget.depth,
      depth = _widget$depth === void 0 ? 3 : _widget$depth;

  if (config.toc !== true || layout !== 'page' && layout !== 'post') {
    return null;
  }

  return {
    title: helper._p('widget.catalogue', Infinity),
    collapsed: collapsed !== false,
    maxDepth: depth | 0,
    showIndex: index !== false,
    content: encrypt ? origin : content,
    jsUrl: helper.url_for('/js/toc.js')
  };
});
module.exports = Toc;