export default {
  // Figures
  semibreve: {
    name: 'semibreve',
    title: 'Redonda',
    duration: 4
  },
  minim: {
    name: 'minim',
    title: 'Blanca',
    duration: 2
  },
  crotchet: {
    name: 'crotchet',
    title: 'Negra',
    duration: 1
  },
  quaver: {
    name: 'quaver',
    title: 'Corchea',
    duration: 0.5
  },
  quaverDuo: {
    name: 'quaver-duo',
    title: 'Corchea Doble',
    duration: 1,
    beats: 2
  },
  quaverTriplet: {
    name: 'quaver-triplet',
    title: 'Tresillos de Corcheas',
    duration: 1,
    beats: 3
  },
  quaverQuad: {
    name: 'quaver-quad',
    title: 'Cuatro Corcheas',
    duration: 2,
    beats: 4
  },
  semiquaver: {
    name: 'semiquaver',
    title: 'Semicorchea',
    duration: 0.25
  },
  semiquaverQuad: {
    name: 'semiquaver-quad',
    title: 'Cuatro Semicorcheas',
    duration: 1,
    beats: 4
  },

  // Rest figures
  semibreveRest: {
    name: 'semibreve-rest',
    title: 'Silencio de Redonda',
    duration: 4
  },
  minimRest: {
    name: 'minim-rest',
    title: 'Silencio de Blanca',
    duration: 2
  },
  crotchetRest: {
    name: 'crotchet-rest',
    title: 'Silencio de Negra',
    duration: 1
  },
  quaverRest: {
    name: 'quaver-rest',
    title: 'Silencio de Corchea',
    duration: 0.5
  },
  semiquaverRest: {
    name: 'semiquaver-rest',
    title: 'Silencio de Semicorchea',
    duration: 0.25
  },

  // Combined figures
  quaverRest_quaver: {
    name: 'quaver-rest_quaver',
    title: 'Silencio de Corchea y Corchea',
    figures: [
      {
        name: 'quaver-rest',
        title: 'Silencio de corchea',
        duration: 0.5
      },
      {
        name: 'quaver',
        title: 'corchea',
        duration: 0.5
      }
    ]
  }
}
