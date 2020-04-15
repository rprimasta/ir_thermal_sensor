import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ModalSettings from './ModalSettings';
import { Button,Container,Row,Col,Card,FormText } from 'react-bootstrap';
import windowSize from 'react-window-size';
import Thermometer from 'react-thermometer-component'
import ReactSpeedometer from "react-d3-speedometer";
import Settings from './Config';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      showSettingModal:false,
      suhu: 25,
      suhu_tresshold:37.5,
      speedoRender: false
    };
    Settings.Load();
    
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
      if (message.suhu >= this.state.suhu_tresshold){
         this.setState({ alert_text: 'Suhu melewati tresshold'}); 
      }else{
        this.setState({ alert_text: ''}); 
      }
      this.setState({ suhu: message.suhu}); 
      // console.log(message);
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
  loadToState = ()=>{
    const that = this;
    this.setState(
      {
        suhu_tresshold:Settings.Data.Treshold_Suhu,
        speedoRender:true
      });
      setTimeout(function() {that.setState({speedoRender:false}); }, 1);
     
  }
  onModalSaved = ()=>{
  
  
  }
  componentDidMount(){
    this.connect();
    this.loadToState();
  
  }
  openModalSetting = ()=>{
    this.modalSetting.show().then(()=>{
      this.loadToState();
    })
  }
  render(){
    console.log(this.state.suhu_tresshold);
    return (
      <div className="App">
         
        <body style={{paddingTop:15,height:'100vh' ,backgroundColor:"#29292A"}}>
          
          
        <ModalSettings ref={r => this.modalSetting = r}  />
 
        <Container style={{display:'flex', alignItems:'center', justifyContent:'center',flexDirection: 'column', flex:1, height:'100%'}}>
          <Card style={{margin:0, height:'50vh', width:'50vw' ,alignSelf: "center"}}>
            <Card.Header>
              Sensor Suhu Tubuh
            
              <Button onClick={this.openModalSetting } style={{float:'right'}}>Settings</Button>
            </Card.Header>
            <Card.Body>  
                <Container style={{justifyContent:'center'}}>
                            <Row className="justify-content-md-center">
                            <h4>Suhu Badan: {this.state.suhu}°</h4>
                            </Row>
                            <Row className="justify-content-md-center">
                              <ReactSpeedometer 
                                width={500}
                                minValue={33}
                                maxValue={43}
                                segments={2}
                                value={this.state.suhu}
                                segmentColors={["green", "red"]}
                                forceRender={this.state.speedoRender}
                                customSegmentStops={[33,this.state.suhu_tresshold, 43]}
                              />
                            </Row>
                            <Row className="justify-content-center">
                              <h4 style={{color:'red'}}>{this.state.alert_text}</h4>
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