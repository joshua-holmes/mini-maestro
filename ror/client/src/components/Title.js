import styled from "styled-components";

const StyledH1 = styled.h1`
text-align: center;
font-weight: lighter;
margin: 40px 0;
font-size: 4em;
`
function Title({ children }) {
  
  return (
    <StyledH1>{children}</StyledH1>
  )
}

export default Title;