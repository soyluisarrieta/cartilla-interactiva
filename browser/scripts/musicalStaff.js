export const MUSICAL_STAFF = [

  // Clave de SOL
  {
    CLEF: 'TREBLE',
    NOTES: {
      RE5: { name: "Re''", position: 0, frequency: 587.33 },
      RE5s: { name: "Re#''", position: 0, frequency: 622.25 },
      RE5b: { name: "Reb''", position: 0, frequency: 554.37 },

      DO5: { name: "Do''", position: 1, frequency: 523.25 },
      DO5s: { name: "Do#''", position: 1, frequency: 554.37 },
      DO5b: { name: "Dob''", position: 1, frequency: 493.88 },

      SI4: { name: "Si'", position: 2, frequency: 493.88 },
      SI4s: { name: "Si#'", position: 2, frequency: 523.25 },
      SI4b: { name: "Sib'", position: 2, frequency: 466.16 },

      LA4: { name: "La'", position: 3, frequency: 440.00 },
      LA4s: { name: "La#'", position: 3, frequency: 466.16 },
      LAb4: { name: "Lab'", position: 3, frequency: 415.30 },

      SOL4: { name: "Sol'", position: 4, frequency: 392.00 },
      SOL4s: { name: "Sol#'", position: 4, frequency: 415.30 },
      SOL4b: { name: "Solb'", position: 4, frequency: 369.99 },

      FA4: { name: "Fa'", position: 5, frequency: 349.23 },
      FA4s: { name: "Fa#'", position: 5, frequency: 369.99 },
      FA4b: { name: "Fab'", position: 5, frequency: 329.63 },

      MI4: { name: "Mi'", position: 6, frequency: 329.63 },
      MI4s: { name: "Mi#'", position: 6, frequency: 349.23 },
      MI4b: { name: "Mib'", position: 6, frequency: 311.13 },

      RE4: { name: "Re'", position: 7, frequency: 293.66 },
      RE4s: { name: "Re#'", position: 7, frequency: 311.13 },
      RE4b: { name: "Reb'", position: 7, frequency: 277.18 },

      DO4: { name: "Do'", position: 8, frequency: 261.63 },
      DO4s: { name: "Do#'", position: 8, frequency: 277.18 },
      DO4b: { name: "Dob'", position: 8, frequency: 246.94 },

      SI3: { name: 'Si', position: 9, frequency: 246.94 },
      SI3s: { name: 'Si#', position: 9, frequency: 261.63 },
      SI3b: { name: 'Sib', position: 9, frequency: 233.08 },

      LA3: { name: 'La', position: 10, frequency: 220.00 },
      LA3s: { name: 'La#', position: 10, frequency: 233.08 },
      LA3b: { name: 'Lab', position: 10, frequency: 207.65 },

      SOL3: { name: 'Sol', position: 11, frequency: 196.00 },
      SOL3s: { name: 'Sol#', position: 11, frequency: 207.65 },
      SOL3b: { name: 'Solb', position: 11, frequency: 185.00 },

      FA3: { name: 'Fa', position: 12, frequency: 174.61 },
      FA3s: { name: 'Fa#', position: 12, frequency: 185.00 },
      FA3b: { name: 'Fab', position: 12, frequency: 164.81 },

      MI3: { name: 'Mi', position: 13, frequency: 164.81 },
      MI3s: { name: 'Mi#', position: 13, frequency: 174.61 },
      MI3b: { name: 'Mib', position: 13, frequency: 155.56 },

      RE3: { name: 'Re', position: 14, frequency: 146.83 },
      RE3s: { name: 'Re#', position: 14, frequency: 155.56 },
      RE3b: { name: 'Reb', position: 14, frequency: 138.59 },

      DO3: { name: 'Do', position: 15, frequency: 130.81 },
      DO3s: { name: 'Do#', position: 15, frequency: 138.59 },
      DO3b: { name: 'Dob', position: 15, frequency: 123.47 }
    }
  }
]

export const TREBLE_CLEF = MUSICAL_STAFF[0]
