import React, { Component,useRef, useState  } from 'react';
import { Button,Container,Row,Col,Card,FormText, Modal } from 'react-bootstrap';
import windowSize from 'react-window-size';
import Thermometer from 'react-thermometer-component'
import ReactSpeedometer from "react-d3-speedometer";
import Settings from '../Config'
export default class ModalSettings extends React.Component{
    constructor(props){
        super(props);

        
        this.state = { 
            show: false
        };
        
    }
    
    // componentWillReceiveProps(nextProps){
    //   if(this.state.show!==nextProps.modal){
    //     this.setState({show: nextProps.modal})
    //   }
    // }
    close = () => this.setState({ show: false});
  
    show = () => {
      return new Promise((resolve,reject)=>{
          Settings.Load();
      
          this.setState({ 
              show: true,
              th_suhu:Settings.Data.Treshold_Suhu,
              th_masuk:Settings.Data.Treshold_Masuk,
              th_keluar:Settings.Data.Treshold_Keluar
          });
          this.resolveShow = resolve;
      });
     
    }
    save= ()=>{
        Settings.Data.Treshold_Suhu = this.state.th_suhu;
        Settings.Data.Treshold_Masuk = this.state.th_masuk;
        Settings.Data.Treshold_Keluar = this.state.th_keluar;
        Settings.Save();
        this.resolveShow();
        this.close();
       
    }
    render() {
        return (
            <div className="modal-container">
            <Modal
              show={this.state.show}

              onHide={this.close}
              aria-labelledby="contained-modal-title"
            > 
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title">Edit Recipe</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <Row>

                      <Col xs={3}>
                        <label>Tresshold Suhu:</label>
                        <input type="number" class="form-control" step="0.1" value={this.state.th_suhu}  onChange={e => this.setState({th_suhu:e.target.value})}></input>
                      </Col>
                      <Col xs={3}>
                        <label>Tresshold Masuk:</label>
                        <input type="number" class="form-control" step="0.1" value={this.state.th_masuk}  onChange={e => this.setState({th_masuk:e.target.value})}></input>
                      </Col>
                      <Col xs={3}>
                        <label>Tresshold Keluar:</label>
                        <input type="number" class="form-control" step="0.1" value={this.state.th_keluar}  onChange={e => this.setState({th_keluar:e.target.value})}></input>
                      </Col>
                  </Row>
                    
              </Modal.Body>
              <Modal.Footer>
                <Button bsStyle="primary" onClick={this.save}>Save</Button>
                <Button onClick={this.close}>Close</Button>
              </Modal.Footer>
            </Modal>
          </div>
        );
    }
}