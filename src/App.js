import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button,Container,Row,Col,Card } from 'react-bootstrap';
import windowSize from 'react-window-size';
import Thermometer from 'react-thermometer-component'
import ReactSpeedometer from "react-d3-speedometer";

class App extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className="App">
        <body style={{paddingTop:15,height:'100vh' ,backgroundColor:"#29292A"}}>
        <Container style={{}}>
          <Card style={{margin:10,}}>
            <Card.Header>Sensor Suhu Tubuh</Card.Header>
            <Card.Body> 
                <Container style={{justifyContent:'center'}}>
                            <Row className="justify-content-md-center">
                              <h4>Suhu Badan</h4>
                            </Row>
                            <Row className="justify-content-md-center">
                              <ReactSpeedometer 
                                width={500}
                                minValue={25}
                                maxValue={45}
                                segments={2}
                                value={36}
                                segmentColors={["green", "red"]}
                                customSegmentStops={[25,37.5, 45]}
                              />
                            </Row>
                          {/* <Thermometer
                          theme="light"
                          value="18"
                          max="100"
                          steps="2"
                          format="°C"
                          size="normal"
                          />                                               */}
                </Container>
            </Card.Body>
          </Card>
        </Container>
        </body>
      </div>
    );
  }
}


export default windowSize(App);