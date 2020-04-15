import React, { Component,useRef, useState  } from 'react';
import { Button,Container,Row,Col,Card,FormText, Modal } from 'react-bootstrap';
import windowSize from 'react-window-size';
import Thermometer from 'react-thermometer-component'
import ReactSpeedometer from "react-d3-speedometer";
import Settings from '../Config'
export default class ModalSettings extends React.Component{
    constructor(props){
        super(props);
        Settings.Load();
        
        this.state = { 
            show: props.show, 
            tresshold:Settings.Data.Treshold_Suhu
        };
        
    }
    
    componentWillReceiveProps(nextProps){
        if(this.state.show!==nextProps.modal){
        this.setState({show: nextProps.modal})
      }
    }
    close = () => this.setState({ show: false});
    save= ()=>{
        Settings.Save();
        this.close();
    }
    onTressholdChange = function(v){
         
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

                            <label>Tresshold:</label>
                            <input type="number" class="form-control" step="0.1" value={this.state.tresshold}  onChange={e => this.setState({tresshold:e.target.value})}></input>
                        
                           
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