import {a, ul, li} from '@cycle/dom'

function badgeItem(badge) {
  const button = a('.remove', {attrs: {href: '#', 'data-badge': badge}}, ['Remove'])
  return li([badge, button])
}

function BadgeList(sources) {
  const vtree$ = sources.dataSource$.map((badges) => {
    const lis = badges.map(badgeItem)
    return ul(lis)
  })

  return {
    DOM: vtree$
  }
}

export default BadgeList
