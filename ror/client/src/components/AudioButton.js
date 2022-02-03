import ABCJS from "abcjs";
import { useState } from "react";
import Button from "./Button";


function AudioButton({ visualObj }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [midiBuffer, setMidiBuffer] = useState(new ABCJS.synth.CreateSynth());
  const handleClick = e => {
    isPlaying ? stopMusic(midiBuffer) : playMusic(midiBuffer);
  }

  const playMusic = (midiBuffer) => {
    if (ABCJS.synth.supportsAudio()) {
      const AudioContext = window.AudioContext ||
        window.webkitAudioContext ||
        navigator.mozAudioContext ||
				navigator.msAudioContext;
      const audioContext = new AudioContext();
      audioContext.resume().then(() => {
        return midiBuffer.init({
          visualObj: visualObj,
          audioContext: audioContext,
          millisecondsPerMeasure: visualObj.millisecondsPerMeasure(),
          onEnded: () => setIsPlaying(false),
        }).then(r => {
          return midiBuffer.prime();
        }).then(() => {
          midiBuffer.start();
          setIsPlaying(() => true);
          setMidiBuffer(() => midiBuffer);
          return Promise.resolve();
        }).catch(error => {
          console.error("synth error", error);
        })
      })
    } else {
      alert("An error with the player occurred.")
      console.error("Audio not supported!")
    }
  }

  const stopMusic = (midiBuffer) => {
    setIsPlaying(false);
    midiBuffer.stop();
  }

  return (
    <Button onClick={handleClick}>{isPlaying ? "⏹️" : "▶️"}</Button>
  )
}

export default AudioButton;