import React from 'react';
import {Menubar} from 'primereact/menubar';
import {Button} from 'primereact/button';
import './Template.css';
import {BrowserRouter as Router,Link,Switch,Route,Redirect} from 'react-router-dom';
import OrganizationPortal from '../OrganizationAcess/OrganizationPortal';
import 'primeflex/primeflex.css';
import LoginService from '../../services/LoginService';
const items=[{
  label:'CMS App',
  icon:''}];
  const PrivateRoute = ({ component: Component, ...rest }) => (
 
    <Route {...rest} render={(props) => (
    //  alert(LoginService.isLoggedIn()),
       LoginService.isLoggedIn() === true
          ? <Component {...props} />
          : <Redirect to='/login' />
      )} />
      );
  const MenuItem = ({ link }) => (
    // here's a nested div
          
      <Route path={link.path} component={link.component} >  </Route>
    
  );
 
export default class Template extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      visibleCustomToolbar:true,
      menus:[]
    };
  }
  componentDidMount(){
    if(localStorage.getItem("menus")!=undefined)
    this.setState({menus:JSON.parse(localStorage.getItem("menus"))});
  
  }
  signout(){
    LoginService.signout();
    window.location.href='.#/login';
  }
  render() {
   
    return (
      <div>
       
      <div className="p-grid">
        <div className="p-col-12 p-md-12 p-lg-12" >
        
          <Menubar model={items} style={{backgroundColor:'#1976d2',color:'white'}}>
           
            <Button  label="Logout" icon="pi pi-power-off" style={{ marginLeft: 4 }}  className="p-button-danger"
            onClick={this.signout}/>
          </Menubar>
          </div>
          </div>
         
          <div className="p-grid">
          <div className="p-col-12 p-md-6 p-lg-3">
         <div id="layout-sidebar">
          
		  
		 
					  
		  
           { this.state.menus.map((menu,index)=>{
      
		   return (<div key={index}>
		    { menu.menus.map((menu1,index1)=>{
      
		   return (<div key={index1}>
		   <Link to={menu1.path}> {menu1.menutitle}</Link>
		    </div>)
        })}

		    </div>)
        })}

         </div>
          </div>
          <div className="p-col-12 p-md-6 p-lg-9">
      
          <switch>
          <Route path="/dashboard/management-info" component={OrganizationPortal}/>
          </switch>
           </div>
            </div>
           </div>
          
        
      
    );
  }
}
