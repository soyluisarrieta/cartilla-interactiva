import phaserConfig from '../phaserConfig.js'
import { BootScene, MenuScene, LevelSelectionScene } from '../../scenes/index.js'
import InstructionsScene from './InstructionsScene.js'
import GameScene from './GameScene.js'

export default () => new Phaser.Game({
  ...phaserConfig,
  scene: [
    BootScene,
    MenuScene,
    LevelSelectionScene,
    InstructionsScene,
    GameScene
  ]
})
