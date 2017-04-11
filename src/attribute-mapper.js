'use strict'

const utils = require( '@mojule/utils' )

const { camelCaseToHyphenated } = utils

const handlers = {
  'boolean': ( obj, key, value ) => {
    if( value )
      obj[ key ] = ''
    else
      delete obj[ key ]
  },
  'object': ( obj, key, value ) => {
    if( key in handlers )
      handlers[ key ]( obj, key, value )
    else
      delete obj[ key ]
  },
  'style': ( obj, key, value ) => {
    const keys = Object.keys( value )

    obj.style = keys.reduce(
      ( style, key ) =>
        style + `${ key }: ${ value[ key ] }; `,
      ''
    ).trim()
  },
  'data': ( obj, key, value ) => {
    const keys = Object.keys( value )

    keys.forEach( camelKey => {
      const dataKey = `data-${ camelCaseToHyphenated( camelKey ) }`

      obj[ dataKey ] = value[ camelKey ]
    })

    delete obj.data
  },
  'null': ( obj, key, value ) => {
    delete obj[ key ]
  },
  'undefined': ( obj, key, value ) => {
    delete obj[ key ]
  },
  /*
    Let the adapter handle events, but have a handler to prevent conversion
    to string
  */
  'function': () => {}
}

const attributes = obj => {
  obj = Object.assign( {}, obj )

  Object.keys( obj ).forEach( key => {
    const value = obj[ key ]
    const valueType = typeof value

    if( valueType in handlers )
      handlers[ valueType ]( obj, key, value )
    else
      obj[ key ] = String( value )
  })

  return obj
}

Object.assign( attributes, { handlers } )

module.exports = attributes
