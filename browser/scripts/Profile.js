import { uuidv4 } from '../games/utils/generateId.js'

function Profile () {
  const FOLDER_AVATARS = '/assets/images/avatars'

  const openContainerButton = document.querySelector('.open-container')
  const profileContainer = document.querySelector('.profile-container')
  const backdropButton = document.querySelector('.backdrop')
  const formNewProfile = document.querySelector('#form-new-profile')
  const profilesContainer = document.querySelector('.profiles-loaded')
  const profileCardsContainer = document.querySelector('.profile-cards')
  const usernameInput = document.querySelector('.username')
  const avatarInputs = document.querySelectorAll('input[name="avatar"]')
  const profileTemplate = document.querySelector('.profile-cards template')

  const errorState = {
    username: false,
    avatar: false
  }

  // Manejador de errores
  function errorMssg ({ message, hide = false, type = '' }) {
    const errMssg = document.querySelector('.error-message')

    if (hide) {
      errMssg.textContent = ''
      errMssg.style.display = 'none'
      errorState[type] = false
    } else {
      errMssg.textContent = `* ${message}`
      errMssg.style.display = 'block'
      errorState[type] = true
    }
  }

  // Mostrar u ocultar elemento con la clase hidden
  function toggleClassName (e, className) {
    e.classList.toggle(className)
  }

  // Cargar perfiles desde el localStorage
  function loadProfiles () {
    const profiles = JSON.parse(window.localStorage.getItem('profiles')) || []

    profilesContainer.style.display = profiles.length === 0 ? 'none' : 'block'
    if (profiles.length === 0) return

    profileCardsContainer.innerHTML = ''

    profiles.forEach(profile => {
      const profileNode = document.importNode(profileTemplate.content, true)
      const profileCard = profileNode.querySelector('.profile-card')
      profileCard.querySelector('img').src = `${FOLDER_AVATARS}/${profile.avatar}`
      profileCard.querySelector('.name').innerText = profile.username
      profileCard.querySelector('.last-time time').innerText = profile.lastTime

      profileCard.addEventListener('click', () => {
        const currentProfileActived = profileCardsContainer.querySelector('.profile-actived')
        currentProfileActived && toggleClassName(currentProfileActived, 'profile-actived')

        loadProfile(profile)
        window.location.reload()
      })
      profileCardsContainer.appendChild(profileNode)
    })
  }

  // Guardar un nuevo perfil en el localStorage
  function saveProfile (e) {
    e.preventDefault()

    const username = usernameInput.value
    const avatar = Array.from(avatarInputs).find(input => input.checked)?.value
    const currentProfiles = JSON.parse(window.localStorage.getItem('profiles')) || []

    if (!username || currentProfiles.some(profile => profile.username.toLowerCase() === username.toLowerCase())) {
      errorMssg({
        message: username
          ? 'Este nombre de usuario ya ha sido registrado.'
          : 'El campo de nombre de usuario no puede estar vacío.',
        type: 'username'
      })
      return
    }
    if (!avatar) {
      errorMssg({
        message: 'Seleccione una imagen de avatar para su perfil.',
        type: 'avatar'
      })
      return
    }

    const newProfile = {
      id: uuidv4(),
      username,
      avatar: `${avatar}.png`,
      lastTime: new Date().toLocaleString()
    }

    currentProfiles.push(newProfile)
    window.localStorage.setItem('profiles', JSON.stringify(currentProfiles))
    loadProfiles()
    formNewProfile.reset()
    loadProfile(newProfile)
    window.location.reload()
  }

  // Cargar el perfil seleccionado y actualizar la interfaz
  function loadProfile (profile) {
    openContainerButton.title = profile.username
    openContainerButton.querySelector('img').src = `${FOLDER_AVATARS}/${profile.avatar}`
    openContainerButton.querySelector('span').innerText = profile.username

    openContainerButton.classList.add('profile-selected')
    window.localStorage.setItem('profile', JSON.stringify(profile))
    toggleClassName(profileContainer, 'hidden')
  }

  // Inicializar el perfil seleccionado al cargar la página
  function initializeprofile () {
    const profile = JSON.parse(window.localStorage.getItem('profile'))
    if (profile) {
      loadProfile(profile)
      toggleClassName(profileContainer, 'hidden')
    }
    openContainerButton.classList.remove('hidden')
  }

  // Deshabilitar botones de jugar
  function disablePlayButtons () {
    document.querySelectorAll('.swiper-slide a.btn').forEach(playButton => {
      playButton.removeAttribute('href')
      playButton.style.pointerEvents = 'auto'
      playButton.style.opacity = '0.5'
    })
  }

  // Asignar eventos a los botones
  openContainerButton.addEventListener('click', () => toggleClassName(profileContainer, 'hidden'))
  backdropButton.addEventListener('click', () => toggleClassName(profileContainer, 'hidden'))
  formNewProfile.addEventListener('submit', saveProfile)

  // Limpiar errores específicos
  usernameInput.addEventListener('input', () => {
    if (errorState.username) {
      errorMssg({ hide: true, type: 'username' })
    }
  })

  avatarInputs.forEach(input => input.addEventListener('change', () => {
    if (errorState.avatar) {
      errorMssg({ hide: true, type: 'avatar' })
    }
  }))

  // Ejecutar funciones al cargar la página
  document.addEventListener('DOMContentLoaded', () => {
    loadProfiles()
    initializeprofile()

    !window.localStorage.getItem('profile') && disablePlayButtons()
  })
}

Profile()
