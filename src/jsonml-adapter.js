'use strict'

const Html = require( 'html-node' )
const utils = require( 'mojule-utils' )

const html = Html()
const { capitalizeFirstLetter } = utils

const jsonmlAdapter = {
  isNode: node => Array.isArray( node ),

  createElement: tagName => [ tagName ],

  createText: text => text,

  appendChild: ( el, child ) => el.push( child ),

  addAttributes: ( el, attributes ) => el.push( attributes ),

  createDocument: () => [ 'document' ],

  createDocumentType: ( name, ...args ) => [ 'documentType', name, ...args ],

  createComment: value => [ 'comment', value ],

  createDocumentFragment: () => [ 'documentFragment' ]
}

module.exports = jsonmlAdapter
