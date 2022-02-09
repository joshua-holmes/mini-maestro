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
import { cloneDeep } from "lodash";

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
  const savedAbc = JSON.parse(localStorage.getItem('abc'))
  const [abc, setAbc] = useState(savedAbc || defaultAbc);
  
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

  const cleanAbc = abc => {
    let cleanCopy = cloneDeep(abc);
    for (let part in cleanCopy) {
      if (part !== "previous") {
        cleanCopy[part] = cleanCopy[part].map(n => n.replace(/[0-9]/g, ''));
        cleanCopy[part] = cleanCopy[part].filter(n => !n.match(/z/));
      }
    }
    return cleanCopy
  }

  const isLastBeat = (abc, place = 1) => {
    const part = cleanAbc(abc)[activePart(abc)]
    if (part) return part.length === beats - place
  };

  const getAbcOptions = abc => {
    const getVoiceObject = abc => {
      const cleanedAbc = cleanAbc(abc);
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
      return {
        melArr: cleanedAbc[activePart(abc)],
        harArr: getHarArr(cleanedAbc),
        beats: beats,
        activeBeat: cleanedAbc[activePart(abc)].length % beats
      }
    }
    let options
    switch (activePart(abc)) {
      case "soprano":
        const sop = new Soprano();
        options = sop.getOptions(getVoiceObject(abc));
        break;
      case "alto":
        const alto = new Alto();
        options = alto.getOptions(getVoiceObject(abc));
        break;
      case "tenor":
        const ten = new Tenor();
        options = ten.getOptions(getVoiceObject(abc));
        break;
      case "bass":
        const bass = new Bass();
        options = bass.getOptions(getVoiceObject(abc));
        break;
      default:
        console.error("'activePart' is not set correctly to an SATB part")
        break;
    }
    if (isLastBeat(abc)) options = options.map(n => n + bpm);
    return options
  }

  const [abcOptions, setAbcOptions] = useState(() => getAbcOptions(abc));

  const [activeAbc, setActiveAbc] = useState(abcOptions && abcOptions[0]);

  const appendNoteToArray = (note, array) => {
    const primeBass = () => {
      const rests = [];
      for (let i = 0; i < beats; ++i) {
        let rest = 'z';
        if (i === beats - 1) rest += bpm;
        rests.push(rest);
      }
      return rests;
    }
    let newArr = [...array];
    if (activePart(abc) === "tenor" && abc.tenor.length === 0) newArr = primeBass();
    const indexOfZ = newArr.findIndex(n => n.match(/z/));
    if (indexOfZ >= 0) {
      newArr[indexOfZ] = note;
      return newArr;
    } else {
      newArr.push(note);
      return newArr;
    }
  }

  const saveNote = e => {
    let newNote = e.target.value;
    if (activePart(abc)) {
      const newAbc = {
        ...abc,
        [activePart(abc)]: appendNoteToArray(newNote, abc[activePart(abc)]),
        previous: abc,
      }
      const options = getAbcOptions(newAbc)
      setAbc(() => newAbc)
      setAbcOptions(() => options)
      setActiveAbc(() => options[0])
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
      const options = getAbcOptions(abc.previous)
      setAbc(() => abc.previous)
      setAbcOptions(() => options)
      setActiveAbc(() => options[0])
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

  useEffect(() => {
    localStorage.setItem('abc', JSON.stringify(abc))
  }, [abc])

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
          {abcOptions.map(note => {
          const cleanNote = note.replace(/[0-9]/, '')
          return <Button
            key={note}
            value={note}
            onClick={saveNote}
            highlighted={note === activeAbc}
          >{cleanNote}</Button>})}
        </> : <p>You ran out of options! Click undo and choose a different note, or start over!</p>}
      </ButtonContainer>
    </>
  )
}

export default Home;