import { shell } from 'electron'
import { PORT } from '../../constants.js'
import { getLocalIpAddress } from '../../utils/getLocalIpAddress.js'

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.querySelector(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`#${type}-version`, process.version[type])
  }

  // Añadimos el evento click para abrir el enlace en el navegador
  const ipLinkElement = document.getElementById('ip-local')
  if (ipLinkElement) {
    ipLinkElement.addEventListener('click', () => {
      shell.openExternal(`http://${getLocalIpAddress()}:${PORT}`)
    })
  }
})
