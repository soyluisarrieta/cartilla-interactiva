import { create } from 'zustand'

interface LeaderboardStore {
  players: PlayerType[]
  setPlayers: (players: PlayerType[]) => void
}

export const useLeaderboardStore = create<LeaderboardStore>((set) => ({
  players: [],
  setPlayers: (players) => set(() => ({ players }))
}))