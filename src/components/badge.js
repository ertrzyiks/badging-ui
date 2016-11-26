import {img} from '@cycle/dom'
import xs from 'xstream'
import {isValidColor} from '../helpers/colors'

function sanitizeText(text) {
  return text.replace('-', '--').replace('_', '__').replace(' ', '_')
}

function sanitizeColor(color) {
  if (!isValidColor(color)) {
    return 'lightgrey'
  }

  return color
}

function Badge({props$}) {

  const vtree$ = props$
    .map(props => {
      const {subject, status, color} = props
      return {
        subject: sanitizeText(subject),
        status: sanitizeText(status),
        color: sanitizeColor(color),
      }
    })
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
