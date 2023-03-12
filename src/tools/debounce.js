export function debounce(fn, delay, immediate = false) {
  let timer = null

  return function () {
    if (timer) clearTimeout(timer)
    if (immediate) {
      const applyNow = !timer
      timer = setTimeout(() => {
        timer = null
      }, delay)
      if (applyNow) fn.apply(this, arguments)
    } else {
      timer = setTimeout(() => {
        fn.apply(this, arguments)
      }, delay)
    }
  }
}
