import xs from 'xstream'
import {input} from '@cycle/dom'

function ControlledInput(sources) {
  const props$ = sources.props
  const assign$ = sources.assign

  const vtree$ = xs.combine(props$, assign$.startWith('')).map(([props, value]) => {
    return input({
      props: props,
      attrs: {value},
      hook: {update: (vnode) => { vnode.elm.value = value }}
    })
  })

  return {
    DOM: vtree$
  }
}

export default ControlledInput
