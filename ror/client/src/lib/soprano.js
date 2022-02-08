import Part from "./part.js";

class Soprano extends Part {
  constructor(scale, chordLibrary) {
    super(scale, chordLibrary)
    this.maxRange = "c'";
    this.minRange = "C";
  }

  
  
  harmonicallyLimit(harArr, beats, activeBeat) {
    const scale = [...this.scale];
    let options = [...scale];
    const analysis = this.analyzeHarmony(harArr, beats);
    
    // Must fall in harmony
    const harmonyLimiter = () => {
      let newOptions = [...options];
      newOptions = newOptions.filter(note => (
        !!analysis[activeBeat].find(chord => {
          const chordObj = this.chordLibrary.find(chordObj => chordObj.symbol === chord);
          return chordObj.makeup.indexOf(this.noteNum(note)) >= 0;
        })
      ))
      return newOptions;
    }

    

  // EXCLUSIVE
    // No passing other voices
    const voicingLimiter = () => {
      let newOptions = [...options];
      const harValues = harArr[activeBeat].map(note => scale.indexOf(note));
      const lowestNote = Math.min(...harValues);
      newOptions = newOptions.filter(note => scale.indexOf(note) < lowestNote)
      return newOptions;
    }
    // 
    // No tritone between bass and soprano
    // No fourths between bass and soprano
    // No seventh between bass and soprano
    // options = harmonyLimiter();
    options = voicingLimiter();
    return options;
  }
  
}

export default Soprano;