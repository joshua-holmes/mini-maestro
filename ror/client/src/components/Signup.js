import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form"
import Alert from "react-bootstrap/Alert";
import SubTitle from "./SubTitle";
import Spacer from "./Spacer";
import styled from "styled-components";
import { useState } from "react";
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";

const StyledLink = styled(Link)`
margin: 15px;
`

function Signup({ setUser }) {
  const [formData, setFormData] = useState({
    first_name: "",
    username: "",
    password: "",
    password_confirmation: "",
  })
  const [errors, setErrors] = useState([])
  let navigate = useNavigate();

  const handleChange = e => {
    const key = e.target.name;
    let value = e.target.value;
    if (key === "first_name" && value) {
      value = value[0].toUpperCase() + value.slice(1);
    }
    setFormData({
      ...formData,
      [key]: value
    })
  }

  const handleSignup = (e, formData) => {
    e.preventDefault();
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(formData),
    }
    fetch("/api/users", config)
    .then(r => {
      if (r.ok) return r.json().then(data => {
        setUser(data);
        const savedPath = localStorage.getItem("savedPath");
        localStorage.removeItem("savedPath");
        navigate(savedPath || "/");
      })
      else return r.json().then(data => setErrors(data.errors))
    }).catch(error => console.error("ITS GONNA BE A BUMPY RIDE ==>", error))
  }

  return (
    <Container>
      <SubTitle>Sign Up</SubTitle>
      <Form onSubmit={e => handleSignup(e, formData)}>
      <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="What's your name?"
            value={formData.first_name}
            onChange={handleChange}
            name="first_name"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Create username..."
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
        <Form.Group className="mb-3">
          <Form.Label>Password Confirmation</Form.Label>
          <Form.Control
            type="password"
            placeholder="Re-enter password..."
            value={formData.password_confirmation}
            onChange={handleChange}
            name="password_confirmation"
          />
        </Form.Group>
        <Button type="submit">Create Account</Button>
        <StyledLink to="/login">Already have one?</StyledLink>
      </Form>
      <Spacer />
      {errors.map(err => <Alert key={err} variant="danger">{err}</Alert>)}
      <Spacer />
    </Container>
  )
}

export default Signup;