import {ul, li} from '@cycle/dom'

function badgeItem(badge) {
  return li(badge)
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
