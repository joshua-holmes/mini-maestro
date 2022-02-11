import { useEffect, useState } from 'react';
import { GrUndo } from "react-icons/gr";
import Button from './Button';
import SheetMusic from './SheetMusic';
import AudioButton from "./AudioButton";
import Spacer from "./Spacer";
import Soprano from "../lib/soprano";
import Alto from "../lib/alto";
import Tenor from "../lib/tenor";
import Bass from "../lib/bass";
import styled from 'styled-components';
import { cloneDeep } from "lodash";
import Container from 'react-bootstrap/Container';
import Alert from "react-bootstrap/Alert";
import MusicSetupForm from './MusicSetupForm';
import { useNavigate } from 'react-router-dom';

const ButtonContainer = styled.div`
position: fixed;
bottom: 0%;
margin: 20px 0;
`

function CreateMusic({ userState }) {
  const [user, setUser] = userState;
  const navigate = useNavigate();
  const defaultAbc = {
    soprano: [],
    alto: [],
    tenor: [],
    bass: [],
    previous: null
  }
  const songDetailsDefault = {measures: 4, bpm: 4, title: "My Piece's Title", tempo: 120}
  const savedAbc = JSON.parse(localStorage.getItem('abc'))
  const [abc, setAbc] = useState(savedAbc || defaultAbc);
  const [errors, setErrors] = useState([]);
  
  const [visualObj, setVisualObj] = useState();
  const [timerId, setTimerId] = useState(null);
  
  const [songDetails, setSongDetails] = useState(
    JSON.parse(localStorage.getItem("songDetails")) || songDetailsDefault
  );

  const {measures, bpm, title, tempo} = songDetails;
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

  if (!activePart(abc)) clearInterval(timerId)

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

  const abcPlusActive = (() => {
    if (!activePart(abc)) return abc;
    const isLastNote = abc[activePart(abc)].length === beats
    const backupNote = isLastNote ? `z${bpm}` : 'z'
    const needsRest = !activeAbc && activePart(abc) === "tenor"
    const chosenNote = needsRest ? backupNote : activeAbc
    return {
      ...abc,
      [activePart(abc)]: appendNoteToArray(chosenNote, abc[activePart(abc)])
    }
  })()

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
    const key = e.target.name;
    let value = e.target.value;
    if (key === "tempo" && value > 360) {
      value = songDetails.tempo;
    }
    const detailsObj = {
      ...songDetails,
      [key]: value
    }
    localStorage.setItem("songDetails", JSON.stringify(detailsObj))
    setSongDetails(detailsObj);
  }



  const lg = window.innerWidth > 991

  const handleNav = path => {
    localStorage.setItem("savedPath", window.location.pathname);
    navigate(path);
  }

  const getRawAbc = abc => {
    const joinNotes = (arr1, arr2) => {
      const returnedArr = [];
      const maxLength = Math.max(arr1.length, arr2.length);
      for (let i = 0; i < maxLength; i++) {
        if (arr1[i] && arr2[i]) {
          returnedArr.push(`[${arr1[i]}${arr2[i]}]`)
        } else {
          returnedArr.push(arr1[i] || arr2[i])
        }
      }
      return returnedArr;
    }
    const abcStringify = abcArray => {
      let abcString = "";
      abcArray.forEach((note, index) => {
        if (index % bpm === 0 && index !== 0) abcString += " |"
        abcString += ` ${note}`
      })
      return abcString;
    }
    const trebleClef = abcStringify(joinNotes(abc.soprano, abc.alto));
    const bassClef = abcStringify(joinNotes(abc.tenor, abc.bass));
  
    return `
X:1
T:${title || ""}
M:${bpm}/4
L:1/4
Q:${tempo > 40 ? tempo : 40}
K:C
${!!trebleClef ? "V:T clef=treble\n": ""}${!!bassClef ? "V:B clef=bass\n": ""}${!!trebleClef ? "[V:T]" + trebleClef + " |]\n" : ""}${!!bassClef ? "[V:B]" + bassClef + " |]\n" : ""}`
  }

  const handleSave = () => {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        abc: getRawAbc(abc)
      }),
    }
    fetch("/api/tunes", config)
    .then(r => {
      if (r.ok) {
        r.json().then(tune => {
          localStorage.removeItem("songDetails");
          localStorage.removeItem("abc");
          setUser({
            ...user,
            tunes: [
              ...user.tunes,
              tune,
            ]
          })
          navigate("/my-tunes");
        })
      } else {
        r.json().then(err => setErrors(err.errors));
      }
    })
    .catch(error => console.error("The unthinkable has happened... ==>", error))
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
        setVisualObj={setVisualObj}
        rawAbc={getRawAbc(abc)}
      />
      {/* For displaying music */}
      <SheetMusic
        rawAbc={getRawAbc(abcPlusActive)}
      />
    </>
  )

  const renderSuccessMessage = () => (
    <><h5>Your piece is finished!{" "}
    {user.username ? <>Click 'Save' to save your piece!</> :
    <><a href="#" onClick={() => handleNav("/login")}>Login</a> or 
    <a href="#" onClick={() => handleNav("/sign-up")}>create an account</a>{" "}
    to save it!</>}</h5></>
  )

  const renderOptions = () => {
    if (abcOptions.length === 0) {
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

  const handleStuff = e => {
    console.log(e)
  }

  return (
    <>
      {errors.map(err => <Alert key={err} variant="danger">{err}</Alert>)}
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
          {activePart(abc) ? null : renderSuccessMessage()}
          {activePart(abc) && abcOptions ? renderOptions() : null}
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
            {user.username && !activePart(abc) 
            ? <Button onClick={handleSave}>Save</Button> : null}
          </>}
        </ButtonContainer>
        <Spacer space={120}/>
      </Container>
    </>
  )
}

export default CreateMusic;