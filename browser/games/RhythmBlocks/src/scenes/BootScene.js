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
          { key: 'metric2/4', path: '/metrics/metric-2x4.png' },
          { key: 'metric3/4', path: '/metrics/metric-3x4.png' },
          { key: 'bgGameScene', path: `../../assets/images/backgrounds/bg-mod-${module}.png` },
          { key: 'bannerGameScene', path: `../../assets/images/banners/banner-mod-${module}.png` }
        ],
        atlas: [
          { key: 'blocks', dir: '/ui', fileName: 'blocks' }
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
    const opening = new Opening(this)
    opening.start({ scene: SCENES.MENU })
  }
}
