import React from 'react';
import {Menubar} from 'primereact/menubar';
import {Button} from 'primereact/button';
import './Template.css';
import {Link,Switch,Route} from 'react-router-dom';
import OrganizationAccess from '../OrganizationAcess/OrganizationPortal';
import 'primeflex/primeflex.css';
const items=[{
  label:'CMS App',
  icon:''}];
export default class Template extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      visibleCustomToolbar:true,
      menus:[]
    };
  }
  componentDidMount(){
   
  }
  render() {
   
    return (
      <div>
      <div className="p-grid">
        <div className="p-col-12 p-md-12 p-lg-12" >
        
          <Menubar model={items} style={{backgroundColor:'#1976d2',color:'white'}}>
           
            <Button  label="Logout" icon="pi pi-power-off" style={{ marginLeft: 4 }}  className="p-button-danger"/>
          </Menubar>
          </div>
          </div>
         
          <div className="p-grid">
          <div className="p-col-12 p-md-6 p-lg-3">
         <div id="layout-sidebar">
           <br/>
           
            <Link to="/dashboard/accessportal" style={{padding:'15px'}}>Organization Portal</Link>
         </div>
          </div>
          <div className="p-col-12 p-md-6 p-lg-9">
      
          <Switch>
        <Route path="/dashboard/accessportal" component={OrganizationAccess}/>
        </Switch>
           </div>
            </div>
           </div>
          
        
      
    );
  }
}