import styled from "styled-components";

const StyledButton = styled.button`
background-color: #fceade;
width: 100px;
display: block;
border: 1px solid #333;
border-radius: 16px;
padding: 15px 18px 30px 15px;
margin: 5px;
cursor: pointer;
height:32px;
font-size:14px;
box-shadow: 0 0 4px #999;
background-position: center;
transition: background 0.8s;
font-weight: bold;
text-transform: uppercase;
animation-duration: 0.5s;
animation-timing-function: ease-out;
display: inline-flexbox;
justify-content: center;
&:hover {
  background:#25ced1 radial-gradient(circle, transparent 1%, #25ced1 1%) center/15000%;
  border-color: #25ced1;
  color: white;
}
&:active {
  background-color: #293e30;
  background-size: 100%;
  transition: background 0s;
}
@keyframes highlight {
  from {
    background-color: #ea526f;
  }
}
`

function Button({ children, onClick, value, highlighted, style, disabled }) {
  
  return (
    <StyledButton
      style={{...style, animationName: highlighted ? "highlight" : ""}}
      value={value}
      onClick={onClick}
      disabled={disabled}
    >{children}</StyledButton>
  )
}

export default Button;