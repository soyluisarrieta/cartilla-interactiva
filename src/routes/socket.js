import { GameController } from '../controller/game.js'

export default function socketRoutes (socket, { game, profile }) {
  const gameController = new GameController({ game, profile, socket })
  socket.on('levelCompleted', gameController.levelCompleted.bind(gameController))
}
