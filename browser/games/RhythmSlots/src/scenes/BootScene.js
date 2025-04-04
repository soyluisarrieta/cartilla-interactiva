import Assets from '../../../core/Assets.js'
import Opening from '../../../core/Opening.js'
import AssetLoader from '../../../core/utils/AssetLoader.js'
import { InitProfile } from '../../../../scripts/profile.js'

export default class BootScene extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    const { game: gameName, module } = window.gameSettings
    InitProfile(window.gameSettings)

    const coreAssets = new Assets(window.gameSettings)
    coreAssets.setup(this)

    // Assets del juego
    const gameAssets = {
      setPath: `/games/${gameName}/assets`,
      assets: {
        images: [
          { key: 'bgGameScene', path: `../../assets/images/backgrounds/bg-mod-${module}.png` },
          { key: 'bannerGameScene', path: `../../assets/images/banners/banner-mod-${module}.png` },
          { key: 'slot', path: '/images/slot.png' },
          { key: 'semibreve', path: '/images/btn-semibreve.png' },
          { key: 'semibreve-rest', path: '/images/btn-semibreve-rest.png' },
          { key: 'minim', path: '/images/btn-minim.png' },
          { key: 'minim-rest', path: '/images/btn-minim-rest.png' },
          { key: 'crotchet', path: '/images/btn-crotchet.png' },
          { key: 'crotchet-rest', path: '/images/btn-crotchet-rest.png' },
          { key: 'quaver', path: '/images/btn-quaver.png' },
          { key: 'quaver-duo', path: '/images/btn-quaver-duo.png' },
          { key: 'quaver-rest_quaver', path: '/images/btn-quaver-rest_quaver.png' },
          { key: 'semiquaver-quad', path: '/images/btn-semiquaver-quad.png' },
          { key: 'itemBanner1', path: '../../assets/ui/item-banner-1.png' },
          { key: 'itemBanner2', path: '../../assets/ui/item-banner-2.png' },
          { key: 'itemBanner3', path: '../../assets/ui/item-banner-3.png' }
        ],
        atlas: [
          { key: 'btnFigures', dir: '/ui', fileName: 'figure-buttons' },
          { key: 'pieces', dir: '/ui', fileName: 'pieces' },
          { key: 'intervalIndicator', dir: '/ui', fileName: 'interval-indicator' }
        ]
      }
    }

    const assetLoader = new AssetLoader(this)
    assetLoader.load([
      coreAssets.howToPlay(8), // steps
      gameAssets
    ])
  }

  create () {
    // Introducción de logos
    const opening = new Opening(this)
    opening.start({ scene: 'MenuScene' })
  }
}
