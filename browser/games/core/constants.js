export const STANDARD_TEMPO = 1000

export const BUTTONS = {
  BACK: { key: 'btnBack', frame: 'back-btn' },
  ARROW_RIGHT: { key: 'uiButtons', frame: 'arrow-right' },
  ARROW_LEFT: { key: 'uiButtons', frame: 'arrow-left' },
  LISTEN_MELODY: { key: 'uiButtons', frame: 'listen-melody' },
  REPEAT: { key: 'uiButtons', frame: 'repeat' },
  PLAY: { key: 'uiButtons', frame: 'play' },
  HOME: { key: 'uiButtons', frame: 'home' },
  START_GAME: { key: 'btnStart', frame: 'start-btn' },
  HOW_TO_PLAY: { key: 'btnHowToPlay', frame: 'how-to-play-btn' }
}

export const ALERTS = {
  KEY: 'alerts',
  SUCCESS: {
    BG: 'bg-success',
    ICON: 'icon-success',
    BUTTON: 'btn-success'
  },
  COMPLETED: {
    BG: 'bg-completed',
    ICON: 'icon-completed',
    BUTTON: 'btn-completed'
  },
  FAILED: {
    BG: 'bg-failed',
    ICON: 'icon-failed',
    BUTTON: 'btn-failed'
  },
  GAMEOVER: {
    BG: 'bg-gameover',
    ICON: 'icon-gameover',
    BUTTON: 'btn-gameover'
  },
  WARN: {
    BG: 'bg-warn',
    ICON: 'icon-warn',
    BUTTON1: 'btn-warn-1',
    BUTTON2: 'btn-warn-2'
  }
}

export const HEALTH = {
  OFF: 'health-off',
  ON: 'health-on'
}

export const IMAGES = {
  BG_MENU: 'bgMenu',
  GAME_LOGO: 'gameLogo',
  DECORATIVE_FRAME: 'decorativeFrame'
}

export const FONTS = {
  PRIMARY: 'primaryFont',
  SECONDARY: 'primaryFont'
}

export const EXERCISE = {
  KEY: 'exercise',
  PLAYING: 'exercise-playing',
  PENDING: 'exercise-pending',
  COMPLETED: 'exercise-completed'
}

export const SCENES = {
  BOOT: 'BootScene',
  MENU: 'MenuScene',
  GAME: 'GameScene',
  LEVEL_SELECTION: 'LevelSelectionScene',
  HOW_TO_PLAY: 'HowToPlayScene',
  INSTRUCTIONS: 'InstructionsScene'
}
