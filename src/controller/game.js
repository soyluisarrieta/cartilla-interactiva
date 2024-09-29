export class GameController {
  constructor (game) {
    this.game = game
  }

  updateLevelData = (data) => {
    console.log(data, this.game)
  }
}
