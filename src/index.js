import {run} from '@cycle/xstream-run'
import {div, label, input, button, hr, h1, makeDOMDriver} from '@cycle/dom'
import storageDriver from '@cycle/storage'
import xs from 'xstream'

import BadgeForm from './components/form'
import BadgeList from './components/list'

function main(sources) {
  const storedUrl$ = sources.storage.local
    .getItem('url')
    .map(value => value || '')

  const storedBadgeList$ = sources.storage.local
    .getItem('badges')
    .take(1)
    .map(value => value || '[]')
    .map(value => JSON.parse(value))

  const url$ = sources.DOM.select('.url').events('input').map(e => e.target.value)
  const removeBadge$ = sources.DOM
    .select('.remove')
    .events('click')
    .map((e) => e.preventDefault() || e)
    .map((e) => e.target.getAttribute('data-badge'))
    .map(badge => ({name: 'remove', value: badge}))

  const badgeForm = BadgeForm({DOM: sources.DOM})

  const addBadge$ = badgeForm.newBadges$.map(name => ({name: 'add', value: name}))

  const badgeList$ = storedBadgeList$.map(storedList => {
    return xs.merge(addBadge$, removeBadge$).startWith({}).fold((acc, action) => {
      if (action.name === 'add') {
        return acc.concat(action.value)
      }

      if (action.name === 'remove') {
        return acc.filter(value => {
          return value !== action.value
        })
      }

      return acc
    },storedList)
  }).flatten()

  const badgeList = BadgeList({dataSource$: badgeList$})

  const vtree$ = xs.combine(storedUrl$, badgeList.DOM, badgeForm.DOM).map(([storedUrl, badgeListDOM, badgeFormDOM]) => {
    return div([
      label('Url:'),
      input('.url', { props: { value: storedUrl } }),
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
