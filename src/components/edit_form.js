import xs from 'xstream'
import {div, label, input, button, hr} from '@cycle/dom'

import Badge from './badge'
import BadgeEditor from './badge_editor'
import debounce from 'xstream/extra/debounce'

function EditForm(sources) {
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
      label('Name:'),
      input('.name'),
      button('.load', 'Load'),
      button('.save', 'Save'),
      hr(),
      editorDOM,
      badgeDOM
    ])
  })

  return {
    DOM: vtree$
  }
}

export default EditForm
