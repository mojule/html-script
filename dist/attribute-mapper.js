'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var utils = require('@mojule/utils');

var camelCaseToHyphenated = utils.camelCaseToHyphenated;


var handlers = {
  'boolean': function boolean(obj, key, value) {
    if (value) obj[key] = '';else delete obj[key];
  },
  'object': function object(obj, key, value) {
    if (key in handlers) handlers[key](obj, key, value);else delete obj[key];
  },
  'style': function style(obj, key, value) {
    var keys = Object.keys(value);

    obj.style = keys.reduce(function (style, key) {
      return style + (key + ': ' + value[key] + '; ');
    }, '').trim();
  },
  'data': function data(obj, key, value) {
    var keys = Object.keys(value);

    keys.forEach(function (camelKey) {
      var dataKey = 'data-' + camelCaseToHyphenated(camelKey);

      obj[dataKey] = value[camelKey];
    });

    delete obj.data;
  },
  'null': function _null(obj, key, value) {
    delete obj[key];
  },
  'undefined': function undefined(obj, key, value) {
    delete obj[key];
  },
  /*
    Let the adapter handle events, but have a handler to prevent conversion
    to string
  */
  'function': function _function() {}
};

var attributes = function attributes(obj) {
  obj = Object.assign({}, obj);

  Object.keys(obj).forEach(function (key) {
    var value = obj[key];
    var valueType = typeof value === 'undefined' ? 'undefined' : _typeof(value);

    if (valueType in handlers) handlers[valueType](obj, key, value);else obj[key] = String(value);
  });

  return obj;
};

Object.assign(attributes, { handlers: handlers });

module.exports = attributes;