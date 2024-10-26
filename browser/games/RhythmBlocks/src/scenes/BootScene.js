import Assets from '../../../core/Assets.js'
import Opening from '../../../core/Opening.js'
import AssetLoader from '../../../assets/utils/AssetLoader.js'
import { InitProfile } from '../../../../scripts/Profile.js'

export default class BootScene extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    const { id: gameid, game: gameName } = window.gameSettings
    InitProfile(gameid, window.gameSettings)

    const coreAssets = new Assets(window.gameSettings)
    coreAssets.setup(this)

    // Assets del juego
    const gameAssets = {
      setPath: `/games/${gameName}/assets`,
      assets: {
        images: [
          // 🚩
        ]
      }
    }

    const assetLoader = new AssetLoader(this)
    assetLoader.load([
      gameAssets,
      coreAssets.howToPlay(8) // steps
    ])
  }

  create () {
    const opening = new Opening(this)
    opening.start({ scene: 'MenuScene' })
  }
}
