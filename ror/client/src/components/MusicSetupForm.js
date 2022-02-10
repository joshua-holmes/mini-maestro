import Form from "react-bootstrap/Form"
import Button from "./Button";

function MusicSetupForm({ songDetails, onChange, isEditable }) {

  const {bpm, measures, title} = songDetails
  
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
          color="secondary"
        />
      </Form.Group>
      {isEditable ? 
        <>
          <Form.Group className="mb-3">
            <Form.Label>Number of measures</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter number"
              value={measures}
              onChange={onChange}
              name="measures"
              max={8}
              min={2}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Number of beats per measure</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter number"
              value={bpm}
              onChange={onChange}
              name="bpm"
              max={4}
              min={2}
            />
          </Form.Group>
        </>
      : null}
      
    </Form>
  )
}

export default MusicSetupForm;