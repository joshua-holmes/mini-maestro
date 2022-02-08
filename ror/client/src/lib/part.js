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
  
  //// MAIN LIMITERS
  melodicallyLimit(melArr) {
    let options = [...this.scale];
    if (melArr.length === 0) return options
    options = this.rangeLimiter(options);
    options = this.tritoneRunLimiter(options, melArr);
    options = this.tritoneSkipLimiter(options, melArr);
    options = this.largeSkipLimiter(options, melArr);
    options = this.afterSkipLimiter(options, melArr);
    return options;
  }
  harmonicallyLimit(harArr, beats, activeBeat) {
    let options = [...this.scale];
    options = this.harmonyLimiter(options, harArr, activeBeat, beats);
    // Voicing limiter is optional
    this.voicingLimiter && (options = this.voicingLimiter(options, harArr, activeBeat));
    return options;
  }

  //// SUB-LIMITERS USED IN MAIN LIMITERS
  // MELODIC SUB-LIMITERS
  // limits range to note specified in SATB classes, which extend from this
  rangeLimiter(options) {
    const max = this.scale.indexOf(this.maxRange);
    const min = this.scale.indexOf(this.minRange);
    let newOptions = [...options];
    newOptions = newOptions.filter(note => {
      const index = this.scale.indexOf(note);
      return (index <= max) && (index >= min)
    })
    return newOptions;
  }
  // Forbid tritone runs
  tritoneRunLimiter(options, melArr) {
    const indexOfLastNote = this.scale.indexOf(melArr[melArr.length - 1]);
    let newOptions = [...options];
    let lastNums = "";
    melArr.slice(-5).forEach(note => lastNums += this.noteNum(note));
    // If F-B desc, eliminate C, or if B-F desc, eliminate G
    if (lastNums.match(/32106/) || lastNums.match(/6543/)) {
      const noteToDelete = this.scale[indexOfLastNote + 1];
      newOptions = newOptions.filter(note => note !== noteToDelete);
    // If B-F asc, eliminate E, or if F-B asc, eliminate A
    }
    if (lastNums.match(/60123/) || lastNums.match(/3456/)) {
      const noteToDelete = this.scale[indexOfLastNote - 1];
      newOptions = newOptions.filter(note => note !== noteToDelete);
    }
    return newOptions
  }
  // Forbid tritone skips
  tritoneSkipLimiter(options, melArr) {
    let newOptions = [...options];
    const lastNoteNum = this.noteNum(melArr[melArr.length - 1]);
    // If last note was B, F cannot be selected next
    if (lastNoteNum === 6) {
      newOptions = newOptions.filter(note => this.noteNum(note) !== 3);
    }
    // If last note was F, B cannot be selected next
    if (lastNoteNum === 3) {
      newOptions = newOptions.filter(note => this.noteNum(note) !== 6);
    }
    return newOptions;
  }
  // Forbid large skips more than 6th, except octaves
  largeSkipLimiter(options, melArr) {
    let newOptions = [...options];
    const indexOfLastNote = this.scale.indexOf(melArr[melArr.length - 1]);
    newOptions = newOptions.filter(note => {
      const indexOfNote = this.scale.indexOf(note)
      return ((indexOfNote >= indexOfLastNote - 5) && (indexOfNote <= indexOfLastNote + 5))
      || (indexOfNote === indexOfLastNote - 7) || (indexOfNote === indexOfLastNote + 7)
    })
    return newOptions;
  }
  // After skips go opposite direction, unless triadic
  afterSkipLimiter(options, melArr) {
    let newOptions = [...options];
    const indexOfLastNote = this.scale.indexOf(melArr[melArr.length - 1]);
    const indexOfSecToLastNote = this.scale.indexOf(melArr[melArr.length - 2]);
    if (indexOfLastNote - indexOfSecToLastNote > 1) {
      newOptions = newOptions.filter(note => {
        return this.scale.indexOf(note) === indexOfLastNote ||
        this.scale.indexOf(note) === indexOfLastNote - 1
      })
    } else if (indexOfSecToLastNote - indexOfLastNote > 1) {
      newOptions = newOptions.filter(note => {
        return this.scale.indexOf(note) === indexOfLastNote ||
        this.scale.indexOf(note) === indexOfLastNote + 1
      })
    }
    return newOptions;
  }
  // HARMONIC SUB-LIMITERS
  // No passing other voices
  voicingLimiter(options, harArr, activeBeat) {
    let newOptions = [...options];
    const harValues = harArr[activeBeat].map(note => this.scale.indexOf(note));
    const lowestNote = Math.min(...harValues);
    newOptions = newOptions.filter(note => this.scale.indexOf(note) < lowestNote)
    return newOptions;
  }
  // Must fall in harmony
  harmonyLimiter(options, harArr, activeBeat, beats) {
    let newOptions = [...options];
    const analysis = this.analyzeHarmony(harArr, beats);
    newOptions = newOptions.filter(note => (
      !!analysis[activeBeat].find(chord => {
        const chordObj = this.chordLibrary.find(chordObj => chordObj.symbol === chord);
        return chordObj.makeup.indexOf(this.noteNum(note)) >= 0;
      })
    ))
    return newOptions;
  }

  //// HELPER FUNCTIONS
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
}

export default Part;