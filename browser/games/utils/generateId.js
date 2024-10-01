// Generador de uuid
export const uuidv4 = () => {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  )
}

// Generador de id de sesiones
export const getSessionId = () => {
  let sessionId = window.localStorage.getItem('sessionId')
  if (!sessionId) {
    sessionId = `session_${Math.random().toString(36).substr(2, 9)}`
    window.localStorage.setItem('sessionId', sessionId)
  }
  return sessionId
}
