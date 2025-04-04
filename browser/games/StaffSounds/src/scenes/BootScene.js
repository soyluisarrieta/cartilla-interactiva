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
    const { game: gameName, module } = window.gameSettings
    InitProfile(window.gameSettings)

    const coreAssets = new Assets(window.gameSettings)
    coreAssets.setup(this)

    // Assets del juego
    const gameAssets = {
      setPath: `/games/${gameName}/assets`,
      assets: {
        images: [
          { key: 'musicalStaff', path: '/images/musical-staff.png' },
          { key: 'titleKeyNotes', path: '/images/dictation-notes.png' },
          { key: 'bgGameScene', path: `../../assets/images/backgrounds/bg-mod-${module}.png` },
          { key: 'bannerGameScene', path: `../../assets/images/banners/banner-mod-${module}.png` },
          { key: 'itemBanner2', path: '../../assets/ui/item-banner-2.png' },
          { key: 'itemBanner3', path: '../../assets/ui/item-banner-3.png' },
          { key: 'bannerNotes', path: '/images/banner-notes.png' },
          { key: 'noteButton', path: '/ui/note-button.png' }
        ],
        atlas: [
          { key: 'tone', dir: '../../assets/ui', fileName: 'tone' },
          { key: 'modes', dir: '/ui', fileName: 'modes' }
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
