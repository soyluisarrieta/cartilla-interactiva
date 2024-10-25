import Assets from '../../../core/assets.js'
import Opening from '../../../core/Opening.js'
import AssetLoader from '../../../utils/AssetLoader.js'
import { InitProfile } from '../../../../scripts/Profile.js'

export default class BootScene extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    const { id: gameid, game: gameName } = window.gameSettings
    InitProfile(gameid, window.gameSettings)

    // Assets del juego
    const gameAssets = {
      setPath: `/games/${gameName}/assets`,
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
    const coreAssets = new Assets({ gameid, gameName })
    const setupAssets = coreAssets.setup()
    const howToPlayAssets = coreAssets.howToPlay(8)

    // Cargar los assets
    const assetLoader = new AssetLoader(this)
    assetLoader.load([
      setupAssets,
      howToPlayAssets,
      gameAssets
    ])

    // Cargar fuentes
    this.load.setPath('/games/assets/resources/fonts')
    this.load.bitmapFont('primaryFont', '/examplefont.png', '/examplefont.fnt')
  }

  create () {
    // Introducción de logos
    const opening = new Opening(this)
    opening.start({ scene: 'MenuScene' })
  }
}
