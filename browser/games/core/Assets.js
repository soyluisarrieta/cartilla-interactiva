export default class Assets {
  constructor ({ gameid, gameName }) {
    this.setPath = '/games/assets'
    this.game = {
      id: gameid,
      name: gameName
    }
  }

  setup () {
    return {
      setPath: this.setPath,
      assets: {
        images: [
          { key: 'openingLogos', path: '/resources/opening-logos.png' },
          { key: 'decorativeFrame', path: '/resources/ui/decorative-frame.png' },
          { key: 'bannerTitle', path: '/resources/ui/banner-title.png' },
          { key: 'gameLogo', path: `/logos/${this.game.id}.png` },
          { key: 'health-on', path: '/resources/ui/health-on.png' },
          { key: 'health-off', path: '/resources/ui/health-off.png' }
        ],
        atlas: [
          { key: 'btnStart', dir: '/resources/ui', fileName: 'start-button' },
          { key: 'btnHowToPlay', dir: '/resources/ui', fileName: 'how-to-play-button' },
          { key: 'btnBack', dir: '/resources/ui', fileName: 'back-button' },
          { key: 'uiButtons', dir: '/resources/ui', fileName: 'ui-buttons' },
          { key: 'levels', dir: '/resources/ui', fileName: 'levels' },
          { key: 'exercise', dir: '/resources/ui', fileName: 'exercise-states' }
        ],
        audio: [
          { key: 'soundPress', path: '/audios/sound-press.mp3' },
          { key: 'levelComplete', path: '/audios/level-complete.mp3' },
          { key: 'gameOver', path: '/audios/game-over.mp3' },
          { key: 'timerTic', path: '/audios/timer-tic.mp3' },
          { key: 'perfectMelody', path: '/audios/perfect-melody.mp3' },
          { key: 'incorrectMelody', path: '/audios/incorrect-melody.mp3' },
          { key: 'noteSound', path: '/audios/note-sound.mp3' }
        ]
      }
    }
  }

  howToPlay (totalSteps) {
    return {
      setPath: `/games/${this.game.name}/assets/how-to-play`,
      assets: {
        images: Array.from({ length: totalSteps }, (_, i) => ({
          key: `step${i + 1}`,
          path: `/step${i + 1}.png`
        }))
      }
    }
  }
}