import xs from 'xstream'
import {a, div, label, ul, li, button} from '@cycle/dom'
import ControlledInput from './controlled_input'

function badgeItem(badge) {
  const button = a('.remove', {attrs: {href: '#', 'data-badge': badge}}, ['Remove'])
  return li([badge, button])
}

function BadgeList(sources) {
  const input = ControlledInput({
    props: xs.of({className: 'name'}),
    assign: sources.addBadge$.map(() => '')
  })

  const vtree$ = xs.combine(sources.dataSource$, input.DOM).map(([badges, inputDOM]) => {
    const lis = badges.map(badgeItem)
    const list = ul(lis)

    return div([
      list,
      label('Name:'),
      inputDOM,
      button('.create', 'Create'),
    ])
  })

  return {
    DOM: vtree$
  }
}

export default BadgeList
