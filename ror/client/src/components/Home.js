import { useEffect, useState } from 'react';
import { GrUndo } from "react-icons/gr";
import Button from './Button';
import SheetMusic from './SheetMusic';
import AudioButton from "./AudioButton";
import Soprano from "../lib/soprano";
import Alto from "../lib/alto";
import Tenor from "../lib/tenor";
import Bass from "../lib/bass";
import styled from 'styled-components';

const ButtonContainer = styled.div`
position: absolute;
bottom: 0%;
`

function Home() {
  const defaultAbc = {
    soprano: [],
    alto: [],
    tenor: [],
    bass: [],
    previous: null
  }
  const save = JSON.parse(localStorage.getItem("save"))
  const [abc, setAbc] = useState(defaultAbc);
  // localStorage.setItem("save", JSON.stringify(abc))
  
  const [visualObj, setVisualObj] = useState();
  const [timerId, setTimerId] = useState(null);

  const measures = 2;
  const bpm = 2; // Beats per measure
  const beats = measures * bpm - bpm + 1;
  
  const countNotes = string => {
    if (!string) return 0;
    let count = 0;
    for (let i of string) {
      const code = i.charCodeAt()
      if ((code >= 65 && code <= 71) || (code >= 97 && code <= 103)) count++;
    }
    return count;
  }
  
  const activePart = (abc) => {
    let parts = ["soprano", "alto", "tenor", "bass"].reverse();
    let part;
    for (let p of parts) {
      if (countNotes(abc[p].join("")) < beats) part = p
    }
    return part;
  }
  const getAbcOptions = abc => {
    switch (activePart(abc)) {
      case "soprano":
        const sop = new Soprano();
        return sop.getOptions(getVoiceObject(abc));
      case "alto":
        const alto = new Alto();
        return alto.getOptions(getVoiceObject(abc));
      case "tenor":
        const ten = new Tenor();
        return ten.getOptions(getVoiceObject(abc));
      case "bass":
        const bass = new Bass();
        return bass.getOptions(getVoiceObject(abc));
      default:
        console.error("'activePart' is not set correctly to an SATB part")
        break;
    }
  }
  
  const getVoiceObject = abc => {
    const getHarArr = abc => {
      const song = [];
      for (let i = 0; i < abc.soprano.length; i++) {
        const beat = [];
        for (let part in abc) {
          if (abc[part][i]) beat.push(abc[part][i])
        }
        song.push(beat);
      }
      return song;
    }
    const voiceWithoutRests = abc[activePart(abc)].filter(note => note !== 'z');
    return {
      melArr: abc[activePart(abc)],
      harArr: getHarArr(abc),
      beats: beats,
      activeBeat: voiceWithoutRests.length % beats
    }
  }
  
  const [abcOptions, setAbcOptions] = useState(() => {
    return getAbcOptions(abc)
  });

  const [activeAbc, setActiveAbc] = useState(abcOptions && abcOptions[0]);

  const appendNoteToArray = (note, array) => {
    const primeBass = () => {
      const rests = [];
      for (let i = 0; i < beats; ++i) {
        rests.push("z");
      }
      return rests;
    }
    let newArr = [...array];
    if (activePart(abc) === "tenor" && abc.tenor.length === 0) newArr = primeBass();
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
    if (activePart(abc)) {
      const newAbc = {
        ...abc,
        [activePart(abc)]: appendNoteToArray(newNote, abc[activePart(abc)]),
        previous: abc,
      }
      const options = getAbcOptions(newAbc)
      setAbc(() => newAbc)
      setAbcOptions(() => options)
    } else console.log("Song is full, no note to add.");
  }

  const partPlusActiveNote = part => {
    if (!activePart(abc)) {
      clearInterval(timerId);
      console.log("Song is full, no note to add.");
    }
    if (activePart(abc) !== part) return abc[part]
    else return appendNoteToArray(activeAbc, abc[part])
  }

  const undoNote = () => {
    if (abc.previous) {
      setAbc(() => abc.previous)
      setAbcOptions(() => getAbcOptions(abc.previous))
    }
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
        <h2>Controls</h2>
        {visualObj && <AudioButton
          disabled={!abc.previous}
          visualObj={visualObj}
        />}
        <Button
          onClick={undoNote}
          disabled={!abc.previous}
        ><GrUndo /></Button>
        {abcOptions ? <>
          <h2>Options</h2>
          {abcOptions.map(note => <Button
            key={note}
            value={note}
            onClick={saveNote}
            highlighted={note === activeAbc}
          >{note}</Button>)}
        </> : <p>You ran out of options! Click undo and choose a different note, or start over!</p>}
      </ButtonContainer>
    </>
  )
}

export default Home;