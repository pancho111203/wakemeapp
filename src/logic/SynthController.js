class SynthController {
  constructor(store, voiceNr = 29) {
    this.store = store;
    this.synth = window.speechSynthesis;

    this.synth.onvoiceschanged = () => {
      this.voice = this.synth.getVoices()[voiceNr]
    };
  }

  changeVoice = (voiceNr) => {
    this.voice = this.synth.getVoices()[voiceNr]
  }

  speak = (text) => {
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.voice = this.voice;
    this.synth.speak(utterThis);
  }
}

export default SynthController;
