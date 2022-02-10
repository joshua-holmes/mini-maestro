import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import SubTitle from "./SubTitle";
import Spacer from "./Spacer";
import styled from "styled-components";
import { useEffect, useState } from "react";
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";

const StyledLink = styled(Link)`
margin: 15px;
`

function Login({ isLoggedIn, setUser }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);
  let navigate = useNavigate();

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = (e, formData) => {
    e.preventDefault();
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(formData),
    }
    fetch("/api/login", config)
    .then(r => {
      if (r.ok) return r.json().then(data => { setUser(data) })
      else return r.json().then(data => setErrors(data.errors))
    }).catch(error => console.error("ITS GONNA BE A BUMPY RIDE ==>", error))
  }
  
  useEffect(() => {
    if (isLoggedIn) {
      const savedPath = localStorage.getItem("savedPath");
      localStorage.removeItem("savedPath");
      navigate(savedPath || "/");
    }
  }, [isLoggedIn])

  return (
    <Container>
      <SubTitle>Login</SubTitle>
      <Form onSubmit={e => handleLogin(e, formData)}>
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
      {errors.map(err => <Alert key={err} variant="danger">{err}</Alert>)}
      <Spacer />
    </Container>
  )
}

export default Login;