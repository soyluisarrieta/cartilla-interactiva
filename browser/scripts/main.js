/* -- SELECCIÓN O CREACIÓN DE PERFILES -- */

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

// Mostrar u ocultar elemento con la clase hidden
function toggleClassName (e, className) {
  e.classList.toggle(className)
}

// Cargar perfiles desde el localStorage
function loadProfiles () {
  const profiles = JSON.parse(window.localStorage.getItem('profiles')) || []

  // Si no hay perfiles, ocultamos la sección de perfiles
  if (profiles.length === 0) {
    profilesContainer.style.display = 'none'
    return
  }

  profilesContainer.style.display = 'block'
  profileCardsContainer.innerHTML = ''

  // Generar los perfiles
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

  // Nombre de usuario vacío
  if (currentProfiles.some(profile => profile.username === username)) {
    alert('El nombre de usuario es requerido')
    return
  }

  // Nombre de usuario existente
  if (currentProfiles.some(profile => profile.username.toLowerCase() === username.toLowerCase())) {
    alert('El nombre de usuario ya existe')
    return
  }

  // Avatar sin seleccionar
  if (!avatar) {
    alert('Selecciona un avatar')
    return
  }

  const newProfile = {
    username,
    avatar: `${avatar}.png`,
    lastTime: new Date().toLocaleString()
  }

  currentProfiles.push(newProfile)
  window.localStorage.setItem('profiles', JSON.stringify(currentProfiles))
  loadProfiles()

  formNewProfile.reset()
  loadProfile(newProfile)
}

// Cargar el perfil seleccionado y actualizar la interfaz
function loadProfile (selectedProfile) {
  openContainerButton.title = selectedProfile.username
  openContainerButton.querySelector('img').src = `${FOLDER_AVATARS}/${selectedProfile.avatar}`
  openContainerButton.querySelector('span').innerText = selectedProfile.username

  // Añadir la clase de perfil seleccionado
  openContainerButton.classList.add('profile-selected')

  window.localStorage.setItem('selectedProfile', JSON.stringify(selectedProfile))
  toggleClassName(profileContainer, 'hidden')
}

// Inicializar el perfil seleccionado al cargar la página
function initializeSelectedProfile () {
  const selectedProfile = JSON.parse(window.localStorage.getItem('selectedProfile'))
  if (selectedProfile) {
    loadProfile(selectedProfile)
    toggleClassName(profileContainer, 'hidden')
  }
  openContainerButton.classList.remove('hidden')
}

// Asignar eventos a los botones
openContainerButton.addEventListener('click', () => toggleClassName(profileContainer, 'hidden'))
backdropButton.addEventListener('click', () => toggleClassName(profileContainer, 'hidden'))
formNewProfile.addEventListener('submit', (e) => saveProfile(e))

// Ejecutar funciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  loadProfiles()
  initializeSelectedProfile()
})
