import Part from "./part.js";

class Soprano extends Part {
  constructor(scale, chordLibrary) {
    super(scale, chordLibrary)
    this.maxRange = "g";
    this.minRange = "C";
    // Disables voicing limiter for soprano
    this.voicingLimiter = null;
  }
}

export default Soprano;