import {div, input} from '@cycle/dom'
import xs from 'xstream'

function BadgeEditor({DOM, props$}) {

  const subject$ = DOM.select('.subject').events('input')
    .map(ev => ev.target.value)
    .startWith('Subject')

  const status$ = DOM.select('.status').events('input')
    .map(ev => ev.target.value)
    .startWith('Status')

  const color$ = DOM.select('.color').events('input')
    .map(ev => ev.target.value)
    .startWith('red')

  const vtree$ = props$
    .startWith({})
    .map(props => {
      return div([
        input('.subject', {props: {value: 'Subject'}}),
        input('.status', {props: {value: 'Status'}}),
        input('.color', {props: {value: 'red'}}),
      ])
    })

  const config$ = xs.combine(subject$, status$, color$).map(([subject, status, color]) => {
    return {
      subject,
      status,
      color
    }
  })

  return { DOM: vtree$, config$: config$ }
}

export default BadgeEditor
