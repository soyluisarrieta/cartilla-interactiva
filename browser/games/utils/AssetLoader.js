export default class AssetLoader {
  constructor (scene) {
    this.phaser = scene
  }

  load (assets) {
    assets.forEach(({ setPath: path, assets }) => {
      path && this.phaser.load.setPath(path)

      assets?.images?.forEach(({ key, path }) => {
        this.phaser.load.image(key, path)
      })

      assets?.atlas?.forEach(({ key, dir, fileName }) => {
        this.phaser.load.atlas(key, `${dir}/${fileName}.png`, `${dir}/${fileName}.json`)
      })

      assets?.spritesheets?.forEach(({ key, path, frame: { width, height } }) => {
        this.phaser.load.spritesheet(key, path, {
          frameWidth: width,
          frameHeight: height
        })
      })

      assets?.audio?.forEach(({ key, path }) => {
        this.phaser.load.audio(key, path)
      })
    })
  }
}
