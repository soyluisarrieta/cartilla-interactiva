import { GameController } from '../controller/game.js'

export default function socketRoutes (socket, game) {
  const gameController = new GameController(game)

  socket.on('levelComplete', gameController.updateLevelData)
}
