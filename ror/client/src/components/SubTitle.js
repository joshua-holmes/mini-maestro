import styled from "styled-components";

const StyledH2 = styled.h2`
text-align: center;
font-weight: lighter;
margin: 40px 0;
font-size: 2em;
`
function SubTitle({ children }) {
  
  return (
    <StyledH2>{children}</StyledH2>
  )
}

export default SubTitle;