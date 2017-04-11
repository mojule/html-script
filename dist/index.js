'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var html = require('@mojule/html');
var utils = require('@mojule/utils');
var defaultAdapter = require('./jsonml-adapter');
var attributeMapper = require('./attribute-mapper');
var _fromJsonML = require('./from-jsonml');

var capitalizeFirstLetter = utils.capitalizeFirstLetter,
    hyphenatedToCamelCase = utils.hyphenatedToCamelCase;


var H = function H() {
  var adapter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultAdapter;
  var isNode = adapter.isNode,
      createText = adapter.createText,
      createElement = adapter.createElement,
      appendChild = adapter.appendChild,
      addAttributes = adapter.addAttributes,
      addEventListener = adapter.addEventListener;


  var handleArg = function handleArg(el, arg) {
    if (typeof arg === 'string') {
      var text = createText(arg);
      appendChild(el, text);
    } else if (isNode(arg)) {
      appendChild(el, arg);
    }
  };

  var eventListeners = function eventListeners(el, attributes) {
    Object.keys(attributes).forEach(function (key) {
      var value = attributes[key];

      if (typeof value === 'function') {
        if (typeof addEventListener === 'function' && key.startsWith('on')) {
          var eventName = key.slice(2);
          addEventListener(el, eventName, value);
        }

        delete attributes[key];
      }
    });
  };

  var createFromArgs = function createFromArgs(tagName) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var el = createElement(tagName);

    args.forEach(function (arg) {
      handleArg(el, arg);

      if ((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && !isNode(arg)) {
        var attributes = attributeMapper(arg);

        eventListeners(el, attributes);
        addAttributes(el, attributes);
      }
    });

    return el;
  };

  var h = {
    element: createFromArgs,
    adapters: {
      jsonml: defaultAdapter
    },
    attributeMapper: attributeMapper,
    fromJsonML: function fromJsonML(jsonML) {
      return _fromJsonML(jsonML, h);
    }
  };

  var nodeNames = html.tagNames();

  var _nodeNames$reduce = nodeNames.reduce(function (categories, name) {
    if (name.startsWith('#')) {
      categories.nonTags.push(name.slice(1));
    } else {
      categories.tags.push(name);
    }

    return categories;
  }, { tags: [], nonTags: [] }),
      tags = _nodeNames$reduce.tags,
      nonTags = _nodeNames$reduce.nonTags;

  tags.forEach(function (name) {
    return h[name] = function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return createFromArgs.apply(undefined, [name].concat(args));
    };
  });

  nonTags.forEach(function (name) {
    var fname = hyphenatedToCamelCase(name);
    var cname = 'create' + capitalizeFirstLetter(fname);

    h[fname] = function () {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var node = void 0;

      if (html.isEmpty('#' + name)) {
        node = adapter[cname].apply(adapter, args);
      } else {
        node = adapter[cname]();

        args.forEach(function (arg) {
          handleArg(node, arg);
        });
      }

      return node;
    };
  });

  return h;
};

Object.assign(H, H());

module.exports = H;