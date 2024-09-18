export function fullscreen (button, element) {
  button.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(err => {
        console.error(`Error trying to enable full-screen mode: ${err.message} (${err.name})`)
      })
    } else {
      document.exitFullscreen().catch(err => {
        console.error(`Error trying to exit full-screen mode: ${err.message} (${err.name})`)
      })
    }
  })
}
