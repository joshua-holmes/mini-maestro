import Voice from "./voice.js";

class Alto extends Voice {
  constructor(scale, chordLibrary) {
    super(scale, chordLibrary)
    this.maxRange = "c";
    this.minRange = "G,";
  }
}

export default Alto;