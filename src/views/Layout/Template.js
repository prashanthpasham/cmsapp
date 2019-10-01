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
  const MenuItem = ({match }) => (
    // here's a nested div
    <div>
      {/* here's a nested Route,
          match.url helps us make a relative path */}
      <Route path={match.path} component={match.component} />
    </div>
  )
  
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
          
           { this.state.menus.map((menu,index)=>{
      
		   return (<div>
		    { menu.menus.map((menu1,index)=>{
      
		   return (<div>
		   <Link to={menu1.path}> {menu1.menutitle}</Link>
		    </div>)
        })}

		    </div>)
        })}

         </div>
          </div>
          <div className="p-col-12 p-md-6 p-lg-9">
      
          <Switch>
           
         
       <Route path="/dashboard/management-info" component={OrganizationPortal}/>
        </Switch>
           </div>
            </div>
           </div>
          
        
      
    );
  }
}
