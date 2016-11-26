import {run} from '@cycle/xstream-run'
import {div, label, input, button, hr, h1, makeDOMDriver} from '@cycle/dom'
import xs from 'xstream'
import debounce from 'xstream/extra/debounce'

import Badge from './components/badge'
import BadgeEditor from './components/badge_editor'

function main(sources) {
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

  const vtree$ = xs.combine(badge.DOM, badgeEditor.DOM).map(([badgeDOM, editorDOM]) => {
    return div([
      label('Url:'),
      input('.url', ''),
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

  const sinks = {
    DOM: vtree$,
  }

  return sinks
}

run(main, { DOM: makeDOMDriver('#root') })
