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
import Container from 'react-bootstrap/Container';
import Alert from "react-bootstrap/Alert";
import MusicSetupForm from './MusicSetupForm';
import { Link, useNavigate } from 'react-router-dom';

const ButtonContainer = styled.div`
position: absolute;
bottom: 0%;
margin: 20px 0;
`

const PlainLink = styled(Link)`
text-decoration: inherit;
color: inherit;
`

function CreateMusic({ user }) {
  const navigate = useNavigate();
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
  
  const [songDetails, setSongDetails] = useState(
    JSON.parse(localStorage.getItem("songDetails")) ||
    {measures: 4, bpm: 4, title: "My Piece's Title"}
  );
  const {measures, bpm, title} = songDetails;
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
      if (options) setActiveAbc(() => options[0])
    } else console.log("Song is full, no note to add.");
  }

  const partPlusActiveNote = part => {
    if (!activePart(abc)) {
      clearInterval(timerId);
      console.log("Song is full, stopping timer.");
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
  
  const reset = () => {
    const options = getAbcOptions(defaultAbc)
    setAbc(() => defaultAbc)
    setAbcOptions(() => options)
    setActiveAbc(() => options[0])
  }

  const handleChange = e => {
    const detailsObj = {
      ...songDetails,
      [e.target.name]: e.target.value
    }
    localStorage.setItem("songDetails", JSON.stringify(detailsObj))
    setSongDetails(detailsObj);
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
    setTimerId(() => id);
    return cleanup;
  }, [abcOptions])

  useEffect(() => {
    localStorage.setItem('abc', JSON.stringify(abc))
  }, [abc])

  const sheetMusic = (
    <>
      {/* For playing music */}
      <SheetMusic
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
        title={title}
        meter={`${bpm}/4`}
        soprano={partPlusActiveNote("soprano")}
        alto={partPlusActiveNote("alto")}
        tenor={partPlusActiveNote("tenor")}
        bass={partPlusActiveNote("bass")}
        bpm={bpm}
      />
    </>
  )

  const renderOptions = () => {
    if (!activePart(abc)) {
      return <h5>Your piece is finished!</h5>
    } else if (!abcOptions) {
      return null;
    } else if (abcOptions.length === 0) {
      return <h5>Out of options! Click undo and choose a different note or start over.</h5>
    } else {
      return abcOptions.map(note => {
        const cleanNote = note.replace(/[0-9]/, '')
        return <Button
          key={note}
          value={note}
          onClick={saveNote}
          highlighted={note === activeAbc}
        >{cleanNote}</Button>
      })
    }
  }
  const lg = window.innerWidth > 991

  const handleNav = path => {
    localStorage.setItem("savedPath", window.location.pathname);
    navigate(path);
  }

  return (
    <>
      {user.username ? null :
        <Alert variant='colorTwo'>
          <Alert.Link onClick={() => handleNav("/login")}>Login</Alert.Link> or {" "}
          <Alert.Link onClick={() => handleNav("/sign-up")}>create an account</Alert.Link>
          {" "}to save your tune! Your piece will stay here until you get back!
        </Alert>
      }
      {!lg ? sheetMusic : null}
      <Container>
        {lg ? sheetMusic : null}
        <MusicSetupForm
          onChange={handleChange}
          songDetails={songDetails}
          isEditable={abc.soprano.length === 0}
        />
        <ButtonContainer>
          {renderOptions()}
          <div />
          {!visualObj ? null : <AudioButton
            visualObj={visualObj}
            display={abc.previous}
          />}
          {!abc.previous || !visualObj ? null : <>
            <Button 
              variant="primary"
              size="lg"
              onClick={undoNote}
            >
              <GrUndo />
            </Button>
            <Button onClick={reset}>Reset</Button>
          </>}
        </ButtonContainer>
      </Container>
    </>
  )
}

export default CreateMusic;