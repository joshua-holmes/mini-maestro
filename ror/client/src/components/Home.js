import { useEffect, useState } from 'react';
import Button from './Button';
import OptionButton from "./OptionButton";
import SheetMusic from './SheetMusic';

function Home() {
  const [abc, setAbc] = useState({
    current: "B D D/D/ [d] f",
    previous: "",
  });
  const [newAbc, setNewAbc] = useState(["g", "f", "c", "A", "D"])
  const [activeAbc, setActiveAbc] = useState(newAbc[0])

  const handleClick = e => {
    console.log(e);
  }

  const selectNote = e => {
    setAbc(() => ({
      current: `${abc.current} ${e.target.value}`,
      previous: abc.current,
    }))
  }

  useEffect(() => {
    let count = 0;
    const iterate = () => {
      count += 1
      const index = count % newAbc.length;
      setActiveAbc(() => newAbc[index])
    }
    const id = setInterval(iterate, 1000)
    return function cleanup() { clearInterval(id); }
  }, [newAbc])

  return (
    <>
      <SheetMusic
        title="title"
        meter="4/4"
        trebleClef={abc.current}
        withPlayback={true}
      />
      <SheetMusic
        title="title"
        meter="4/4"
        trebleClef={`${abc.current} ${activeAbc}`}
        colorOfLast="#ea526f"
        onClick={handleClick}
      />
      <h2>Options</h2>
      {newAbc.map(note => <Button
        key={note}
        value={note}
        onClick={selectNote}
        highlighted={note === activeAbc}
      >{note}</Button>)}
    </>
  )
}

export default Home;