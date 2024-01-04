import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { Link, useLocation } from 'react-router-dom';
import { Container, Row, Col,Button } from 'react-bootstrap';
import green_tree from '../images/green_tree.gif';
import axios from 'axios';

const Scanpage = () => {
  const location = useLocation();
  const { name, email } = location.state;
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scannedObject, setScannedObject] = useState('');
  const [searchResults, setSearchResults] = useState('');

console.log(email)

const incrementCounter = () => {
  axios
      .post(`http://localhost:8000/scan`,{"email": email})
      .then((response) => {
        // handle the response from the server
        console.log(response.data);
      })
      .catch((error) => {
        // handle any errors that occur during the request
        console.error(error);
      });
}


  const handleSearch = () => {
    const query = encodeURIComponent(scannedObject);
    axios
      .get(`http://localhost:8000/search?q=${query}`)
      .then((response) => {
        // handle the response from the server
        console.log(response.data);
        setSearchResults(response.data);
        console.log(searchResults);
        incrementCounter();

      })
      .catch((error) => {
        // handle any errors that occur during the request
        console.error(error);
      });
  };



  useEffect(() => {
    const getVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 600, height: 300 },
        });
        const video = videoRef.current;
        video.srcObject = stream;
        video.play();

        const model = await cocoSsd.load();
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.style.zIndex = 1;

        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.font = '16px Arial';

        const drawBoundingBoxes = (ctx, predictions) => {
          // Clear the canvas
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
          // Draw bounding boxes for each prediction
          predictions.forEach(prediction => {
            // Ignore predictions that detect a person
            if (prediction.class === 'person') {
              return;
            }
        
            // Draw the bounding box
            const [x, y, width, height] = prediction.bbox;
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.stroke();
        
            // Add text at the bottom of the bounding box
            ctx.fillStyle = 'white';
            ctx.fillRect(x, y + height, width, 20);
            ctx.fillStyle = 'white';
            ctx.fillText(prediction.class, x + 5, y + height );
            if (prediction.score > 0.5) {
              setScannedObject(prediction.class);
            }
            // Set the scanned object state
            setScannedObject(prediction.class);
          });
        };
        

        const detectObjects = async () => {
          const predictions = await model.detect(video);
          drawBoundingBoxes(ctx, predictions);
          requestAnimationFrame(detectObjects);
        };

        detectObjects();
      } catch (error) {
        console.error(error);
      }
    };

    getVideo();
  }, []);

  return (
    <Container>
  <Row>
    <Col>
      <img src={green_tree} alt="logo" style={{ width: '100px', height: '100px' }} />
    </Col>
    <Col>
      <h1>RecycleRoute</h1>
    </Col>
    <Col className="ml-auto text-center">
      <p style={{ display: 'inline-block', marginLeft: '80px' }}>Trip</p>
      <Link to={{ pathname: '/ScanPage', state: { name, email } }} style={{ display: 'inline-block', marginLeft: '40px' }}>Scan</Link>
      <p style={{ display: 'inline-block', marginLeft: '40px' }}>Home</p>
    </Col>
  </Row>
  <Row>
    <Col className="d-flex justify-content-center">
      <video ref={videoRef} style={{ width: '600px', height: '300px' }} />
      <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'translate(-500%, 0%)',
            zIndex: 1
          }}/>
    </Col>
  </Row>
  <Row>
    <Col>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 315, right: 0, bottom: 150 }} />
    </Col>
  </Row>
  <Row>
    <Col className="d-flex justify-content-center">
      <Button onClick={() => handleSearch(scannedObject)}>Search Recycling for {scannedObject}</Button>
    </Col>
  </Row>
  {searchResults && searchResults.length > 0 ? (
    <>
      <Row style={{marginTop:"40px"}}>
        <Col className="text-center">
          <h4>Search Results for {scannedObject}</h4>

        </Col>
      </Row>
      {searchResults.map(result => (
        <Row key={result.title}style={{marginTop:"30px"}}>
          <Col className="d-flex justify-content-center">
            <a href={result.url} target="_blank">{result.title}</a>
          </Col>
        </Row>
      ))}
    </>
  ) : null}
</Container>


  );
};

export default Scanpage;
