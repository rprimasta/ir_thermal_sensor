import React, { Component,useRef, useState  } from 'react';
import { Button,Container,Row,Col,Card,FormText, Modal, Alert } from 'react-bootstrap';
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
    
    close = () => {
        this.resolveShow();
        this.setState({ show: false});
    }
  
    show = () => {
      return new Promise((resolve,reject)=>{
          Settings.Load();
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
                <Modal.Title id="contained-modal-title">Edit Recipe</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Alert variant="success">
                    <Alert.Heading>Hey, nice to see you</Alert.Heading>
                    <p>
                        Aww yeah, you successfully read this important alert message. This example
                        text is going to run a bit longer so that you can see how spacing within an
                        alert works with this kind of content.
                    </p>
                    <hr />
                    <p className="mb-0">
                        Whenever you need to, be sure to use margin utilities to keep things nice
                        and tidy.
                    </p>
                </Alert>
                    
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