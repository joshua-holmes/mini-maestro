class Part {
  constructor() {
    this.scale = (() => {
      const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      const scale = [];
      for (let i = 0; i < (notes.length * 6); i++) {
        const note = notes[i % 7];
        const octave = Math.floor(i / 7)
        switch (octave) {
          case 0:
            scale.push(note + ",,,")
            break;
          case 1:
            scale.push(note + ",,")
            break;
          case 2:
            scale.push(note + ",")
            break;
          case 3:
            scale.push(note)
            break;
          case 4:
            scale.push(note.toLowerCase())
            break;
          case 5:
            scale.push(note.toLowerCase() + "'")
            break;
          default:
            console.warn("Only 6 octaves available in this program!")
            break;
        }
      }
      return scale;
    })()
  }
  analyzeHarmony(harArr) {
    const analysis = [];
  }
  noteNum(note) { return this.scale.indexOf(note) % 7};
  melodicallyLimit(melArr, harArr) {
    const scale = [...this.scale];
    const revMelArr = [...melArr].reverse();
    const indexOfLastNote = scale.indexOf(revMelArr[0]);
    let options = [...scale];
    if (melArr.length === 0) return options
    // const analysis = this.analyzeHarmony(harArr);
    const noteNum = note => scale.indexOf(note) % 7;
    
    // tritone runs
    const tritoneRunLimiter = () => {
      let newOptions = [...options];
      let lastNums = "";
      melArr.slice(-5).forEach(note => lastNums += noteNum(note));
      
      // If F-B desc, eliminate C, or if B-F desc, eliminate G
      if (lastNums.match(/32106/) || lastNums.match(/6543/)) {
        const noteToDelete = scale[indexOfLastNote + 1];
        newOptions = newOptions.filter(note => note !== noteToDelete);
      // If B-F asc, eliminate E, or if F-B asc, eliminate A
      }
      if (lastNums.match(/60123/) || lastNums.match(/3456/)) {
        const noteToDelete = scale[indexOfLastNote - 1];
        newOptions = newOptions.filter(note => note !== noteToDelete);
      }
      return newOptions
    }

    // tritone skips
    const tritoneSkipLimiter = () => {
      let newOptions = [...options];
      const lastNoteNum = noteNum(revMelArr[0]);
      // If last note was B, F cannot be selected next
      if (lastNoteNum === 6) {
        newOptions = newOptions.filter(note => noteNum(note) !== 3);
      }
      // If last note was F, B cannot be selected next
      if (lastNoteNum === 3) {
        newOptions = newOptions.filter(note => noteNum(note) !== 6);
      }
      return newOptions;
    }

    // large skips more than 6th, except octaves
    const largeSkipLimiter = () => {
      let newOptions = [...options];
      newOptions = newOptions.filter(note => {
        const indexOfNote = scale.indexOf(note)
        return ((indexOfNote >= indexOfLastNote - 5) && (indexOfNote <= indexOfLastNote + 5))
        || (indexOfNote === indexOfLastNote - 7) || (indexOfNote === indexOfLastNote + 7)
      })
      return newOptions;
    }

    // after skips go opposite direction, unless triadic
    const afterSkipLimiter = () => {
      let newOptions = [...options];
      const indexOfSecToLastNote = scale.indexOf(revMelArr[1]);
      console.log("HERE", indexOfLastNote, indexOfSecToLastNote);
      if (indexOfLastNote - indexOfSecToLastNote > 1) {
        newOptions = newOptions.filter(note => {
          return scale.indexOf(note) === indexOfLastNote ||
          scale.indexOf(note) === indexOfLastNote - 1
        })
      } else if (indexOfSecToLastNote - indexOfLastNote > 1) {
        newOptions = newOptions.filter(note => {
          return scale.indexOf(note) === indexOfLastNote ||
          scale.indexOf(note) === indexOfLastNote + 1
        })
      }
      return newOptions;
    }

    options = tritoneRunLimiter();
    options = tritoneSkipLimiter();
    options = largeSkipLimiter();
    options = afterSkipLimiter();
    
    return options;
  }
}

export default Part;