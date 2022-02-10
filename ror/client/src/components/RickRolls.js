import ABCJS from "abcjs";
import { useEffect, useState } from "react";
import AudioButton from "./AudioButton";

const abc = `
X:1
T:Never Gonna Give You Up
T:A Rick Roll
K:F
Q:114
M:4/4
C:Mike Stock / Matt Aitken / Peter Waterman
V:T clef=treble
V:B clef=bass
[V:T] C/D/F/D/ | .[DFA]>.[DFA] - [DFA][CEG] - [CEG]2 C/D/F/D/ | \
.[CEG]>.[CEG] - [CEG][A,DF] - [A,DF]2 C/D/F/D/ |
[V:B] z2 | .[B,,,B,,]>.[B,,,B,,] - [B,,,B,,][C,,C,] - [C,,C,]2 z2 | \
.[A,,,A,,]>.[A,,,A,,] - [A,,,A,,][D,,D,] - [D,,D,]2 z2 |
[V:T] [B,DF]2 G[CE] - [CE]/D/ C2 C | .[A,CG]2 [A,DF]4 C/D/F/D/ | \
.[DFA]>.[DFA] - [DFA][CEG] - [CEG]2 C/D/F/D/ |
[V:B] [G,,,G,,]3 [C,,C,] - [C,,C,]2 C,2 | .[A,,E,]2 [D,,D,]4 z2 | \
.[B,,,B,,]>.[B,,,B,,] - [B,,,B,,][C,,C,] - [C,,C,]2 z2 |
[V:T] [Cc]2 EF - F/E/D C/D/F/D/ | [B,DF]2 G[CE] - [CE]/D/ C2 C | .[A,CG]2 [A,DF]6 |]
[V:B] [A,,,A,,]2 [A,,,A,,][D,,] - [D,,D,]2 [A,,A,,,]2 | \
[G,,,G,,] - [G,,,D,]2 [C,,C,] - [C,,C,]2 C,2 | .[A,,E,]2 [D,,,D,,]6 |]
`

function RickRolls() {
  const [visualObj, setVisualObj] = useState();
  
  
  useEffect(() => {
    setVisualObj(ABCJS.renderAbc("paper", abc, {
      responsive: "resize",
    })[0])
  }, [])
  
  return (
    <>
      <div id="paper" />
      <div id="audio" />
      {visualObj && <AudioButton visualObj={visualObj}/>}
    </>
  )
}

export default RickRolls;