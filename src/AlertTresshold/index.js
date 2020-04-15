import React, { Component,useRef, useState  } from 'react';
import { Button,Container,Row,Col,Card,FormText, Modal, Alert } from 'react-bootstrap';
export default class AlertTresshold extends React.Component{
    constructor(props){
        super(props);
        this.state = { 
            show: false
        }; 
    }
    
    close = () => {
       
        this.setState({ show: false});
    }
  
    show = (msg,msg2, variant) => {

      return new Promise((resolve,reject)=>{
      
        this.setState({ 
            show: true,
            msg:msg,
            msg2:msg2,
            variant:variant
        });
          this.resolveShow = resolve;
      });
     
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
                <Modal.Title id="contained-modal-title" style={{textAlign:"center"}}>Alert !!!</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Alert variant={this.state.variant}>
                    <Alert.Heading style={{textAlign:"center"}}>{this.state.msg}<br></br>{this.state.msg2}</Alert.Heading>
                </Alert>
                    
              </Modal.Body>
              <Modal.Footer>
            
              </Modal.Footer>
            </Modal>
          </div>
        );
    }
}