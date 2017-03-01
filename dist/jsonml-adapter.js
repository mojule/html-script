'use strict';

var Html = require('html-node');
var utils = require('mojule-utils');

var html = Html();
var capitalizeFirstLetter = utils.capitalizeFirstLetter;


var jsonmlAdapter = {
  isNode: function isNode(node) {
    return Array.isArray(node);
  },

  createElement: function createElement(tagName) {
    return [tagName];
  },

  createText: function createText(text) {
    return text;
  },

  appendChild: function appendChild(el, child) {
    return el.push(child);
  },

  addAttributes: function addAttributes(el, attributes) {
    return el.push(attributes);
  },

  createDocument: function createDocument() {
    return ['document'];
  },

  createDocumentType: function createDocumentType(name) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return ['documentType', name].concat(args);
  },

  createComment: function createComment(value) {
    return ['comment', value];
  },

  createDocumentFragment: function createDocumentFragment() {
    return ['documentFragment'];
  }
};

module.exports = jsonmlAdapter;