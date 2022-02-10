import Container from "react-bootstrap/Container";
import styled from "styled-components";
import { Link } from "react-router-dom";
import RickRolls from "./RickRolls";
import Title from "./Title";
import SubTitle from "./SubTitle";

const Spacer = styled.div`
margin-bottom: 30px;
`

function Home() {
  return (
    <Container>
      <Title>♩Welcome to Mini Maestro! ♫</Title>
      <SubTitle>The app that walks you through composing your very own music, even if you have no experience.</SubTitle>
      <p>To get started, go to the <Link to="/create-new">Create New</Link> page! If you are signed in, you can save your pieces for use later! This app works using the guidance of <a target="_blank" href="https://en.wikipedia.org/wiki/Counterpoint#:~:text=In%20music%2C%20counterpoint%20is%20the,in%20rhythm%20and%20melodic%20contour.&text=The%20term%20originates%20from%20the,i.e.%20%22note%20against%20note%22.">Counterpoint</a> as its foundation. You can read more about the contrapuntal techniques used in this app <Link to="/how-it-works">here</Link>, if you are curious. If you are looking for a more robust music writing software with fewer limitations (but requires more knowledge), I would recommend <a target="_blank" href="https://www.noteflight.com/">Noteflight</a>. Enjoy!</p>
      <RickRolls />
      <Spacer />
    </Container>
  )
}

export default Home;