import Button from "./Button";

function OptionButton({ onClick, children, value, highlighted }) {
  
  return (
    <Button
      value={value}
      onClick={onClick}
      highlighted={highlighted}
    >{children}</Button>
  )
}

export default OptionButton;