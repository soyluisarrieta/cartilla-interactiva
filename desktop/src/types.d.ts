interface PlayerType {
  id: number
  name: string
  isOnline: boolean
  attempts: number
  avatarId: number
}

interface BestScoreType {
  playerId: number
  points: number
  seconds: number
  timestamp: number
}

interface GameType {
  name: string
  levels: string[]
  modes?: string[]
  scales?: string[]
}
