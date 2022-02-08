class Part {
  constructor() {
    this.chordLibrary = [
      {symbol: "I", makeup: [0, 2, 4], next: ["I", "ii", "iii", "IV", "V", "vi", "viio"]},
      {symbol: "ii", makeup: [1, 3, 5], next: ["ii", "V", "viio"]},
      {symbol: "iii", makeup: [2, 4, 6], next: ["iii", "IV", "vi"]},
      {symbol: "IV", makeup: [3, 5, 0], next: ["I", "ii", "IV", "V", "viio"]},
      {symbol: "V", makeup: [4, 6, 1], next: ["I", "V", "vi", "viio"]},
      {symbol: "vi", makeup: [5, 0, 2], next: ["ii", "IV", "vi"]},
      {symbol: "viio", makeup: [6, 1, 3], next: ["I", "V", "viio"]},
    ];
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
  prevChords(chordSymbol) {
    const filteredLibrary = this.chordLibrary.filter(chord => (
      chord.next.indexOf(chordSymbol) >= 0
    ))
    return filteredLibrary.map(chord => chord.symbol)
  }
  nextChords(chordSymbol) {return (
    this.chordLibrary.find(chord => chord.symbol === chordSymbol).next
  )}
  findChordSymbols(notes) {
    const options = [];
    this.chordLibrary.forEach(chord => {
      const isMatch = notes.filter(n => (chord.makeup.indexOf(this.noteNum(n)) >= 0))
        .length === notes.length
      if (isMatch) {
        options.push(chord.symbol);
      }
    })
    return options;
  }
  analyzeHarmony(harArr, beats) {
    const analyze = direction => {
      let isForward;
      if (direction === "forward") isForward = true;
      else if (direction === "backward") isForward = false;
      else throw "'direction' parameter not valid. Fix in code."

      const analysis = [];
      for (let i = 0; i < beats; i++) {
        // 'index' stays true to the beat number, while 'i' does not
        const index = isForward ? i : beats - i - 1;
        if (index === beats - 1 || index === 0) {
          // Sets first and last chord
          analysis.push(["I"]);
        } else {
          const prev = analysis[i - 1];
          const fromPrev = prev.map(chord => (
            isForward ? this.nextChords(chord) : this.prevChords(chord)
          ));
          const uniqueChords = this.uniqueArray(fromPrev.flat());
          let finalChords = [...uniqueChords];
          if (harArr[index]) {
            const harArrChords = this.findChordSymbols(harArr[index]);
            finalChords = harArrChords.filter(chord => (
              uniqueChords.indexOf(chord) >= 0
            ))
          }
          analysis.push(finalChords);
        }
      }
      return isForward ? analysis : analysis.reverse();
    }
    const forwardAnalysis = analyze("forward");
    const backwardAnalysis = analyze("backward");
    const currentAnalysis = harArr.map(notes => this.findChordSymbols(notes));
    const finalAnalysis = forwardAnalysis.map((beat, i) => (
      beat.filter(option => {
        const foundInBackward = backwardAnalysis[i].indexOf(option) >= 0;
        const currentBeat = currentAnalysis[i]
        if (currentBeat) {
          const foundInCurrent = currentBeat.indexOf(option) >= 0
          return foundInCurrent && foundInBackward;
        } else {
          return foundInBackward;
        }
      })
    ))
    return finalAnalysis;
  }

  uniqueArray(array) {return [...new Set(array)]}
  
  noteNum(note) {return this.scale.indexOf(note) % 7};
  
  melodicallyLimit(melArr, harArr) {
    const scale = [...this.scale];
    const revMelArr = [...melArr].reverse();
    const indexOfLastNote = scale.indexOf(revMelArr[0]);
    let options = [...scale];
    if (melArr.length === 0) return options
    // const analysis = this.analyzeHarmony(harArr);
    const noteNum = note => scale.indexOf(note) % 7;

    // limits range to note specified in SATB classes, which extend from this
    const rangeLimiter = () => {
      const max = scale.indexOf(this.maxRange);
      const min = scale.indexOf(this.minRange);
      let newOptions = [...options];
      newOptions = newOptions.filter(note => {
        const index = scale.indexOf(note);
        return (index <= max) && (index >= min)
      })
      return newOptions;
    }
    
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

    options = rangeLimiter();
    options = tritoneRunLimiter();
    options = tritoneSkipLimiter();
    options = largeSkipLimiter();
    options = afterSkipLimiter();
    
    return options;
  }
}

export default Part;