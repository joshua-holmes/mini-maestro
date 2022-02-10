import Voice from "./voice.js";

class Bass extends Voice {
  constructor(scale, chordLibrary) {
    super(scale, chordLibrary)
    this.maxRange = "C";
    this.minRange = "C,,";
    // Disabling this limiter
    this.afterSkipLimiter = null;
  }
  // Disallows dissonant harmonies between bass and soprano
  dissonantLimiter(options, harArr, activeBeat) {
    let newOptions = options;
    const indexOfNotes = harArr[activeBeat].map(note => this.scale.indexOf(note));
    const max = Math.max(...indexOfNotes);
    const topNoteAsNum = this.noteNum(this.scale[max])
    if (topNoteAsNum === 6 || topNoteAsNum === 3) {
      // If soprano is B (6), then F (3) is not allowed, and vice versa
      newOptions = newOptions.filter(note => (
        this.noteNum(note) !== topNoteAsNum * 2 % 9
      ))
    }
    newOptions = newOptions.filter(note => {
      const interval = topNoteAsNum - this.noteNum(note)
      // Does not allow inverted 2nds or 7ths, but does allow inverted 4ths
      return Math.abs(interval) !== 1 && interval !== 3 && Math.abs(interval) !== 6
    })
    return newOptions
  }
  // Last note in bass must be a C
  noteLimiter(options, beats, activeBeat) {
    let newOptions = [...options];
    
    if (activeBeat === beats - 1 || activeBeat === 0) {
      newOptions = newOptions.filter(note => this.noteNum(note) === 0);
    }
    return newOptions
  }
}

export default Bass;