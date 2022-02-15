import styled from "styled-components";

const StyledDiv = styled.div`
padding-bottom: ${({space}) => space}px;
`

function Spacer({ space = 50 }) {
  
  return <StyledDiv space={space}/>
}

export default Spacer;