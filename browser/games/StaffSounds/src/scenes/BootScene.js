import Assets from '../../../core/Assets.js'
import Opening from '../../../core/Opening.js'
import AssetLoader from '../../../core/utils/AssetLoader.js'
import { InitProfile } from '../../../../scripts/profile.js'
import { SCENES } from '../../../core/constants.js'
import { STEPS } from '../../assets/how-to-play/intructions.js'

export default class BootScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.BOOT })
  }

  preload () {
    const { game: gameName } = window.gameSettings
    InitProfile(window.gameSettings)

    const coreAssets = new Assets(window.gameSettings)
    coreAssets.setup(this)

    // Assets del juego
    const gameAssets = {
      setPath: `/games/${gameName}/assets`,
      assets: {
        images: [
          { key: 'titleKeyNotes', path: '/images/dictation-notes.png' }
        ],
        atlas: [
          { key: 'tone', dir: '../../assets/ui', fileName: 'tone' }
        ]
      }
    }

    const assetLoader = new AssetLoader(this)
    assetLoader.load([
      coreAssets.howToPlay(STEPS.length), // steps
      gameAssets
    ])
  }

  create () {
    const opening = new Opening(this)
    opening.start({ scene: SCENES.MENU })
  }
}
