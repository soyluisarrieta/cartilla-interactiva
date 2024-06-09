import { PORT } from '../../constants.js'
import { getLocalIpAddress } from '../../utils/getLocalIpAddress.js'

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.version[type])
  }

  replaceText('ip-local', `http://${getLocalIpAddress()}:${PORT}`)
})
