# html-script

Create DOMs (real or virtual) using a concise API, similar to
[hyperscript](https://github.com/hyperhype/hyperscript).

This is a general purpose utility that uses adapters to generate the backing
structure, if you specifically want to work with the real browser DOM using the
same API syntax, see [dom-script](https://github.com/mojule/dom-script/).

## Example

```javascript
'use strict'

const H = require( 'html-script' )

const {
  document, documentType, text, comment, documentFragment, element,
  html, head, body, meta, title, div, p, strong, input
} = H

const dom =
  document(
    documentType('html'),
    html(
      head(
        meta({charset:'utf-8'}),
        title('Hello World!')
      ),
      body(
        comment('Whose line is it anyway?'),
        div({id:'main'},
          p('The quick brown fox jumps over the ',strong('lazy dog')),
          input({type:'text',name:'firstName',placeholder:'Alex'})
        ),
        comment('Fragment not (usually) necessary but make sure it works'),
        documentFragment(
          comment('Text not necessary but etc.'),
          p(text('lol '),'wut')
        ),
        comment('But what if it is not in the spec?'),
        element('customtag',{class:'kk'},
          p('OK that works for me')
        )
      )
    )
  )
```

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hello World!</title>
  </head>
  <body>
    <!--Whose line is it anyway?-->
    <div id="main">
      <p>The quick brown fox jumps over the <strong>lazy dog</strong></p>
      <input type="text" name="firstName" placeholder="Alex" />
    </div>
    <!--Fragment not (usually) necessary but make sure it works-->
    <!--Text not necessary but etc.-->
    <p>lol wut</p>
    <!--But what if it is not in the spec?-->
    <customtag class="kk">
      <p>OK that works for me</p>
    </customtag>
  </body>
</html>
```

## Default adapter

Because it is a general purpose utility, `html-script` ships only with a *very*
simple adapter over a virtual DOM that follows the same structure as
[JsonML](http://www.jsonml.org/):

```javascript
const myDiv =
  div( { id: 'myDiv' },
    p( 'Hello world!' )
  )

console.log( JSON.stringify( myDiv ) )
```

```json
["div",{"id":"myDiv"},["p","Hello world!"]]
```

Other implementations include
[dom-script](https://github.com/mojule/dom-script/), which generates real DOM
nodes in the browser, and [mojule-h](https://github.com/mojule/mojule-h), which
generates nodes for the [mojule-dom](https://github.com/mojule/mojule-dom)
virtual DOM.

## Installation and usage

`npm install html-script`

```javascript
const H = require( 'html-script' )

// now destructure out the functions you want - alternatively, use H.div etc.
const { div, p, comment, element } = H

// any objects passed will be treated as attributes
// <div id="main"></div>
const main = div( { id: 'main' } )

// any strings passed will be treated as text nodes
// <p>Hello world!</p>
const hello = p( 'Hello world!' )

// non-element nodes also supported
// <!--Hello world!-->
const helloComment = comment( 'Hello world!' )

// any nodes passed will be appended to the parent
// <div><p>Hello</p><p>World</p></div>
const nested =
  div(
    p( 'Hello' ),
    p( 'World' )
  )

// if html-script doesn't have the element you want
// <custom id="myCustom">Hello world!</custom>
const custom =
  element( 'custom', { id: 'myCustom' },
    'Hello world!'
  )
```

## Attributes

An object passed to an `html-script` function is treated as though it were an
attribute map for the node. For the most part, it is expected to be a simple map
of attribute name to attribute value, and the value is expected to be a string,
with some exceptions listed below.

```javascript
const nameField =
  div(
    label( { for: 'firstName' }, 'First Name' ),
    input( { type: 'text', name: 'firstName' } )
  )
```

```html
<div>
  <label for="firstName">First Name</label>
  <input type="text" name="firstName" />
</div>
```

### boolean attributes

To make working with boolean attributes easier, any attribute that has a boolean
value will be treated as though the boolean attribute is present on the node if
the value is `true`, and absent if the value is `false`:

```javascript
div(
  input( { type: 'radio', checked: true } ),
  input( { type: 'radio', checked: false } )
)
```

```html
<div>
  <input type="radio" checked />
  <input type="radio" />
</div>
```

### style

Either a string, or an object of name value pairs:

```javascript
div(
  p( { style: 'font-family: sans-serif' }, 'Hello' ),
  p( { style: { 'font-family': 'sans-serif', 'font-size': '1rem' }, 'World' )
)
```

```html
<div>
  <p style="font-family: sans-serif">Hello</p>
  <p style="font-family: sans-serif; font-size: 1rem;">World</p>
</div>
```

### data

An attribute named `data` with an object value will be treated similarly to the
[dataSet](https://developer.mozilla.org/en/docs/Web/API/HTMLElement/dataset)
property on DOM nodes, that is, the object keys will be converted from camelCase
to dash-style with a `data-` prefix. This makes it easy to use your existing
models to set data attributes without having to first mangle the names:

```javascript
div( { data: { firstName: 'Nik', lastName: 'Coughlin' } } )
```

```html
<div data-first-name="Nik" data-last-name="Coughlin"></div>
```

### functions

If an attribute value is a function and the name starts with 'on', it's
considered to be an event handler. Note that the default adapter is a `JsonML`
implementation which contains data only, so events don't make sense and they'll
just be removed, but other adapters can handle these as they see fit, see
[dom-script](https://github.com/mojule/dom-script/) for an example.

```javascript
div( { onclick: e => window.alert( 'Clicked!' ) }
  p( 'Hello world!' )
)
```

### other types

All other values are converted to a string via `String( value )`

## Adapters

You can get an instance of `html-script` that uses your custom adapter by
calling it as a function with your adapter as the parameter:

```javascript
const H = require( 'html-script' )
const adapter = require( './path/to/your/adapter' )

const Mine = H( adapter )

const {
  document, documentType, text, comment, documentFragment, element,
  html, head, body, meta, title, div, p, strong, input
} = Mine

const dom =
  document(
    documentType('html')
    // etc.
  )
```

An adapter is an object containing the following functions (where `Node` is your
custom backing type). Type notation below should be self explanatory, it's
similar to [rtype](https://github.com/ericelliott/rtype) /
[typescript](https://github.com/Microsoft/TypeScript) et al.

```javascript
{
  isNode: ( node:Node ) => Boolean,
  createElement: ( tagName:String ) => elementNode:Node,
  createText: ( value:String ) => textNode:Node,
  appendChild: ( node:Node, child:Node ) => Void,
  addAttributes: ( node:Node, attributes:Object ) => Void,
  createDocument: () => documentNode:Node,
  createDocumentType: ( name:String, publicId:String?, systemId:String? ) => documentTypeNode:Node,
  createComment: ( value:String ) => commentNode:Node,
  createDocumentFragment: () => documentFragmentNode:Node,
  addEventListener: ( node:Node, name:String, listener:( e:Event? ) => result:Boolean ) => Void
}
```

See the built in [JsonML adapter]('./src/jsonml-adapter.js') for an example of
how adapters work.

`addEventListener` is optional and only needs to be implemented by adapters for
which is makes sense, eg an adapter over the real DOM, and doesn't need to be
implemented in for example adapters that just back a data-only structure.

`html-script` expects `createDocument` to return a document node with no
children! Note that the default DOM implementation takes a title and adds
various children like an html tag element etc. - if you are backing this with
the real DOM, you will have to clear out all the children before returning the
node.

## Using JsonML with other adapters

Because JsonML is a convenient format for transportation and persistence, a
helper method is provided to populate your custom backing adapter from `JsonML`
data:

```javascript
const H = require( 'html-script' )
const adapter = require( './path/to/your/adapter' )
const jsonML = require( './path/to/some/data.json' )

const Mine = H( adapter )

const dom = Mine.fromJsonML( jsonML )
```