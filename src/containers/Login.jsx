import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import green_tree from '../images/green_tree.gif';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/styles.css';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const history = useHistory();

  const handleLoginClick = () => {
    history.push({
      pathname: "/home",
      state: {
        name: name,
        email: email,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      email: email,
      password: password,
    };
    axios.post('http://localhost:8000/login', formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        // handle successful response
        const data = JSON.parse(JSON.stringify(response.data))
        console.log(data)
        setName(data.name);
        setEmail(data.email);
        handleLoginClick();
      })
      .catch((error) => {
        // handle error response
        console.error(error);
      });
  };

  return (
    <div className="text-center" style={{textAlign: "center", height: "100vh"}}>
      <h1>EcoRoute</h1>
      <Container>
        <Row className="justify-content-center">
          <Col xs={6}>
            <img src={green_tree} alt="logo"/>
          </Col>
          <Col xs={6}>
            <Form onSubmit={handleSubmit}>
              <h2 className="title">Login</h2>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" required onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Button variant="primary" type="submit">
                Login
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
