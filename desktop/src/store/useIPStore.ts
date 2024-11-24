import { create } from 'zustand'

interface ILocalIPStore {
  localIP: null | string
  setLocalIP: (ip: string) => void
}

export const useIPStore = create<ILocalIPStore>((set) => ({
  localIP: null,
  setLocalIP: (ip) => {
    set(() => ({ localIP: ip }))
  }
}))