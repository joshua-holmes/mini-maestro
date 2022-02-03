import ABCJS from "abcjs";
import { useEffect, useState } from "react";
import AudioButton from "./AudioButton";

function SheetMusic({ title, meter, trebleClef, bassClef, colorOfLast, withPlayback, onClick }) {
  const [visualObj, setVisualObj] = useState([]);
  const abc = `
X:1
T:${title || ""}
M:${meter}
L:1/4
K:C
${!!trebleClef ? "V:T clef=treble\n": ""}${!!bassClef ? "V:B clef=bass\n": ""}${!!trebleClef ? "[V:T] " + trebleClef + "|]\n" : ""}${!!bassClef ? "[V:B] " + bassClef + "|]\n" : ""}`
  useEffect(() => {
    setVisualObj(ABCJS.renderAbc("paper", abc, {responsive: "resize", clickListener: onClick })[0])
  }, [abc])

  const paths = Array.from(document.querySelectorAll("path")).reverse()
  const last = paths.find(path => {
    const value = path.attributes.d.value.split(" ")[2];
    return value[value.length - 1] === "c";
  });
  if (last && colorOfLast) {
    last.attributes.fill.value = colorOfLast
  }

  return (
    <>
      <div id="paper" />
      <div id="audio"></div>
      {withPlayback && <AudioButton visualObj={visualObj}/>}
    </>
  )
}

export default SheetMusic;