const list = [
  'brightgreen',
  'green',
  'yellowgreen',
  'yellow',
  'orange',
  'red',
  'lightgrey',
  'blue'
]

function getColors() {
  return list.slice()
}

function isValidColor(color) {
  if (list.indexOf(color) != -1) {
    return true
  }

  //TODO: Validate RRGGBB
  return false
}

export {
  getColors,
  isValidColor
}
