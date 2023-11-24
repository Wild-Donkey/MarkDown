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
 * A JSX component that renders simple Google structured data.
 * @module view/misc/structured_data
 */
var urlFn = require('url');

var moment = require('moment');

var _require = require('inferno'),
    Component = _require.Component;

var _require2 = require('hexo-util'),
    stripHTML = _require2.stripHTML,
    escapeHTML = _require2.escapeHTML;
/**
 * A JSX component that renders simple Google structured data.
 *
 * @name StructuredData
 * @example
 * <StructuredData
 *     title="Page title"
 *     url="/page/url"
 *     author="Page author name"
 *     publisher="Page publisher name"
 *     publisherLogo="/path/to/logo"
 *     description="Page description"
 *     images={[ '/path/to/image' ]}
 *     date="Page publish date"
 *     updated="Page update date" />
 */


module.exports = /*#__PURE__*/function (_Component) {
  _inherits(_class, _Component);

  var _super = _createSuper(_class);

  function _class() {
    _classCallCheck(this, _class);

    return _super.apply(this, arguments);
  }

  _createClass(_class, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          title = _this$props.title,
          url = _this$props.url,
          author = _this$props.author,
          publisher = _this$props.publisher;
      var _this$props2 = this.props,
          description = _this$props2.description,
          images = _this$props2.images,
          date = _this$props2.date,
          updated = _this$props2.updated,
          publisherLogo = _this$props2.publisherLogo;

      if (description) {
        description = escapeHTML(stripHTML(description).substring(0, 200).trim()).replace(/\n/g, ' ');
      }

      if (!Array.isArray(images)) {
        images = [images];
      }

      images = images.map(function (path) {
        if (!urlFn.parse(path).host) {
          // resolve `path`'s absolute path relative to current page's url
          // `path` can be both absolute (starts with `/`) or relative.
          return urlFn.resolve(url, path);
        }

        return path;
      }).filter(function (url) {
        return url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.gif') || url.endsWith('.webp');
      });

      if (typeof publisherLogo === 'string' && !urlFn.parse(publisherLogo).host) {
        publisherLogo = urlFn.resolve(url, publisherLogo);
      }

      if (date && (moment.isMoment(date) || moment.isDate(date)) && !isNaN(date.valueOf())) {
        date = date.toISOString();
      }

      if (updated && (moment.isMoment(updated) || moment.isDate(updated)) && !isNaN(updated.valueOf())) {
        updated = updated.toISOString();
      }

      var data = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url
        },
        headline: title,
        image: images,
        datePublished: date,
        dateModified: updated,
        author: {
          '@type': 'Person',
          name: author
        },
        publisher: {
          '@type': 'Organization',
          name: publisher,
          logo: {
            '@type': 'ImageObject',
            url: publisherLogo
          }
        },
        description: description
      };
      return (0, _inferno.createVNode)(1, "script", null, null, 1, {
        "type": "application/ld+json",
        "dangerouslySetInnerHTML": {
          __html: JSON.stringify(data)
        }
      });
    }
  }]);

  return _class;
}(Component);