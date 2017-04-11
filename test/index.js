'use strict'

const assert = require( 'assert' )
const H = require( '../src' )

const {
  document, documentType, text, comment, documentFragment, element,
  html, head, body, meta, title, div, p, strong, input
} = H

const expectedJsonML = ["document",["documentType","html"],["html",["head",["meta",{"charset":"utf-8"}],["title","Hello World!"]],["body",["comment","Whose line is it anyway?"],["div",{"id":"main"},["p","The quick brown fox jumps over the ",["strong","lazy dog"]],["input",{"type":"text","name":"firstName","placeholder":"Alex"}]],["comment","Fragment not (usually) necessary but make sure it works"],["documentFragment",["comment","Text not necessary but etc."],["p","lol ","wut"]],["comment","But what if it is not in the spec?"],["customtag",{"class":"kk"},["p","OK that works for me"]]]]]

describe( 'html-script', () => {
  it( 'jsonML adapter', () => {
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

    assert.deepEqual( dom, expectedJsonML )
  })

  it( 'fromJml', () => {
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

    const from = H.fromJsonML( dom )

    assert.deepEqual( from, expectedJsonML )
  })

  it( 'style object', () => {
    const dom = p( { style: { 'font-family': 'sans-serif', 'font-size': '1rem' } }, 'hello' )
    const expect = [ 'p', { style: 'font-family: sans-serif; font-size: 1rem;' }, 'hello' ]

    assert.deepEqual( dom , expect )
  })

  it( 'data object', () => {
    const dom = p( { data: { firstName: 'Nik', lastName: 'Coughlin' } }, 'hello' )
    const expect = [ 'p', { 'data-first-name': 'Nik', 'data-last-name': 'Coughlin' }, 'hello' ]

    assert.deepEqual( dom , expect )
  })

  it( 'removes events', () => {
    const dom = p( { id: 'abc', onclick: e => { console.log( e ) } }, 'hello' )
    const expect = [ 'p', { 'id': 'abc' }, 'hello' ]
  })
})

