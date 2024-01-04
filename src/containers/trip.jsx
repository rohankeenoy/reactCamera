import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import '../Styles/styles.css';
import green_tree from '../images/green_tree.gif';
import { useHistory, useLocation, Link } from 'react-router-dom'; // import useLocation and Link
import 'bootstrap/dist/css/bootstrap.min.css';
 <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"></link>


mapboxgl.accessToken = 'pk.eyJ1Ijoicm9oYW5rZWVub3kiLCJhIjoiY2xnaGx2Z21zMG1wMzNubmQ1bnoxbzcyZiJ9.P7ihp_2_LId3kbFB_pYnog';


const Trip = () => {
    
    const location = useLocation();
    const {name, email} = location.state;
    const history = useHistory();
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

  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  const [distance, setDistance] = useState(null);
  const [make, setMake] = useState(null);
  const [model, setModel] = useState(null);
  const [year, setYear] = useState(null);

  useEffect(() => {
    if (map) {
      const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'imperial',
        profile: 'mapbox/driving-traffic',
        interactive: false, // set interactive to false to disable the popup for driving directions
      });

      directions.on('route', (e) => {
        if (e.route.length > 0) {
          const routeDistance = e.route[0].distance * 0.000621371;
          setDistance(routeDistance.toFixed(2));
        } else {
          setDistance(null);
        }
      });

      map.addControl(directions, 'top-left');
    }
  }, [map]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-96, 37.8],
      zoom: 3,
    });

    setMap(map);

    return () => {
      map.remove();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const startAddress = e.target.elements.startAddress.value;
    const endAddress = e.target.elements.endAddress.value;
  
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${startAddress}.json?access_token=${mapboxgl.accessToken}&limit=1`
    )
      .then((res) => res.json())
      .then((data) => {
        const startCoords = data.features[0].geometry.coordinates;
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${endAddress}.json?access_token=${mapboxgl.accessToken}&limit=1`
        )
          .then((res) => res.json())
          .then((data) => {
            const endCoords = data.features[0].geometry.coordinates;
  
            map.flyTo({
              center: startCoords,
              zoom: 13,
            });
  
            const directions = new MapboxDirections({
              accessToken: mapboxgl.accessToken,
              unit: 'metric',
              profile: 'mapbox/driving-traffic',
              interactive: false, // disable the directions popup
              waypoints: [
                { coordinates: startCoords },
                { coordinates: endCoords },
              ],
            });
  
            directions.on('route', (e) => {
              if (e.route.length > 0) {
                const routeDistance = e.route[0].distance / 1000;
                setDistance(routeDistance.toFixed(2));
              } else {
                setDistance(null);
              }
            });
  
            map.addControl('');
            
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
  
        return(
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div>
                    <img src={green_tree} alt="logo" style={{ width: '100px', height: '100px' }} />
                    </div>
                    <div>
                    <h1>RecycleRoute</h1>
                    </div>
                    <div className="ml-auto text-center">
                    <button style={{ display: 'inline-block', marginLeft: '40px' }} onClick={() => handleClick('trip')}>Trip</button>
                    <button style={{ display: 'inline-block', marginLeft: '40px' }} onClick={() => handleClick('scan')}>Scan</button>
                    <p style={{ display: 'inline-block', marginLeft: '40px' }}>Home</p>
                    </div>
                </div>
                <p> Plan a trip, arrive at your destination, and compare carbon emissions. </p>
                


                <Form onSubmit={handleSubmit}>
  <h2 className="title">Car Information</h2>
  <Form.Group controlId="make">
    <Form.Label>Make</Form.Label>
    <Form.Control type="text" placeholder="Enter make" required onChange={(e) => setMake(e.target.value)} />
  </Form.Group>
  <Form.Group controlId="model">
    <Form.Label>Model</Form.Label>
    <Form.Control type="text" placeholder="Enter model" required onChange={(e) => setModel(e.target.value)} />
  </Form.Group>
  <Form.Group controlId="year">
    <Form.Label>Year</Form.Label>
    <Form.Control type="number" placeholder="Enter year" required onChange={(e) => setYear(e.target.value)} />
  </Form.Group>
  <Button variant="primary" type="submit">
    Submit
  </Button>
</Form>


                <div style={{ width: '100%', height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <div style={{ marginRight: '0px', marginBottom: '50px', width: '600px', height: '300px', marginTop: '50px' }}>
                                {distance && <p>Distance: {distance} miles</p>}
                                <div ref={mapContainer} className="map-container" />
                            </div>
                </div>
                <div style = {{display:'flex', alignItems: 'right'}}> 
                    {distance && <p>Total distance: {distance} miles</p>}
                    <p>Total Emissions: </p>
                </div>
            </div>



                
        );
};

export default Trip;