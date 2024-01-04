import React, {useState, useEffect} from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../Styles/styles.css';
import { useHistory, useLocation, Link } from 'react-router-dom'; // import useLocation and Link
import green_tree from '../images/green_tree.gif';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
    const history = useHistory();
    const location = useLocation();
    const {name, email} = location.state;
    const [scannedItemCount, setScannedItemCount] = useState(0);
    console.log(email)
    
    const handleClick = (page) => {
        let path = '';
        if (page === 'scan') {
          path = '/scan';
        } else if (page === 'trip') {
          path = '/trip';
        }
      
        history.push({
          pathname: path,
          state: {
            name: name,
            email: email,
          },
        });
      };

      
      useEffect(() => {
        axios
          .get(`http://localhost:8000/scans?email=${email}`)
          .then((response) => {
            console.log(response.data);
            setScannedItemCount(response.data.totalScans);
          })
          .catch((error) => {
            console.error(error);
          });
      }, [email]);
      
      
      


    return(
        <Container>
            <Row>
                <Col>
                <img src={green_tree} alt="logo" style={{ width: '100px', height: '100px' }} />
                </Col>
                <Col>
                <h1>RecycleRoute</h1>
                </Col>
                <Col className="ml-auto text-center">
            <button style={{ display: 'inline-block', marginLeft: '40px' }} onClick={() => handleClick('trip')}>Trip</button>
            <button style={{ display: 'inline-block', marginLeft: '40px' }} onClick={() => handleClick('scan')}>Scan</button>
            <p style={{ display: 'inline-block', marginLeft: '40px' }}>Home</p>
            </Col>

            </Row>
            <Row className="text-center"><p>Welcome {email}</p></Row>
            <Row className="text-center">
                <Col className="mx-auto">Items Scanned: {scannedItemCount}</Col>
                <Col className="mx-auto">Emissions:</Col>
                <Col className="mx-auto"> Your Ecosystem </Col>
            </Row>
        </Container>
    );
};

export default HomePage;
