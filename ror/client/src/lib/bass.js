import Part from "./part.js";

class Bass extends Part {
  constructor(scale, chordLibrary) {
    super(scale, chordLibrary)
    this.maxRange = "C";
    this.minRange = "F,,";
  }
}

export default Bass;