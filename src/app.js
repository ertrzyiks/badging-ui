import xs from 'xstream'
import {div, label, input, button, hr, h1} from '@cycle/dom'
import BadgeForm from './components/form'
import BadgeList from './components/list'

function intent({DOM}) {
  const url$ = DOM.select('.url').events('input').map(e => e.target.value)

  const removeBadge$ = DOM
    .select('.remove')
    .events('click')
    .map((e) => e.preventDefault() || e)
    .map((e) => e.target.getAttribute('data-badge'))
    .map(badge => ({name: 'remove', value: badge}))

  const click$ = DOM.select('.create').events('click').map(() => null)
  const type$ = DOM.select('.name').events('input').map(ev => ev.target.value)

  const addBadge$ = type$
    .map(text => click$.take(1).map(() => text))
    .flatten()
    .map(name => ({name: 'add', value: name}))

  return {
    url$,
    removeBadge$,
    addBadge$
  }
}

function model({storedBadgeList$, addBadge$, removeBadge$}) {
  const badges$ = storedBadgeList$.map(storedList => {
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

  return {
    badges$
  }
}

function view({storedUrl$, badgeList, badgeForm}) {
  return xs.combine(storedUrl$, badgeList.DOM, badgeForm.DOM).map(([storedUrl, badgeListDOM, badgeFormDOM]) => {
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
}

function app(sources) {
  const {storedUrl$, storedBadgeList$, DOM} = sources

  const {url$, addBadge$, removeBadge$} = intent({DOM})
  const badges$ = model({storedBadgeList$, addBadge$, removeBadge$}).badges$

  const badgeList = BadgeList({DOM, dataSource$: badges$, addBadge$: addBadge$})
  const badgeForm = BadgeForm({DOM})
  const vtree$ = view({storedUrl$, badgeList, badgeForm})

  const sinks = {
    DOM: vtree$,
    url$,
    badges$
  }

  return sinks
}

export default app
