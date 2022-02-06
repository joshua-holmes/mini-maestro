import ABCJS from "abcjs";
import { useEffect } from "react";

function SheetMusic({ 
  title,
  meter,
  soprano,
  alto,
  tenor,
  bass,
  bpm,
  setVisualObj = function() {},
  onClick,
  tempo = 180 
}) {

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
  const trebleClef = abcStringify(joinNotes(soprano, alto));
  const bassClef = abcStringify(joinNotes(tenor, bass));

  const abc = `
X:1
T:${title || ""}
M:${meter}
L:1/4
Q:${tempo}
K:C
${!!trebleClef ? "V:T clef=treble\n": ""}${!!bassClef ? "V:B clef=bass\n": ""}${!!trebleClef ? "[V:T] " + trebleClef + " |]\n" : ""}${!!bassClef ? "[V:B] " + bassClef + " |]\n" : ""}`

  useEffect(() => {
    setVisualObj(ABCJS.renderAbc("paper", abc, {
      responsive: "resize",
      clickListener: onClick,
      lineBreaks: [3, 7],
    })[0])
  }, [abc])

  return (
    <>
      <div id="paper" />
      <div id="audio"></div>
    </>
  )
}

export default SheetMusic;