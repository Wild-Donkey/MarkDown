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
 * Archives widget JSX component.
 * @module view/widget/archives
 */
var _require = require('inferno'),
    Component = _require.Component;

var _require2 = require('../../util/cache'),
    cacheComponent = _require2.cacheComponent;
/**
 * Archives widget JSX component.
 *
 * @example
 * <Archives
 *     title="Widget title"
 *     showCount={true}
 *     items={[
 *         {
 *             url: '/path/to/archive/page',
 *             name: 'Archive name',
 *             count: 1
 *         }
 *     ]} />
 */


var Archives = /*#__PURE__*/function (_Component) {
  _inherits(Archives, _Component);

  var _super = _createSuper(Archives);

  function Archives() {
    _classCallCheck(this, Archives);

    return _super.apply(this, arguments);
  }

  _createClass(Archives, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          items = _this$props.items,
          title = _this$props.title,
          showCount = _this$props.showCount;
      return (0, _inferno.createVNode)(1, "div", "card widget", (0, _inferno.createVNode)(1, "div", "card-content", (0, _inferno.createVNode)(1, "div", "menu", [(0, _inferno.createVNode)(1, "h3", "menu-label", title, 0), (0, _inferno.createVNode)(1, "ul", "menu-list", items.map(function (archive) {
        return (0, _inferno.createVNode)(1, "li", null, (0, _inferno.createVNode)(1, "a", "level is-mobile", [(0, _inferno.createVNode)(1, "span", "level-start", (0, _inferno.createVNode)(1, "span", "level-item", archive.name, 0), 2), showCount ? (0, _inferno.createVNode)(1, "span", "level-end", (0, _inferno.createVNode)(1, "span", "level-item tag", archive.count, 0), 2) : null], 0, {
          "href": archive.url
        }), 2);
      }), 0)], 4), 2), 2, {
        "data-type": "archives"
      });
    }
  }]);

  return Archives;
}(Component);
/**
 * Cacheable archives widget JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @see https://github.com/hexojs/hexo/blob/4.2.0/lib/plugins/helper/list_archives.js
 * @example
 * <Archives.Cacheable
 *     site={{ posts: {...} }}
 *     config={{
 *         language: 'en_US',
 *         timezone: 'UTC',
 *         archive_dir: '/path/to/archive'
 *     }}
 *     page={{
 *         lang: 'en_US',
 *         language: 'en_US'
 *     }}
 *     helper={{
 *         url_for: function() {...},
 *         _p: function() {...}
 *     }}
 *     type="monthly"
 *     order={-1}
 *     showCount={true}
 *     format="MMMM YYYY" />
 */


Archives.Cacheable = cacheComponent(Archives, 'widget.archives', function (props) {
  var site = props.site,
      config = props.config,
      page = props.page,
      helper = props.helper,
      _props$type = props.type,
      type = _props$type === void 0 ? 'monthly' : _props$type,
      _props$order = props.order,
      order = _props$order === void 0 ? -1 : _props$order,
      _props$showCount = props.showCount,
      showCount = _props$showCount === void 0 ? true : _props$showCount,
      _props$format = props.format,
      format = _props$format === void 0 ? null : _props$format;
  var url_for = helper.url_for,
      _p = helper._p;
  var posts = site.posts.sort('date', order);

  if (!posts.length) {
    return null;
  }

  var language = page.lang || page.language || config.language;
  var data = [];
  var length = 0;
  posts.forEach(function (post) {
    // Clone the date object to avoid pollution
    var date = post.date.clone();

    if (config.timezone) {
      date = date.tz(config.timezone);
    }

    if (language) {
      date = date.locale(language);
    }

    var year = date.year();
    var month = date.month() + 1;
    var name = date.format(format || type === 'monthly' ? 'MMMM YYYY' : 'YYYY');
    var lastData = data[length - 1];

    if (!lastData || lastData.name !== name) {
      length = data.push({
        name: name,
        year: year,
        month: month,
        count: 1
      });
    } else {
      lastData.count++;
    }
  });

  var link = function link(item) {
    var url = "".concat(config.archive_dir, "/").concat(item.year, "/");

    if (type === 'monthly') {
      if (item.month < 10) url += '0';
      url += "".concat(item.month, "/");
    }

    return url_for(url);
  };

  return {
    items: data.map(function (item) {
      return {
        name: item.name,
        count: item.count,
        url: link(item)
      };
    }),
    title: _p('common.archive', Infinity),
    showCount: showCount
  };
});
module.exports = Archives;