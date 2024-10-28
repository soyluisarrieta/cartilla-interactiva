import AssetLoader from './utils/AssetLoader.js'

export default class Assets {
  static path = '/games/assets'

  constructor ({ id, game, module }) {
    this.game = {
      id,
      module,
      name: game,
      number: id?.charAt(1)
    }
  }

  setup (phaser) {
    const assetLoader = new AssetLoader(phaser)
    this.fonts(phaser)
    assetLoader.load([
      this.main()
    ])
  }

  main () {
    return {
      setPath: Assets.path,
      assets: {
        images: [
          { key: 'gameLogo', path: `/images/logos/game-${this.game.number}.png` },
          { key: 'bgMenu', path: `/images/backgrounds/mod${this.game.module}-menu.jpg` },
          { key: 'openingLogos', path: '/images/logos/opening-logos.png' },
          { key: 'decorativeFrame', path: '/ui/decorative-frame.png' },
          { key: 'bannerTitle', path: '/ui/banner-title.png' },
          { key: 'health-on', path: '/ui/health-on.png' },
          { key: 'health-off', path: '/ui/health-off.png' }
        ],
        atlas: [
          { key: 'btnStart', dir: '/ui', fileName: 'start-button' },
          { key: 'btnHowToPlay', dir: '/ui', fileName: 'how-to-play-button' },
          { key: 'btnBack', dir: '/ui', fileName: 'back-button' },
          { key: 'uiButtons', dir: '/ui', fileName: 'ui-buttons' },
          { key: 'levels', dir: '/ui', fileName: 'levels' },
          { key: 'exercise', dir: '/ui', fileName: 'exercise-states' },
          { key: 'figures', dir: '/ui', fileName: 'figures' }
        ],
        audio: [
          { key: 'soundPress', path: '/audios/sound-press.mp3' },
          { key: 'levelComplete', path: '/audios/level-complete.mp3' },
          { key: 'gameOver', path: '/audios/game-over.mp3' },
          { key: 'timerTic', path: '/audios/timer-tic.mp3' },
          { key: 'perfectMelody', path: '/audios/perfect-melody.mp3' },
          { key: 'incorrectMelody', path: '/audios/incorrect-melody.mp3' },
          { key: 'noteSound', path: '/audios/note-sound.mp3' },
          { key: 'startGame', path: '/audios/start-game.mp3' }
        ]
      }
    }
  }

  fonts (phaser) {
    phaser.load.setPath('/games/assets/fonts')
    phaser.load.bitmapFont('primaryFont', '/examplefont.png', '/examplefont.fnt')
  }

  howToPlay (totalSteps) {
    return {
      setPath: `/games/${this.game.name}/assets/how-to-play`,
      assets: {
        images: Array.from({ length: totalSteps }, (_, i) => ({
          key: `step${i + 1}`,
          path: `/step${i + 1}.png`
        }))
      }
    }
  }

  figures (figures) {
    return {
      setPath: Assets.path,
      assets: {
        images: figures.map((figure) => ({
          key: figure, path: `/figures/${figure}.png`
        }))
      }
    }
  }
}
