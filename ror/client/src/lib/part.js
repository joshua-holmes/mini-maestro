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
  melodicallyLimit(melody) {console.log(melody)}
}

export default Part;