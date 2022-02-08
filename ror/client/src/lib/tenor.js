import Part from "./part.js";

class Alto extends Part {
  constructor(scale, chordLibrary) {
    super(scale, chordLibrary)
    this.maxRange = "G";
    this.minRange = "C,";
  }
}

export default Alto;