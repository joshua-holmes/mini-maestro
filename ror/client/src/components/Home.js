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
    soprano: [],
    alto: [],
    tenor: [],
    bass: [],
  });
  const [abcOptions, setAbcOptions] = useState(["g", "e", "c", "G", "C"]);
  const [visualObj, setVisualObj] = useState();
  const [activeAbc, setActiveAbc] = useState(abcOptions[0]);
  const [timerId, setTimerId] = useState(null);

  const measures = 4;
  const bpm = 4; // Beats per measure
  const beats = measures * bpm;

  const countNotes = string => {
    if (!string) return 0;
    let count = 0;
    for (let i of string) {
      const code = i.charCodeAt()
      if ((code >= 65 && code <= 71) || (code >= 97 && code <= 103)) count++;
    }
    return count;
  }

  const findActivePart = () => {
    let parts = ["soprano", "alto", "tenor", "bass"].reverse();
    let part;
    for (let p of parts) {
      if (countNotes(abc[p].join("")) < beats) part = p
    }
    return part;
  }
  const activePart = findActivePart();
  
  const primeBass = () => {
    const rests = [];
    for (let i = 0; i < beats; ++i) {
      rests.push("z");
    }
    return rests;
  }

  const appendNoteToArray = (note, array) => {
    let newArr = [...array];
    if (activePart === "tenor" && abc.tenor.length === 0) newArr = primeBass();
    const indexOfZ = newArr.findIndex(note => note === "z");
    if (indexOfZ >= 0) {
      newArr[indexOfZ] = note;
      return newArr;
    } else {
      newArr.push(note);
      return newArr;
    }
  }

  const saveNote = e => {
    const newNote = e.target.value;
    if (activePart) setAbc({
      ...abc,
      [activePart]: appendNoteToArray(newNote, abc[activePart])
    });
    else console.log("Song is full, no note to add.");
  }

  const partPlusActiveNote = part => {
    if (!activePart) {
      clearInterval(timerId);
      console.log("Song is full, no note to add.");
    }
    if (activePart !== part) return abc[part]
    else return appendNoteToArray(activeAbc, abc[part])
  }

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
  
  return (
    <>
      {/* For playing music */}
      <SheetMusic
        title="title"
        meter={`${bpm}/4`}
        soprano={abc.soprano}
        alto={abc.alto}
        tenor={abc.tenor}
        bass={abc.bass}
        setVisualObj={setVisualObj}
        bpm={bpm}
      />
      {/* For displaying music */}
      <SheetMusic
        title="title"
        meter={`${bpm}/4`}
        soprano={partPlusActiveNote("soprano")}
        alto={partPlusActiveNote("alto")}
        tenor={partPlusActiveNote("tenor")}
        bass={partPlusActiveNote("bass")}
        bpm={bpm}
      />
      <ButtonContainer>
        <h2>Play/Stop</h2>
        {visualObj && <AudioButton visualObj={visualObj}/>}
        <h2>Options</h2>
        {abcOptions.map(note => <Button
          key={note}
          value={note}
          onClick={saveNote}
          highlighted={note === activeAbc}
        >{note}</Button>)}
      </ButtonContainer>
    </>
  )
}

export default Home;