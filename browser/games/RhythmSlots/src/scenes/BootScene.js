import { getProfile, setProfile } from '../../../../scripts/Profile.js'
import Assets from '../../../core/assets.js'
import AssetLoader from '../../../utils/AssetLoader.js'

export default class BootScene extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    const { id, game } = window.gameSettings
    const profile = getProfile()

    if (!profile.games[id]) {
      profile.games[id] = window.gameSettings
      setProfile(profile)
    }

    // Assets del juego
    const rhythmSlotsAssets = {
      setPath: `/games/${game}/assets`,
      assets: {
        images: [
          { key: 'background', path: '/images/bg-menu.jpg' },
          { key: 'slot', path: '/images/slot.png' },
          { key: 'semibreve', path: '/images/btn-semibreve.png' },
          { key: 'semibreve-rest', path: '/images/btn-semibreve-rest.png' },
          { key: 'minim', path: '/images/btn-minim.png' },
          { key: 'minim-rest', path: '/images/btn-minim-rest.png' },
          { key: 'crotchet', path: '/images/btn-crotchet.png' },
          { key: 'crotchet-rest', path: '/images/btn-crotchet-rest.png' }
        ]
      }
    }

    // Assets globales
    const coreAssets = new Assets({ gameid: id, gameName: game })
    const setupAssets = coreAssets.setup()
    const howToPlayAssets = coreAssets.howToPlay(8)

    // Cargar los assets
    const assetLoader = new AssetLoader(this)
    assetLoader.load([
      setupAssets,
      howToPlayAssets,
      rhythmSlotsAssets
    ])

    // Cargar fuentes
    this.load.setPath('/games/assets/resources/fonts')
    this.load.bitmapFont('primaryFont', '/examplefont.png', '/examplefont.fnt')
  }

  // Mostrar los logos con la animación de fade-in y fade-out
  create () {
    const { centerX, centerY } = this.cameras.main
    const logo = this.add.image(centerX, centerY, 'openingLogos')

    this.tweens.add({
      targets: logo,
      alpha: { from: 0, to: 1 },
      scale: { from: 0.9, to: 1 },
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        this.time.delayedCall(1500, () => {
          this.fadeOutLogo(logo)
        })
      }
    })
  }

  // Animación de fade-out de los logo
  fadeOutLogo (logo) {
    this.tweens.add({
      targets: logo,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        this.scene.start('MenuScene')
      }
    })
  }
}
