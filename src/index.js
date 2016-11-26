import {run} from '@cycle/xstream-run'
import {div, label, input, button, hr, h1, makeDOMDriver} from '@cycle/dom'
import storageDriver from '@cycle/storage'
import xs from 'xstream'
import debounce from 'xstream/extra/debounce'

import Badge from './components/badge'
import BadgeEditor from './components/badge_editor'

function main(sources) {
  const storedUrl$ = sources.storage.local
    .getItem('url')
    .startWith('')

  const url$ = sources.DOM.select('.url').events('input').map(e => e.target.value)

  const badgeEditor = BadgeEditor({
    DOM: sources.DOM,
    props$: xs.of({
      subject: 'Subject',
      status: 'Status',
      color: 'red'
    })
  })

  const badge = Badge({
    props$: badgeEditor.config$.compose(debounce(100))
  })



  const vtree$ = xs.combine(storedUrl$, badge.DOM, badgeEditor.DOM).map(([storedUrl, badgeDOM, editorDOM]) => {
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
      label('Name:'),
      input('.name'),
      button('.save', 'Save'),
      hr(),
      editorDOM,
      badgeDOM
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
