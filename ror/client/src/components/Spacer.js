import styled from "styled-components";

const StyledDiv = styled.div`
padding-bottom: ${({space}) => space}px;
background-color: red;
`

function Spacer({ space = 50 }) {
  
  return <StyledDiv space={space}>test again</StyledDiv>
}

export default Spacer;