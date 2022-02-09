import Voice from "./voice.js";

class Alto extends Voice {
  constructor(scale, chordLibrary) {
    super(scale, chordLibrary)
    this.maxRange = "G";
    this.minRange = "C,";
  }
}

export default Alto;