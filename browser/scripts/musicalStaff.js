export const MUSICAL_STAFF = [

  // Clave de SOL
  {
    CLEF: 'TREBLE',
    NOTES: {
      RE5: { name: "Re''", position: 0, frequency: 440.00 },
      DO5: { name: "Do''", position: 1, frequency: 440.00 },
      SI4: { name: "Si'", position: 2, frequency: 440.00 },
      LA4: { name: "La'", position: 3, frequency: 440.00 },
      SOL4: { name: "Sol'", position: 4, frequency: 392.00 },
      FA4: { name: "Fa'", position: 5, frequency: 349.23 },
      MI4: { name: "Mi'", position: 6, frequency: 329.63 },
      RE4: { name: "Re'", position: 7, frequency: 293.66 },
      DO4: { name: "Do'", position: 8, frequency: 261.63 },
      SI3: { name: 'Si', position: 9, frequency: 246.94 },
      LA3: { name: 'La', position: 10, frequency: 220.00 },
      SOL3: { name: 'Sol', position: 11, frequency: 196.00 },
      FA3: { name: 'Fa', position: 12, frequency: 174.61 },
      MI3: { name: 'Mi', position: 13, frequency: 164.81 },
      RE3: { name: 'Re', position: 14, frequency: 146.83 },
      DO3: { name: 'Do', position: 15, frequency: 130.81 }
    }
  },

  // Clave de FA
  {
    CLEF: 'BASS',
    NOTES: {
      DO3: { name: 'Do', position: 0, frequency: 130.81 },
      SI2: { name: 'Si', position: 1, frequency: 123.47 },
      LA2: { name: 'La', position: 2, frequency: 110.00 },
      SOL2: { name: 'Sol', position: 3, frequency: 98.00 },
      FA2: { name: 'Fa', position: 4, frequency: 87.31 },
      MI2: { name: 'Mi', position: 5, frequency: 82.41 },
      RE2: { name: 'Re', position: 6, frequency: 73.42 },
      DO2: { name: 'Do', position: 7, frequency: 65.41 },
      SI1: { name: 'Si', position: 8, frequency: 61.74 },
      LA1: { name: 'La', position: 9, frequency: 55.00 },
      SOL1: { name: 'Sol', position: 10, frequency: 49.00 },
      FA1: { name: 'Fa', position: 11, frequency: 43.65 },
      MI1: { name: 'Mi', position: 12, frequency: 41.20 }
    }
  }
]

export const TREBLE_CLEF = MUSICAL_STAFF[0]
