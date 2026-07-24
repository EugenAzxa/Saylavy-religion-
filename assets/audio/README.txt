Recorded voice clips (the best sounding and completely free at runtime).
Map them in assets/js/voice-clips.js, for example:

window.VOICE_CLIPS = {
  "Mother Teresa::Not all of us can do great things...": "assets/audio/teresa-01.mp3",
  "Some exact spoken line": "assets/audio/line.mp3"
};

Keys are either "PersonName::exact text" or just the exact text.
Any line without a clip falls back to the voice API, then to the browser voice.
