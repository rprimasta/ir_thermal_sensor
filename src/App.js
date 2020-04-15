import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ModalSettings from './ModalSettings';
import AlertTresshold from './AlertTresshold';
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
      suhu: 33,
      suhu_tresshold:37.5,
      speedoRender: false,
      alert_text:'',
      alert_text_color:'red'
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
      console.log(message);
      if (message.jarak <= this.state.jarak_tresshold){
        if (message.suhu >= this.state.suhu_tresshold){
          this.setState({ suhu: message.suhu}); 
          this.modalAlert.show();
          this.setState({ alert_text: 'Suhu melewati tresshold',alert_text_color: 'red'}); 
        }else{
          this.modalAlert.close();
          this.setState({ alert_text: ''}); 
        }
      }else{
        this.setState({ suhu: 33}); 
         this.setState({ alert_text: 'Mendekat',alert_text_color: 'blue',suhu: 33}); 
      } 
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
        jarak_tresshold:Settings.Data.Treshold_Jarak,
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

    return (
      <div className="App">
         
        <body style={{paddingTop:15,height:'100vh' ,backgroundColor:"#29292A"}}>
          
          
        <ModalSettings ref={r => this.modalSetting = r}  />
        <AlertTresshold ref={r => this.modalAlert = r}  />
        
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
                              <h4 style={{color:this.state.alert_text_color}}>{this.state.alert_text}</h4>
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