import {run} from '@cycle/xstream-run'
import {makeDOMDriver} from '@cycle/dom'
import storageDriver from '@cycle/storage'
import xs from 'xstream'

import app from './app'

function main(sources) {
  const storedUrl$ = sources.storage.local
    .getItem('url')
    .map(value => value || '')

  const storedBadgeList$ = sources.storage.local
    .getItem('badges')
    .take(1)
    .map(value => value || '[]')
    .map(value => JSON.parse(value))

  const appSinks = app({
    DOM: sources.DOM,
    storedUrl$,
    storedBadgeList$
  })

  const storageUrlRequests$ = appSinks.url$.map(url => ({
    key: 'url',
    value: url
  }))

  const storageBadgeListRequests$ = appSinks.badges$.map(list => ({
    key: 'badges',
    value: JSON.stringify(list)
  }))

  const storageRequests$ = xs.merge(storageUrlRequests$, storageBadgeListRequests$)

  const sinks = {
    DOM: appSinks.DOM,
    storage: storageRequests$
  }

  return sinks
}

const drivers = {
  DOM: makeDOMDriver('#root'),
  storage: storageDriver
}

run(main, drivers)
