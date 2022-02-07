import Part from "./part";

class Soprano extends Part {
  constructor(scale) {
    super(scale)
  }
  
  harmonicallyLimit(harArr) {
    const scale = [...this.scale];
    const analysis = this.analyzeHarmony(harArr);
  // ALL  
    // No unison
    // Must fall in harmony

  // EXCLUSIVE
    // No passing other voices
    // No exceeding range
    // 
    // No tritone between bass and soprano
    // No fourths between bass and soprano
    // No seventh between bass and soprano
  }
}

export default Soprano;