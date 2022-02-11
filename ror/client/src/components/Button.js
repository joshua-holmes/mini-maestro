import styled from "styled-components";

const StyledButton = styled.button`
color: ${({disabled, textColor}) => disabled ? "#aaa" : textColor || "#333"};
background-color: ${({disabled, color}) => {
  if (disabled) return "lightgray"
  if (color) return color
  return "#fceade"
}};
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
  ${({disabled, hoverColor}) => disabled ? "" : `
  background:${hoverColor || "#25ced1"} radial-gradient(circle, transparent 1%, ${hoverColor || "#25ced1"} 1%) center/15000%;
  border-color: ${hoverColor || "#25ced1"};
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

function Button({ children, onClick, value, highlighted, style, disabled, type, display = true, color, hoverColor, textColor }) {
  
  return (
    <StyledButton
      style={{...style, animationName: highlighted ? "highlight" : "", display: display ? "" : "none"}}
      value={value}
      onClick={onClick}
      disabled={disabled}
      type={type}
      color={color}
      hoverColor={hoverColor}
      textColor={textColor}
    >{children}</StyledButton>
  )
}

export default Button;