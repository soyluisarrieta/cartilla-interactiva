import phaserConfig from '../core/phaserConfig.js'
import BootScene from './src/scenes/BootScene.js'
import MenuScene from './src/scenes/MenuScene.js'
import HowToPlayScene from './src/scenes/HowToPlayScene.js'
import LevelSelectionScene from './src/scenes/LevelSelectionScene.js'
import InstructionsScene from './src/scenes/InstructionsScene.js'
import GameScene from './src/scenes/GameScene.js'

export default () => new Phaser.Game({
  ...phaserConfig,
  scene: [
    BootScene,
    MenuScene,
    HowToPlayScene,
    LevelSelectionScene,
    InstructionsScene,
    GameScene
  ]
})
