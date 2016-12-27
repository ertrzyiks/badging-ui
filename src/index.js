import {run} from '@cycle/xstream-run'
import {div, label, input, button, hr, h1, makeDOMDriver} from '@cycle/dom'
import storageDriver from '@cycle/storage'
import xs from 'xstream'

import BadgeForm from './components/form'
import BadgeList from './components/list'

function main(sources) {
  const storedUrl$ = sources.storage.local
    .getItem('url')
    .take(1)
    .startWith('')

  const storedBadgeList$ = sources.storage.local
    .getItem('badges')
    .take(1)
    .startWith('')
    .map(value => value || '[]')
    .map(value => JSON.parse(value))

  const url$ = sources.DOM.select('.url').events('input').map(e => e.target.value)

  const badgeForm = BadgeForm({DOM: sources.DOM})

  const newBadgeList$ = badgeForm.newBadges$.fold((acc, value) => acc.concat(value), [])
  const badgeList$ = xs.combine(storedBadgeList$, newBadgeList$).map(([storedBadges, newBadges]) => {
    return storedBadges.concat(newBadges)
  })

  const badgeList = BadgeList({dataSource$: badgeList$})

  const vtree$ = xs.combine(storedUrl$, badgeList.DOM, badgeForm.DOM).map(([storedUrl, badgeListDOM, badgeFormDOM]) => {
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
        badgeFormDOM,
        badgeListDOM
      ])
    ])
  })

  const storageUrlRequests$ = url$.map(url => ({
    key: 'url',
    value: url
  }))

  const storageBadgeListRequests$ = badgeList$.map(list => ({
    key: 'badges',
    value: JSON.stringify(list)
  }))

  const storageRequests$ = xs.merge(storageUrlRequests$, storageBadgeListRequests$)

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
