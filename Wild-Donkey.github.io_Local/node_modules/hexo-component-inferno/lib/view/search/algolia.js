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
 * Algolia search engine JSX component.
 * @module view/search/algolia
 */
var _require = require('inferno'),
    Component = _require.Component;

var _require2 = require('../../util/cache'),
    cacheComponent = _require2.cacheComponent;
/**
 * Algolia search engine JSX component.
 *
 * @see https://www.algolia.com/
 * @example
 * <Algolia
 *     translation={{
 *         hint: '******',
 *         no_result: '******',
 *         untitled: '******',
 *         empty_preview: '******'
 *     }}
 *     applicationId="******"
 *     apiKey="******"
 *     indexName="******"
 *     jsUrl="******"
 *     algoliaSearchUrl="******"
 *     instantSearchUrl="******" />
 */


var Algolia = /*#__PURE__*/function (_Component) {
  _inherits(Algolia, _Component);

  var _super = _createSuper(Algolia);

  function Algolia() {
    _classCallCheck(this, Algolia);

    return _super.apply(this, arguments);
  }

  _createClass(Algolia, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          translation = _this$props.translation,
          applicationId = _this$props.applicationId,
          apiKey = _this$props.apiKey,
          indexName = _this$props.indexName,
          jsUrl = _this$props.jsUrl,
          algoliaSearchUrl = _this$props.algoliaSearchUrl,
          instantSearchUrl = _this$props.instantSearchUrl;

      if (!applicationId || !apiKey || !indexName) {
        return (0, _inferno.createVNode)(1, "div", "notification is-danger", [(0, _inferno.createTextVNode)("It seems that you forget to set the "), (0, _inferno.createVNode)(1, "code", null, "applicationId", 16), (0, _inferno.createTextVNode)(", "), (0, _inferno.createVNode)(1, "code", null, "apiKey", 16), (0, _inferno.createTextVNode)(", or"), (0, _inferno.createTextVNode)(' '), (0, _inferno.createVNode)(1, "code", null, "indexName", 16), (0, _inferno.createTextVNode)(" for the Aloglia. Please set it in "), (0, _inferno.createVNode)(1, "code", null, "_config.yml", 16), (0, _inferno.createTextVNode)(".")], 0);
      }

      var config = {
        applicationId: applicationId,
        apiKey: apiKey,
        indexName: indexName
      };
      var js = "document.addEventListener('DOMContentLoaded', function () {\n            loadAlgolia(".concat(JSON.stringify(config), ", ").concat(JSON.stringify(translation), ");\n        });");
      return (0, _inferno.createFragment)([(0, _inferno.createVNode)(1, "div", "searchbox", (0, _inferno.createVNode)(1, "div", "searchbox-container", [(0, _inferno.createVNode)(1, "div", "searchbox-header", [(0, _inferno.createVNode)(1, "div", "searchbox-input-container", null, 1, {
        "id": "algolia-input"
      }), (0, _inferno.createVNode)(1, "div", null, null, 1, {
        "id": "algolia-poweredby",
        "style": "display:flex;margin:0 .5em 0 1em;align-items:center;line-height:0"
      }), (0, _inferno.createVNode)(1, "a", "searchbox-close", "\xD7", 16, {
        "href": "javascript:;"
      })], 4), (0, _inferno.createVNode)(1, "div", "searchbox-body"), (0, _inferno.createVNode)(1, "div", "searchbox-footer")], 4), 2), (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "src": algoliaSearchUrl,
        "crossorigin": "anonymous",
        "defer": true
      }), (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "src": instantSearchUrl,
        "crossorigin": "anonymous",
        "defer": true
      }), (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "src": jsUrl,
        "defer": true
      }), (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "dangerouslySetInnerHTML": {
          __html: js
        }
      })], 4);
    }
  }]);

  return Algolia;
}(Component);
/**
 * Cacheable Algolia search engine JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <Algolia.Cacheable
 *     config={{
 *         algolia: {
 *             applicationID: '******',
 *             apiKey: '******',
 *             indexName: '******'
 *         }
 *     }}
 *     helper={{
 *         __: function() {...},
 *         cdn: function() {...},
 *         url_for: function() {...}
 *     }} />
 */


Algolia.Cacheable = cacheComponent(Algolia, 'search.algolia', function (props) {
  var config = props.config,
      helper = props.helper;
  var algolia = config.algolia;
  return {
    translation: {
      hint: helper.__('search.hint'),
      no_result: helper.__('search.no_result'),
      untitled: helper.__('search.untitled'),
      empty_preview: helper.__('search.empty_preview')
    },
    applicationId: algolia ? algolia.applicationID : null,
    apiKey: algolia ? algolia.apiKey : null,
    indexName: algolia ? algolia.indexName : null,
    algoliaSearchUrl: helper.cdn('algoliasearch', '4.0.3', 'dist/algoliasearch-lite.umd.js'),
    instantSearchUrl: helper.cdn('instantsearch.js', '4.3.1', 'dist/instantsearch.production.min.js'),
    jsUrl: helper.url_for('/js/algolia.js')
  };
});
module.exports = Algolia;