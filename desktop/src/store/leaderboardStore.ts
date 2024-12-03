import { create } from 'zustand'

interface LeaderboardStore {
  players: PlayerType[]
  setPlayers: (players: PlayerType[]) => void

  setGameSelector: (game: number) => void
  setLevelSelector: (level: number) => void
  setModeSelector: (mode: number) => void
  setScaleSelector: (scale: number) => void
  resetSelectors: () => void
  selectors: {
    game: number
    level: number
    mode: number
    scale: number
    reseted: boolean
  }
}

export const useLeaderboardStore = create<LeaderboardStore>((set) => ({
  players: [],
  setPlayers: (players) => set(() => ({ players })),

  selectors: { game: 0, level: 0, mode: 0, scale: 0, reseted: false  },
  setGameSelector: (game) => set(({selectors}) => ({ selectors: { ...selectors, game, reseted: false} })),
  setLevelSelector: (level) => set(({selectors}) => ({ selectors: { ...selectors, level, reseted: false} })),
  setModeSelector: (mode) => set(({selectors}) => ({ selectors: { ...selectors, mode, reseted: false} })),
  setScaleSelector: (scale) => set(({selectors}) => ({ selectors: { ...selectors, scale, reseted: false} })),
  resetSelectors: () => set(() => ({ selectors: { game: 0, level: 0, mode: 0, scale: 0, reseted: true }})),
}))