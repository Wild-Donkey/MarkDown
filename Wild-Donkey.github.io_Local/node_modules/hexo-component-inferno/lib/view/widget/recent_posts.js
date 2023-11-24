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
 * Recent posts widget JSX component.
 * @module view/widget/recent_posts
 */
var _require = require('inferno'),
    Component = _require.Component;

var _require2 = require('../../util/cache'),
    cacheComponent = _require2.cacheComponent;

var ArticleMedia = require('../common/article_media');
/**
 * Recent posts widget JSX component.
 *
 * @example
 * <RecentPosts
 *     title="Widget title"
 *     posts={[
 *         {
 *             url: '/url/to/post',
 *             title: 'Post title',
 *             date: '******',
 *             dateXml: '******',
 *             thumbnail: '/path/to/thumbnail',
 *             categories: [{ name: 'Category name', url: '/path/to/category' }]
 *         }
 *     ]} />
 */


var RecentPosts = /*#__PURE__*/function (_Component) {
  _inherits(RecentPosts, _Component);

  var _super = _createSuper(RecentPosts);

  function RecentPosts() {
    _classCallCheck(this, RecentPosts);

    return _super.apply(this, arguments);
  }

  _createClass(RecentPosts, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          title = _this$props.title,
          posts = _this$props.posts;
      return (0, _inferno.createVNode)(1, "div", "card widget", (0, _inferno.createVNode)(1, "div", "card-content", [(0, _inferno.createVNode)(1, "h3", "menu-label", title, 0), posts.map(function (post) {
        return (0, _inferno.createComponentVNode)(2, ArticleMedia, {
          "thumbnail": post.thumbnail,
          "url": post.url,
          "title": post.title,
          "date": post.date,
          "dateXml": post.dateXml,
          "categories": post.categories
        });
      })], 0), 2, {
        "data-type": "recent-posts"
      });
    }
  }]);

  return RecentPosts;
}(Component);
/**
 * Cacheable recent posts widget JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <RecentPosts.Cacheable
 *     site={{ posts: {...} }}
 *     helper={{
 *         url_for: function() {...},
 *         __: function() {...},
 *         date_xml: function() {...},
 *         date: function() {...}
 *     }}
 *     limit={5} />
 */


RecentPosts.Cacheable = cacheComponent(RecentPosts, 'widget.recentposts', function (props) {
  var site = props.site,
      helper = props.helper,
      _props$limit = props.limit,
      limit = _props$limit === void 0 ? 5 : _props$limit;
  var url_for = helper.url_for,
      __ = helper.__,
      date_xml = helper.date_xml,
      date = helper.date;

  if (!site.posts.length) {
    return null;
  }

  var posts = site.posts.sort('date', -1).limit(limit).map(function (post) {
    return {
      url: url_for(post.link || post.path),
      title: post.title,
      date: date(post.date),
      dateXml: date_xml(post.date),
      thumbnail: post.thumbnail ? url_for(post.thumbnail) : null,
      categories: post.categories.map(function (category) {
        return {
          name: category.name,
          url: url_for(category.path)
        };
      })
    };
  });
  return {
    posts: posts,
    title: __('widget.recents')
  };
});
module.exports = RecentPosts;