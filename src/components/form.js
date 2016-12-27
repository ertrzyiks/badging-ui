import xs from 'xstream'
import {div, label, button, hr} from '@cycle/dom'

import Badge from './badge'
import BadgeEditor from './badge_editor'
import ControlledInput from './controlled_input'
import debounce from 'xstream/extra/debounce'

function BadgeForm(sources) {
  const click$ = sources.DOM.select('.create').events('click').map(() => null)
  const type$ = sources.DOM.select('.name').events('input').map(ev => ev.target.value)

  const newBadges$ = type$.map(text => click$.take(1).map(() => text)).flatten()

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

  const input = ControlledInput({
    props: xs.of({className: 'name'}),
    assign: newBadges$.map(() => '')
  })

  const vtree$ = xs.combine(badge.DOM, badgeEditor.DOM, input.DOM).map(([badgeDOM, editorDOM, inputDOM]) => {
    return div([
      label('Name:'),
      inputDOM,
      button('.create', 'Create'),
      hr(),
      editorDOM,
      badgeDOM
    ])
  })

  return {
    DOM: vtree$,
    newBadges$: newBadges$
  }
}

export default BadgeForm
