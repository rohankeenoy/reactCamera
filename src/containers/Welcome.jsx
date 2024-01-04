import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../Styles/styles.css';
import { useHistory } from 'react-router-dom';
import green_tree from '../images/green_tree.gif';


const Welcome = () => {
  const history = useHistory();

  const handleLoginClick = () => {
    let path = "/Login"
    history.push(path);
  };

  const handleSignupClick = () => {
    let path = "/SignUp"
    history.push(path);
  };


  return (
    <div className="welcome-container">
      <Container>
        <Row>
          <Col>
            <h1>Welcome to EcoRoute</h1>
            <div className="image-container">
              <img src={green_tree} alt="logo" className="logo" />
            </div>
            <p>Live Greener.</p>
            <p>
              EcoRoute is a social recycling app that allows you to learn about recycling objects and emission data together with your friends.
            </p>
            <p>
              <Button variant="primary" onClick={handleLoginClick}>LOGIN</Button>
              <Button variant="secondary" onClick={handleSignupClick}>SIGNUP</Button>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Welcome;
