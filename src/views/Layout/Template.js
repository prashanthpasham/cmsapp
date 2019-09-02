import React from 'react';
import {Menubar} from 'primereact/menubar';
import {Button} from 'primereact/button';
import './Template.css';

const items=[{
  label:'CMS App',
  icon:''}];
export default class Template extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      visibleCustomToolbar:true
    };
  }
  render() {
   
    return (
      <div class="p-grid template-header">
        <div class="p-col-12 p-md-12 p-lg-12" >
        
          <Menubar model={items} style={{backgroundColor:'#1976d2',color:'white'}}>
           
            <Button  label="Logout" icon="pi pi-power-off" style={{ marginLeft: 4 }}  className="p-button-danger"/>
          </Menubar>
          <div id="layout-sidebar">

          </div>

        </div>
      </div>
    );
  }
}