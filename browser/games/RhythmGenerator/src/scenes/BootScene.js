import Assets from '../../../core/Assets.js'
import Opening from '../../../core/Opening.js'
import AssetLoader from '../../../core/utils/AssetLoader.js'
import { InitProfile } from '../../../../scripts/profile.js'
import { SCENES } from '../../../core/constants.js'

export default class BootScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.BOOT })
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
          { key: 'mannerBanner', path: '/ui/manner-banner.png' },
          { key: 'listBanner', path: '/ui/list-banner.png' },
          { key: 'bannerFigures1', path: '/ui/banner-figures-1.png' },
          { key: 'bannerFigures2', path: '/ui/banner-figures-2.png' }
        ],
        atlas: [
          { key: 'melodyControls', dir: '/ui', fileName: 'melody-controls' },
          { key: 'intervalIndicator', dir: '/ui', fileName: 'interval-indicator' }
        ]
      }
    }

    const assetLoader = new AssetLoader(this)
    assetLoader.load([
      coreAssets.howToPlay(9), // steps
      gameAssets
    ])
  }

  create () {
    const opening = new Opening(this)
    opening.start({ scene: SCENES.MENU })
  }
}
