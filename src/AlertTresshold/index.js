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
        this.resolveShow();
        this.setState({ show: false});
    }
  
    show = () => {
      return new Promise((resolve,reject)=>{
      
        this.setState({ 
            show: true
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
                <Modal.Title id="contained-modal-title">Alert !!!</Modal.Title>
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
            
              </Modal.Footer>
            </Modal>
          </div>
        );
    }
}