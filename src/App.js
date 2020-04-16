import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ModalSettings from './ModalSettings';
import AlertTresshold from './AlertTresshold';
import { Button,Container,Row,Col,Card,FormText, Spinner, Alert } from 'react-bootstrap';
import windowSize from 'react-window-size';
import Thermometer from 'react-thermometer-component'
import ReactSpeedometer from "react-d3-speedometer";
import Settings from './Config';
import { IoMdWarning,IoMdCheckmarkCircleOutline } from 'react-icons/io';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      showSettingModal:false,
      suhu: 33,
      suhu_tresshold:37.5,
      speedoRender: false,
      alert_text:'',
      alert_text_color:'red',
      flag_measuring:1
    };
    Settings.Load();
    
  }
  alert_show = false
  average = (elmt)=>{
    var sum = 0;
    for( var i = 0; i < elmt.length; i++ ){
        sum += parseInt( elmt[i], 10 ); //don't forget to add the base
    }

    var avg = sum/elmt.length;
    return avg;
  }
  connect = ()=>{
    this.sampling_suhu = [];
    const that = this
    this.ws = new WebSocket('ws://localhost:8887/sensor');
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected')
    }

    this.ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      const message = JSON.parse(evt.data)
     // console.log(message);
      const that = this;
      let sampling_length = 4;
      if (message.jarak <= this.state.masuk_tresshold){
      
        this.sampling_suhu.push(message.suhu);
        if (this.sampling_suhu.length >= sampling_length){     
            //pengukuran selesai, data akan dicompare 
            var dataCompare = this.sampling_suhu[this.sampling_suhu.length-1];
          
            if (dataCompare >= Settings.Data.Treshold_Suhu){
              //SUHU TIDAK NORMAL
              if (this.alert_show == false){
              
                this.alert_show = true;
                setTimeout(function() {
                  that.setState({suhu: dataCompare,flag_measuring:4 }); 
                  //that.modalAlert.show("Suhu tidak normal !!!","Suhu Tubuh " + dataCompare+"°",'danger'); 
                }, 1000);
              }
              
            }else{ 
              //SUHU NORMAL 
              
              if (this.alert_show == false){
                this.alert_show = true;
                setTimeout(function() {
                  that.setState({suhu: dataCompare,flag_measuring:3 }); 
                 }, 1000); 
              } 
            
            }
        }else{
          //sedang mengukur
          this.setState({ flag_measuring: 2});  
        }
      }else{ 
        
        // if (this.sampling_suhu.length >= sampling_length){
          //objek baru saja keluar
            if (message.jarak >= Settings.Data.Treshold_Keluar){
              this.sampling_suhu = [];
              this.alert_show = false;
              this.setState({ suhu: 33,flag_measuring: 1});  
            }
        // }else{
        //   //belum ada objek untuk di kompare
        // }

       
        //  this.setState({ alert_text: 'Mendekat',alert_text_color: 'blue',suhu: 33}); 
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
        masuk_tresshold:Settings.Data.Treshold_Masuk,
        keluar_tresshold:Settings.Data.Treshold_Keluar,
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
  showMessage=()=>{
    if (this.state.flag_measuring == 2){
        return (
        <h4 style={{textAlign:'center'}}>Please Wait<br></br>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </h4> 
        );
    }else if (this.state.flag_measuring == 3){
      return (
          <h4 style={{color:'green', textAlign:'center'}}>
            Suhu Normal
            <br/>
          <IoMdWarning style={{fontSize:'4em'}}/> 

          </h4>
      );
    }else if (this.state.flag_measuring == 4){
      return (
      <h4 style={{color:'red', textAlign:'center'}}>
        Suhu Tidak Normal
        <br/>
      <IoMdWarning style={{fontSize:'4em'}}/> 

      </h4>
      );
    }
  }
  render(){

    return (
      <div className="App">
         
        <body style={{paddingTop:15,height:'100vh' ,backgroundColor:"#29292A"}}>
          
          
        <ModalSettings ref={r => this.modalSetting = r}  />
        <AlertTresshold ref={r => this.modalAlert = r}  />
        
        <Container style={{display:'flex', alignItems:'center', justifyContent:'center',flexDirection: 'column', flex:1, height:'100%'}}>
          <Card style={{margin:0, height:'70vh', width:'65vw' ,alignSelf: "center"}}>
            <Card.Header>
              Sensor Suhu Tubuh
            
              <Button onClick={this.openModalSetting } style={{float:'right'}}>Settings</Button>
            </Card.Header>
            <Card.Body>  
                <Container style={{justifyContent:'center',display:'flex', alignItems:'center',flexDirection: 'column'}}>
                            <Row className="justify-content-md-center">
                              {
                                  this.showMessage()    
                              }
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
                            {/* <Row className="justify-content-center">
                              <h4 style={{color:this.state.alert_text_color}}>{this.state.alert_text}</h4>
                            </Row>  */}
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