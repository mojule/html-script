'use strict'

const Html = require( 'html-node' )
const utils = require( 'mojule-utils' )
const defaultAdapter = require( './jsonml-adapter' )
const attributeMapper = require( './attribute-mapper' )
const fromJsonML = require( './from-jsonml' )

const html = Html()
const { capitalizeFirstLetter } = utils

const H = ( adapter = defaultAdapter ) => {
  const {
    isNode, createText, createElement, appendChild, addAttributes,
    addEventListener
  } = adapter

  const handleArg = ( el, arg ) => {
    if( typeof arg === 'string' ){
      const text = createText( arg )
      appendChild( el, text )
    } else if( isNode( arg ) ) {
      appendChild( el, arg )
    }
  }

  const eventListeners = ( el, attributes ) => {
    Object.keys( attributes ).forEach( key => {
      const value = attributes[ key ]

      if( typeof value === 'function' ){
        if( typeof addEventListener === 'function' && key.startsWith( 'on' ) ){
          const eventName = key.slice( 2 )
          addEventListener( el, eventName, value )
        }

        delete attributes[ key ]
      }
    })
  }

  const createFromArgs = ( tagName, ...args ) => {
    const el = createElement( tagName )

    args.forEach( arg => {
      handleArg( el, arg )

      if( typeof arg === 'object' && !isNode( arg ) ) {
        const attributes = attributeMapper( arg )

        eventListeners( el, attributes )
        addAttributes( el, attributes )
      }
    })

    return el
  }

  const h = {
    element: createFromArgs,
    adapters: {
      jsonml: defaultAdapter
    },
    attributeMapper,
    fromJsonML: jsonML => fromJsonML( jsonML, h )
  }

  const nodeNames = html.tagNames()

  const { tags, nonTags } = nodeNames.reduce(
    ( categories, name ) => {
      if( name.startsWith( '#' ) ){
        categories.nonTags.push( name.slice( 1 ) )
      } else {
        categories.tags.push( name )
      }

      return categories
    },
    { tags: [], nonTags: [] }
  )

  tags.forEach( name =>
    h[ name ] = ( ...args ) => createFromArgs( name, ...args )
  )

  nonTags.forEach( name => {
    const fname = 'create' + capitalizeFirstLetter( name )

    h[ name ] = ( ...args ) => {
      let node

      if( html.isEmpty( '#' + name ) ){
        node = adapter[ fname ]( ...args )
      } else {
        node = adapter[ fname ]()

        args.forEach( arg => {
          handleArg( node, arg )
        })
      }

      return node
    }
  })

  return h
}

Object.assign( H, H() )

module.exports = H
