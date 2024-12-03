interface StatType {
  id: string
  levelName: string
  score: number
  time: number
  mode?: string
  scale?: string
  notes?: string
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
}
