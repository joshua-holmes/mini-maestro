import ABCJS from "abcjs";
import { useEffect } from "react";

function SheetMusic({ 
  setVisualObj = function() {},
  onClick,
  rawAbc,
}) {

  useEffect(() => {
    if (rawAbc) {
      setVisualObj(ABCJS.renderAbc("paper", rawAbc, {
        responsive: "resize",
        clickListener: onClick,
        lineBreaks: [3, 7],
      })[0])
    }
  }, [rawAbc])

  return (
    <>
      <div id="paper" />
      <div id="audio" />
    </>
  )
}

export default SheetMusic;