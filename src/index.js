import {run} from '@cycle/xstream-run'
import {div, label, input, button, hr, h1, makeDOMDriver} from '@cycle/dom'
import storageDriver from '@cycle/storage'
import xs from 'xstream'
import debounce from 'xstream/extra/debounce'

import CreateForm from './components/create_form'
import EditForm from './components/edit_form'

function main(sources) {
  const storedUrl$ = sources.storage.local
    .getItem('url')
    .startWith('')

  const url$ = sources.DOM.select('.url').events('input').map(e => e.target.value)

  const createForm = CreateForm({DOM: sources.DOM})
  const editForm = EditForm({DOM: sources.DOM})

  const vtree$ = xs.combine(storedUrl$, createForm.DOM, editForm.DOM).map(([storedUrl, createFormDOM, editFormDOM]) => {
    return div([
      label('Url:'),
      input('.url', { props: { value: storedUrl}}),
      hr(),
      label('ReadKey:'),
      input('.read-key'),
      hr(),
      label('WriteKey:'),
      input('.write-key'),
      hr(),
      div([
        createFormDOM,
        editFormDOM
      ])
    ])
  })

  const storageRequests$ = url$.map(url => ({
    key: 'url',
    value: url
  }))

  const sinks = {
    DOM: vtree$,
    storage: storageRequests$
  }

  return sinks
}

const drivers = {
  DOM: makeDOMDriver('#root'),
  storage: storageDriver
}

run(main, drivers)
