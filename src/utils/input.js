export function checkLength (len, ele) {
  var fieldLength = ele.value.length
  if (fieldLength <= len) {
    return true
  } else {
    var str = ele.value
    str = str.substring(0, str.length - 1)
    ele.value = str
  }
}

export function check (e, value) {
  var unicode = e.charCode ? e.charCode : e.keyCode
  if (value.indexOf('.') !== -1) if (unicode === 46) return false
  if (unicode !== 8) { if ((unicode < 48 || unicode > 57) && unicode !== 46) return false }
}
