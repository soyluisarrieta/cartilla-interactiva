interface StatType {
  id: string
  levelName: string
  score: number
  time: number
  timestamp: number | null
}

interface PlayerType {
  id: string
  userId: string
  serial: string
  username: string
  isOnline: boolean
  avatar: string
  stats: StatType[]
  order?: number
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
