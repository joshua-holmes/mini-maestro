import Container from 'react-bootstrap/Container';
import Title from './Title';
import styled from 'styled-components';
import Spacer from './Spacer';

const ProfilePic = styled.img`
display: flex;
margin: auto;
margin-bottom: 30px;
width: 30%;
border-radius: 100%;
@media (max-width: 991px) {
  width: 40%;
}
`

function AboutMe() {
  
  return (
    <Container>
      <Title>About Me</Title>
      <ProfilePic src="./music (square).jpg" alt="Joshua Holmes"/>
      <p>My name is Joshua Holmes and I am a full-stack software engineer and classical musician! I build full-stack applications using JavaScript, Ruby, React, Rails, and a little Python. My experience spans from building relational databases, RESTful routes, and custom server-side logic, to vanilla CSS and CSS frameworks like MUI in React.</p>
      <p>I am also an experienced classical hornist and pianist, with over 20 years of experience behind me. I have played in operas, musicals, orchestras, ballets, on the street, in my grandma's basement, you name it!</p>
      <p>Feel free to reach out on <a target="_blank" href='https://www.linkedin.com/in/joshua-phillip-holmes/'>LinkedIn</a> if you have any questions, checkout <a target="_blank" href='https://github.com/joshua-holmes'>my GitHub</a> if you want to see source code, or checkout <a target="_blank" href='https://www.jpholmes.com/'>my website</a> if you want to see more finished projects!</p>
      <Spacer />
    </Container>
  )
}

export default AboutMe;