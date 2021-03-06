import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import Title from "./Title";
import styled from "styled-components";
import ListGroup from "react-bootstrap/ListGroup";
import { TrashFill } from "react-bootstrap-icons";
import Button from "./Button";
import SubTitle from "./SubTitle";
import Spacer from "./Spacer";

const Clicker = styled(Link)`
position: absolute;
width: 75%;
height: 100%;
top: 0;
left: 0;
transition: 0.5s;
cursor: pointer;
&:hover {
  background: linear-gradient(90deg, rgba(207, 246, 246, 0.22) 0%, rgba(207, 246, 246, 0.11) 65%, rgba(207, 246, 246, 0) 100%);
}
`

function MyTunes({ userState }) {

  const [user, setUser] = userState;

  const handleSelect = () => {

  }

  const handleDelete = id => {
    const newUser = {
      ...user,
      tunes: user.tunes.filter(tune => tune.id !== id),
    }
    fetch(`/api/tunes/${id}`, {method: "DELETE"})
    .then(r => {
      if (r.ok) { setUser(newUser) } 
      else { r.json().then(data => console.error(data.errors)) }
    }).catch(error => console.error("I've got a baaaad feeling about this ==>", error))
  }

  // array = []
  return (
    <Container>
      <Title>My Tunes</Title>
      <p>Here is where you can view and edit your tunes. Please keep in mind that the only way to edit tunes is using ABC Notation in the text field below. Feel free to "fiddle" around with it! If you need help, <a target="_blank" href="https://abcnotation.com/">ABC Notation's official website</a> is a great resource!</p>
      <Spacer />
      <ListGroup>
        {!!user.username && user.tunes.length ? user.tunes.map(tune => 
        <ListGroup.Item key={tune.id}>
          {tune.abc.match(/T:.+/)[0].slice(2)}
          <Clicker to={`/my-tunes/${tune.id}`}></Clicker>
          <Button
            style={{float: "right", margin: "auto", padding: "inherit"}}
            color="#dc3545"
            hoverColor="#7A151F"
            onClick={() => handleDelete(tune.id)}
          >
            <TrashFill />
          </Button>
        </ListGroup.Item>) : <SubTitle >You have no saved tunes.{" "}
          <Link to="/create-new">Create one here!</Link></SubTitle>
        }
      </ListGroup>
      <Spacer />
    </Container>
  )
}

export default MyTunes;