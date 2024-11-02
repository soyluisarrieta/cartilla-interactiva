export default {
  // Figures
  semibreve: {
    name: 'semibreve',
    duration: 4
  },
  minim: {
    name: 'minim',
    duration: 2
  },
  crotchet: {
    name: 'crotchet',
    duration: 1
  },
  quaver: {
    name: 'quaver',
    duration: 0.5
  },
  quaverDuo: {
    name: 'quaver-duo',
    duration: 1,
    beats: 2
  },
  semiquaver: {
    name: 'semiquaver',
    duration: 0.25
  },
  semiquaverQuad: {
    name: 'semiquaver-quad',
    duration: 1,
    beats: 4
  },

  // Rest figures
  semibreveRest: {
    name: 'semibreve-rest',
    duration: 4
  },
  minimRest: {
    name: 'minim-rest',
    duration: 2
  },
  crotchetRest: {
    name: 'crotchet-rest',
    duration: 1
  },
  quaverRest: {
    name: 'quaver-rest',
    duration: 0.5
  },
  semiquaverRest: {
    name: 'semiquaver-rest',
    duration: 0.25
  },

  // Combined figures
  quaverRest_quaver: {
    name: 'quaver-rest_quaver',
    figures: [
      {
        name: 'quaver-rest',
        duration: 0.5
      },
      {
        name: 'quaver',
        duration: 0.5
      }
    ]
  }
}
