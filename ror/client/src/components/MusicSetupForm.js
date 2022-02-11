import Form from "react-bootstrap/Form"
import Button from "./Button";

function MusicSetupForm({ songDetails, onChange, isEditable }) {

  const {bpm, measures, title, tempo} = songDetails

  const renderOptions = (min, max) => {
    const options = [];
    for (let i = min; i <= max; i++) {
      options.push(<option key={i} value={i}>{i}</option>)
    }
    return options;
  }
  
  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Title of your piece</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter a title"
          value={title}
          onChange={onChange}
          name="title"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Tempo</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter a number"
          value={tempo}
          onChange={onChange}
          name="tempo"
        />
      </Form.Group>
      {isEditable ? 
        <>
          <Form.Group className="mb-3">
            <Form.Label>Number of measures</Form.Label>
            <Form.Select
              type="number"
              placeholder="Select number"
              value={measures}
              onChange={onChange}
              name="measures"
            >
              {renderOptions(2, 8)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Number of beats per measure</Form.Label>
            <Form.Select
              type="number"
              placeholder="Select number"
              value={bpm}
              onChange={onChange}
              name="bpm"
            >
              {renderOptions(2, 4)}
            </Form.Select>
          </Form.Group>
        </>
      : null}
      
    </Form>
  )
}

export default MusicSetupForm;