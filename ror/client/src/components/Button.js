import styled from "styled-components";

const StyledButton = styled.button`
color: ${({disabled}) => disabled ? "#aaa" : "#333"};
background-color: ${({disabled}) => disabled ? "lightgray" : "#fceade"};
display: block;
border: 1px solid ${({disabled}) => disabled ? "lightgray" : "#888"};
border-radius: 12px;
padding: 10px 15px;
margin: 5px;
cursor: pointer;
font-size: 16px;
box-shadow: 0 0 2px #999;
background-position: center;
transition: background 0.8s;
font-weight: bold;
animation-duration: 0.5s;
animation-timing-function: ease-out;
display: inline-flexbox;
justify-content: center;
&:hover {
  ${({disabled}) => disabled ? "" : `
  background:#25ced1 radial-gradient(circle, transparent 1%, #25ced1 1%) center/15000%;
  border-color: #25ced1;
  color: white;
  `}
}
&:active {
  background-color: #293e30;
  background-size: 100%;
  transition: background 0s;
}
@keyframes highlight {
  from {
    background-color: #ff8a5b;
  }
}
`

function Button({ children, onClick, value, highlighted, style, disabled, type, display = true }) {
  
  return (
    <StyledButton
      style={{...style, animationName: highlighted ? "highlight" : ""}}
      value={value}
      onClick={onClick}
      disabled={disabled}
      type={type}
      style={{display: display ? "" : "none"}}
    >{children}</StyledButton>
  )
}

export default Button;