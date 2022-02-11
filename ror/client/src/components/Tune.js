import Container from "react-bootstrap/Container";
import SheetMusic from "./SheetMusic";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import AudioButton from "./AudioButton";
import Spacer from "./Spacer";
import Alert from "react-bootstrap/Alert"
import Button from "./Button";

function Tune({ userState }) {
  const [user, setUser] = userState;
  const params = useParams();
  const [textarea, setTextarea] = useState("");
  const [visualObj, setVisualObj] = useState();
  const [errors, setErrors] = useState([])
  const [success, setSuccess] = useState(false);

  const tune = user.tunes && user.tunes.find(tune => (
    tune.id === parseInt(params.id)
  ));

  const handleUpdate = e => {
    e.preventDefault()
    const body = {abc: e.target.abc.value};
    const config = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    }
    fetch(`/api/tunes/${tune.id}`, config)
    .then(r => {
      // If success
      if (r.ok) {
        return r.json().then(data => {
          const newTunes = user.tunes.map(oldTune => (
            oldTune.id === tune.id ? tune : oldTune
          ));
          setUser(() => ({...user, tunes: newTunes}));
          setSuccess(() => true);
          setTimeout(() => setSuccess(false), 3000);
        });
      // If fail
      } else { return r.json().then(data => setErrors(data.errors)) }
    }).catch(error => console.error("Spicy error! ==>", error))
  }

  const handleChange = e => {
    setTextarea(e.target.value)
  }

  useEffect(() => {
    if (tune) setTextarea(tune.abc)
  }, [tune])

  return (
    <Container>
      <Spacer />
      <SheetMusic
        rawAbc={textarea}
        setVisualObj={setVisualObj}
      />
      {visualObj && <AudioButton
        visualObj={visualObj}
      />}
      <Spacer />
      {errors.map(err => <Alert key={err} variant="danger">{err}</Alert>)}
      <Form onSubmit={handleUpdate}>
        <Form.Group className="mb-3">
          <Form.Label>ABC Edit Field</Form.Label>
          <Form.Control
            as="textarea"
            rows={12}
            value={textarea}
            onChange={handleChange}
            name="abc"
            spellCheck={false}
          />
        </Form.Group>
        <Button
          color={success ? "#FF8A5B" : ""}
        >
          {success ? "Saved!" : "Save Changes"}
        </Button>
      </Form>
      <Spacer />
    </Container>
  )
}

export default Tune;