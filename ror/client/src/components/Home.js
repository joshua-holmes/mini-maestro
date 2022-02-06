import { useEffect, useState } from 'react';
import Button from './Button';
import SheetMusic from './SheetMusic';
import AudioButton from "./AudioButton";
import Soprano from "../lib/soprano";
import styled from 'styled-components';

const ButtonContainer = styled.div`
position: absolute;
bottom: 0%;
`

function Home() {
  const [abc, setAbc] = useState({
    trebleClef: [],
    bassClef: [],
  });
  const [abcOptions, setAbcOptions] = useState(["g", "e", "c", "G", "C"]);
  const [visualObj, setVisualObj] = useState();
  const [activeAbc, setActiveAbc] = useState(abcOptions[0]);
  const [timerId, setTimerId] = useState(null);

  const measures = 4;
  const bpm = 4; // Beats per measure
  const beats = measures * bpm;

  useEffect(() => {
    let count = 0;
    const iterate = () => {
      count += 1
      const index = count % abcOptions.length;
      setActiveAbc(() => abcOptions[index])
    }
    const id = setInterval(iterate, 1000)
    const cleanup = () => { clearInterval(id); }
    setTimerId(() => (id));
    return cleanup;
  }, [abcOptions])
  const setNextNote = newNote => {
    const countNotes = string => {
      if (!string) return 0;
      let count = 0;
      for (let i of string) {
        const code = i.charCodeAt()
        if ((code >= 65 && code <= 71) || (code >= 97 && code <= 103)) count++;
      }
      return count;
    }
    const joinNotes = (note, abcArray) => {
      const abcCopy = [...abcArray];
      const joinIndex = abcCopy.findIndex(notes => countNotes(notes) < 2);
      abcCopy[joinIndex] = `[${abcCopy[joinIndex]}${note}]`
      return abcCopy;
    }
    const soprano = abc.trebleClef.length < beats;
    const alto = !soprano && countNotes(abc.trebleClef.slice(-1)[0]) < 2;
    const tenor = !alto && countNotes(abc.trebleClef.slice(-1)[0]) >= 2 && countNotes(abc.bassClef.slice(-1)[0]) === 0;
    const bass = abc.bassClef.length >= beats && abc.bassClef.slice(-1)[0].search(/\[/) === -1;

    switch (true) {
      case soprano:
        return {
          ...abc,
          trebleClef: [...abc.trebleClef, newNote],
        }
      case alto:
        return {
          ...abc,
          trebleClef: joinNotes(newNote, abc.trebleClef),
        }
      case tenor:
        const primeBass = numOfBeats => {
          const rests = [];
          for (let i = 0; i < numOfBeats; ++i) {
            rests.push("z");
          }
          return rests;
        }

        let abcCopy = [...abc.bassClef];
        if (abc.bassClef.length === 0) abcCopy = primeBass(beats)
        const index = abcCopy.indexOf("z");
        abcCopy[index] = newNote;
        return {
          ...abc,
          bassClef: abcCopy,
        }
      case bass:
        return {
          ...abc,
          bassClef: joinNotes(newNote, abc.bassClef),
        }
      default:
        clearInterval(timerId);
        console.log("Song is full, stopping timer");
    }
  }

  const abcStringify = abcArray => {
    let abcString = "";
    abcArray.forEach((note, index) => {
      if (index % bpm === 0 && index !== 0) abcString += " |"
      abcString += ` ${note}`
    })
    return abcString;
  }

  const addNote = e => {
    const newAbc = setNextNote(e.target.value)
    if (newAbc) setAbc(newAbc)
  }

  const activeNotes = setNextNote(activeAbc);
  
  return (
    <>
      {/* For playing music */}
      <SheetMusic
        title="title"
        meter={`${bpm}/4`}
        trebleClef={abcStringify(abc.trebleClef)}
        bassClef={abcStringify(abc.bassClef)}
        setVisualObj={setVisualObj}
      />
      {/* For displaying music */}
      <SheetMusic
        title="title"
        meter={`${bpm}/4`}
        trebleClef={abcStringify(activeNotes ? activeNotes.trebleClef : abc.trebleClef)}
        bassClef={abcStringify(activeNotes ? activeNotes.bassClef : abc.bassClef)}
      />
      <ButtonContainer>
        <h2>Play/Stop</h2>
        {visualObj && <AudioButton visualObj={visualObj}/>}
        <h2>Options</h2>
        {abcOptions.map(note => <Button
          key={note}
          value={note}
          onClick={addNote}
          highlighted={note === activeAbc}
        >{note}</Button>)}
      </ButtonContainer>
    </>
  )
}

export default Home;