import React, { Component } from 'react';
import './App.css';
import ModalSettings from './ModalSettings';
import AlertTresshold from './AlertTresshold';
import { Button,Container,Row,Col,Card,FormText, Spinner, Alert } from 'react-bootstrap';
import windowSize from 'react-window-size';
import Thermometer from 'react-thermometer-component'
import ReactSpeedometer from "react-d3-speedometer";
import Settings from './Config';
import { IoMdWarning,IoMdCheckmarkCircleOutline } from 'react-icons/io';
import logo from './logo.png';
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
      flag_measuring:1,
      suhu_result:'-'
    };
    Settings.Load();
    // that.sendLamp(1);
               
  
  }
  alert_show = false
  timer_dist = 0
  average = (elmt)=>{
    var total = 0;
    for(var i = 0; i < elmt.length; i++) {
        total += elmt[i];
    }
    var avg = total / elmt.length;
    return avg;
    // var av = elmt => elmt.reduce( ( p, c ) => p + c, 0 ) / elmt.length;
    // return av;
    // var sum = 0;
    // for( var i = 0; i < elmt.length; i++ ){
    //     sum += parseInt( elmt[i], 10 ); //don't forget to add the base
    // }

    // var avg = sum/elmt.length;
    // return avg;
  }
  last_flag = 0;
  toRestart =  null;
  sendLamp = (flag)=>{
    if (flag == this.last_flag) return;
    this.last_flag = flag;
    this.ws.send(JSON.stringify({flag_lamp:flag}));
  }
  connect = ()=>{
    this.sampling_suhu = [];
    const that = this
    this.ws = new WebSocket('ws://localhost:8887/sensor');
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected');
      // this.ws.send(JSON.stringify({flag_lamp:1}));
    }

    this.ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      const message = JSON.parse(evt.data)
     
      const that = this;
      let sampling_length = 10;
      if (message.jarak <= this.state.masuk_tresshold){
        this.timer_dist = 0;
        console.log(message);
        this.sampling_suhu.push(message.suhu);
        if (this.sampling_suhu.length >= sampling_length){     
            //pengukuran selesai, data akan dicompare 
            
           // var dataCompare = this.sampling_suhu[this.sampling_suhu.length-1];
            var dataCompare = that.average(this.sampling_suhu);
          
            if (dataCompare >= Settings.Data.Treshold_Suhu){
              //SUHU TIDAK NORMAL
              if (this.alert_show == false){
                this.alert_show = true;
                setTimeout(function() {
                  that.sendLamp(4);
                  that.setState({suhu_result:dataCompare.toFixed(2) + '°C',suhu: dataCompare,flag_measuring:4 }); 
                  //that.modalAlert.show("Suhu tidak normal !!!","Suhu Tubuh " + dataCompare+"°",'danger'); 
                }, 300);
              }
              
            }else{ 
              //SUHU NORMAL 
              
              if (this.alert_show == false){
                this.alert_show = true;
                setTimeout(function() {
                  that.sendLamp(3);
                  that.setState({suhu_result:dataCompare.toFixed(2) + '°C', suhu: dataCompare,flag_measuring:3 }); 
                 }, 300); 
              } 
            
            } 
        }else{
          //sedang mengukur
          // setTimeout(function() {that.ws.send(JSON.stringify({flag_lamp:2}));}, 10);
          this.sendLamp(2);
          this.setState({ flag_measuring: 2});  
        }
      }else{ 
        
        // if (this.sampling_suhu.length >= sampling_length){
          //objek baru saja keluar
            if (message.jarak >= Settings.Data.Treshold_Keluar && this.alert_show == true){
              that.timer_dist++;
              if (this.toRestart == null){
                this.toRestart = setTimeout(function() {
                  if (that.timer_dist >= 0){
                    that.sendLamp(1);
                    
                    that.toRestart = null;
                    that.timer_dist++;
                    that.sampling_suhu = [];
                    that.alert_show = false;
                    that.setState({suhu_result:'-', suhu: 0,flag_measuring: 1});  
                  }
               }, 2000); 
              }
               
            
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
        speedoRender:true,
        suhu_result:'-', 
        suhu: 0,
        flag_measuring: 1
      });
      that.toRestart = null;
      that.sampling_suhu = [];
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
          <IoMdWarning style={{fontSize:'2em'}}/> 

          </h4>
      );
    }else if (this.state.flag_measuring == 4){
      return (
      <h4 style={{color:'red', textAlign:'center'}}>
        Suhu Tidak Normal
        <br/>
      <IoMdWarning style={{fontSize:'2em'}}/> 

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
          <Card style={{margin:0, height:'85vh', width:'65vw' ,alignSelf: "center"}}>
            <Card.Header>
              Sensor Suhu Tubuh
            
              <Button onClick={this.openModalSetting } style={{float:'right'}}>Settings</Button>
            </Card.Header> 
            <Card.Body>  
                <Container style={{justifyContent:'center',display:'flex', alignItems:'center',flexDirection: 'column'}}>
                  <img style={{ width:'15vw', height:'22vh', position:"absolute",left:15, top:75}}  src={logo} alt="Logo" />
                  <Row className="justify-content-md-center" style={{height:80}}>
                    {
                        this.showMessage()    
                    } 
                  </Row>
                  <Row className="justify-content-md-center">
                    <Col xs={12} style={{justifyContent:'center',display:'flex',alignItems:'center',flexDirection: 'column'}}>
                      <ReactSpeedometer 
                        style={{textAlign:'center'}}
                        width={500}
                        minValue={0}
                        maxValue={50}
                        segments={2}
                        currentValueText={' '}
                        value={this.state.suhu}
                        segmentColors={["green", "red"]}
                        forceRender={this.state.speedoRender}
                        customSegmentStops={[0,this.state.suhu_tresshold, 50]}
                      />
                        <h4 style={{fontSize:'3em', textAlign:'center'}}>{this.state.suhu_result}</h4>
                    </Col>
                  </Row>
                            
                        
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