import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ModalSettings from './ModalSettings';
import { Button,Container,Row,Col,Card,FormText } from 'react-bootstrap';
import windowSize from 'react-window-size';
import Thermometer from 'react-thermometer-component'
import ReactSpeedometer from "react-d3-speedometer";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      showSettingModal:false,
      suhu: 25
    };
  
  }
  
  connect = ()=>{
    const that = this
    this.ws = new WebSocket('ws://localhost:8887/sensor');
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected')
    }

    this.ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      const message = JSON.parse(evt.data)
  
      this.setState(state => ({ suhu: message.suhu})); 
      console.log(message);
    }

    this.ws.onclose = (e) => {
      console.log('disconnected')
      
      // automatically try to reconnect on connection loss
      console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
                setTimeout(function() {
                  that.connect();  
                }, 1000); 
    }
  }
  clickMe = ()=>{
    // this.setState({ suhu: 34}); 
    this.setState(state => ({ suhu: 34})); 
  }
  componentDidMount(){
    this.connect()
  }
  render(){
    return (
      <div className="App">
         
        <body style={{paddingTop:15,height:'100vh' ,backgroundColor:"#29292A"}}>
          
        <ModalSettings modal={this.state.showSettingModal} />
 
        <Container style={{display:'flex', alignItems:'center', justifyContent:'center',flexDirection: 'column', flex:1, height:'100%'}}>
          <Card style={{margin:0, height:'50vh', width:'50vw' ,alignSelf: "center"}}>
            <Card.Header>
              Sensor Suhu Tubuh
              <Button onClick={this.clickMe}  style={{float:'right'}}>aaaa</Button>
              <Button onClick={()=>{this.setState({showSettingModal:true});} } style={{float:'right'}}>Settings</Button>
            </Card.Header>
            <Card.Body>  
                <Container style={{justifyContent:'center'}}>
                            <Row className="justify-content-md-center">
                              <h4>Suhu Badan</h4>
                            </Row>
                            <Row className="justify-content-md-center">
                              <ReactSpeedometer 
                                width={500}
                                minValue={33}
                                maxValue={43}
                                segments={2}
                                value={this.state.suhu}
                                segmentColors={["green", "red"]}
                                customSegmentStops={[33,37.5, 43]}
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