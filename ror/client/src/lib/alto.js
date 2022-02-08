import Part from "./part.js";

class Alto extends Part {
  constructor(scale, chordLibrary) {
    super(scale, chordLibrary)
    this.maxRange = "c";
    this.minRange = "G,";
  }
}

export default Alto;