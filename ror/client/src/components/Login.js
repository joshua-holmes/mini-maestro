import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form"
// import styled from "styled-components";
import SubTitle from "./SubTitle";
import Spacer from "./Spacer";
import styled from "styled-components";
import { useState } from "react";
import Button from "./Button";
import { Link } from "react-router-dom";

const StyledLink = styled(Link)`
margin: 15px;
`

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    password_confirmation: "",
  })

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  const handleSubmit = e => {
    e.preventDefault();
    console.log(e);
  }
  return (
    <Container>
      <SubTitle>Login</SubTitle>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username..."
            value={formData.username}
            onChange={handleChange}
            name="username"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password..."
            value={formData.password}
            onChange={handleChange}
            name="password"
          />
        </Form.Group>
        <Button type="submit">Login</Button>
        <StyledLink to="/sign-up">Don't have an account?</StyledLink>
      </Form>
      <Spacer />
    </Container>
  )
}

export default Login;