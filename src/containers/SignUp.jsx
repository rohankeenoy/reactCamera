import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import green_tree from '../images/green_tree.gif';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/styles.css';
import { useHistory } from 'react-router-dom';
import axios from 'axios';


const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const history = useHistory();

    const handleLoginClick = () => {
    let path = "/home"
    history.push(path);
  };


    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
          name: name,
          email: email,
          password: password,
          recyclingObjects: 0,
          totalTrips: 0,
        };
        axios.post('http://localhost:8000/signup', formData)
          .then((response) => {
            // handle successful response
            handleLoginClick();
            console.log(response.data);

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
            <h2 className="title">Sign Up</h2>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" required onChange={(e) => setName(e.target.value)} />
            </Form.Group>


            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" required onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>

            <Button variant="primary" type="submit">
              Sign Up
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default SignUp;
