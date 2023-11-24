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
 * A JSX component that renders article licensing block.
 * @module view/misc/article_licensing
 */
var _require = require('inferno'),
    Component = _require.Component;

var _require2 = require('../../util/cache'),
    cacheComponent = _require2.cacheComponent;
/**
 * A JSX component that renders article licensing block.
 *
 * @example
 * <ArticleLicensing
 *     title="article title"
 *     link="full article URL"
 *     author="author name"
 *     authorTitle="Author"
 *     createdAt={date}
 *     createdTitle="Posted on"
 *     updatedAt={date}
 *     updatedTitle="Updated on"
 *     licenses={{
 *         'Creative Commons': {
 *             url: 'https://creativecommons.org/'
 *         },
 *         'Attribution 4.0 International': {
 *             icon: ['fab fa-creative-commons-by', 'fab fa-creative-commons-nc'],
 *             url: 'https://creativecommons.org/licenses/by-nc/4.0/'
 *         },
 *     }}
 *     licensedTitle="Licensed under" />
 */


var ArticleLicensing = /*#__PURE__*/function (_Component) {
  _inherits(ArticleLicensing, _Component);

  var _super = _createSuper(ArticleLicensing);

  function ArticleLicensing() {
    _classCallCheck(this, ArticleLicensing);

    return _super.apply(this, arguments);
  }

  _createClass(ArticleLicensing, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          title = _this$props.title,
          link = _this$props.link,
          author = _this$props.author,
          authorTitle = _this$props.authorTitle,
          createdAt = _this$props.createdAt,
          createdTitle = _this$props.createdTitle,
          updatedAt = _this$props.updatedAt,
          updatedTitle = _this$props.updatedTitle,
          licenses = _this$props.licenses,
          licensedTitle = _this$props.licensedTitle;
      return (0, _inferno.createVNode)(1, "div", "article-licensing box", [(0, _inferno.createVNode)(1, "div", "licensing-title", [title ? (0, _inferno.createVNode)(1, "p", null, title, 0) : null, (0, _inferno.createVNode)(1, "p", null, (0, _inferno.createVNode)(1, "a", null, link, 0, {
        "href": link
      }), 2)], 0), (0, _inferno.createVNode)(1, "div", "licensing-meta level is-mobile", (0, _inferno.createVNode)(1, "div", "level-left", [author ? (0, _inferno.createVNode)(1, "div", "level-item is-narrow", (0, _inferno.createVNode)(1, "div", null, [(0, _inferno.createVNode)(1, "h6", null, authorTitle, 0), (0, _inferno.createVNode)(1, "p", null, author, 0)], 4), 2) : null, createdAt ? (0, _inferno.createVNode)(1, "div", "level-item is-narrow", (0, _inferno.createVNode)(1, "div", null, [(0, _inferno.createVNode)(1, "h6", null, createdTitle, 0), (0, _inferno.createVNode)(1, "p", null, createdAt, 0)], 4), 2) : null, updatedAt ? (0, _inferno.createVNode)(1, "div", "level-item is-narrow", (0, _inferno.createVNode)(1, "div", null, [(0, _inferno.createVNode)(1, "h6", null, updatedTitle, 0), (0, _inferno.createVNode)(1, "p", null, updatedAt, 0)], 4), 2) : null, licenses && Object.keys(licenses).length ? (0, _inferno.createVNode)(1, "div", "level-item is-narrow", (0, _inferno.createVNode)(1, "div", null, [(0, _inferno.createVNode)(1, "h6", null, licensedTitle, 0), (0, _inferno.createVNode)(1, "p", null, Object.keys(licenses).map(function (name) {
        return (0, _inferno.createVNode)(1, "a", licenses[name].icon ? 'icons' : '', licenses[name].icon ? // eslint-disable-line no-nested-ternary
        Array.isArray(licenses[name].icon) ? licenses[name].icon.map(function (icon) {
          return (0, _inferno.createVNode)(1, "i", "icon ".concat(icon));
        }) : (0, _inferno.createVNode)(1, "i", "icon ".concat(licenses[name].icon)) : name, 0, {
          "rel": "noopener",
          "target": "_blank",
          "title": name,
          "href": licenses[name].url
        });
      }), 0)], 4), 2) : null], 0), 2)], 4);
    }
  }]);

  return ArticleLicensing;
}(Component);
/**
 * A JSX component that renders article licensing block.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <ArticleLicensing.Cacheable
 *     config={{
 *         article: {
 *             licenses: {
 *                 'Creative Commons': 'https://creativecommons.org/',
 *                 'Attribution 4.0 International': {
 *                     icon: 'fab fa-creative-commons-by',
 *                     url: 'https://creativecommons.org/licenses/by/4.0/'
 *                 },
 *             }
 *         }
 *     }}
 *     page={page}
 *     helper={{
 *         __: function() {...},
 *         url_for: function() {...}
 *     }} />
 */


ArticleLicensing.Cacheable = cacheComponent(ArticleLicensing, 'misc.articlelicensing', function (props) {
  var config = props.config,
      page = props.page,
      helper = props.helper;

  var _ref = config.article || {},
      licenses = _ref.licenses;

  var links = {};

  if (licenses) {
    Object.keys(licenses).forEach(function (name) {
      var license = licenses[name];
      links[name] = {
        url: helper.url_for(typeof license === 'string' ? license : license.url),
        icon: license.icon
      };
    });
  }

  return {
    title: page.title,
    link: decodeURI(page.permalink),
    author: page.author || config.author,
    authorTitle: helper.__('article.licensing.author'),
    createdAt: page.date ? helper.date(page.date) : null,
    createdTitle: helper.__('article.licensing.created_at'),
    updatedAt: page.updated ? helper.date(page.updated) : null,
    updatedTitle: helper.__('article.licensing.updated_at'),
    licenses: links,
    licensedTitle: helper.__('article.licensing.licensed_under')
  };
});
module.exports = ArticleLicensing;