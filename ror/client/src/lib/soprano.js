import Voice from "./voice.js";

class Soprano extends Voice {
  constructor(scale, chordLibrary) {
    super(scale, chordLibrary)
    this.maxRange = "g";
    this.minRange = "C";
    // Disables voicing limiter for soprano
    this.voicingLimiter = null;
    this.parallelHarmonyLimiter = null;
    this.similarMotionLimiter = null;
  }
  // Last note in soprano must be a C if second to last note is B
  noteLimiter(options, beats, activeBeat, melArr) {
    let newOptions = [...options];
    const lastNote = melArr[melArr.length - 1];
    if (activeBeat === beats - 1 && this.noteNum(lastNote) === 6) {
      newOptions = newOptions.filter(note => this.noteNum(note) === 0);
    }
    return newOptions;
  }
}

export default Soprano;