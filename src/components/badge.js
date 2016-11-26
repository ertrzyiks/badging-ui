import {img} from '@cycle/dom'
import xs from 'xstream'

function Badge({props$}) {

  const vtree$ = props$
    .map(props => {
      const {subject, status, color} = props
      return `https://img.shields.io/badge/${subject}-${status}-${color}.svg`
    })
    .map(src => {
      return img({
        props: {src: src}
      })
    })

  return { DOM: vtree$ }
}

export default Badge
