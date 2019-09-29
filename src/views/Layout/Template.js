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
  const MenuItem = ({ link:match }) => (
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
          
           { this.state.menus.map(menu=>{
           // console.log("link>>"+JSON.stringify(menu))
          menu.menus.map(link=>{
         // console.log("LINK>>"+JSON.stringify(link))
       return <Link to={link.path} style={{padding:'15px'}}>{link.menutitle}</Link>
          })
        })}

         </div>
          </div>
          <div className="p-col-12 p-md-6 p-lg-9">
      
          <Switch>
           
          { this.state.menus.map(menu=>{
            console.log("link>>"+JSON.stringify(menu))
          menu.menus.map(link=>{
          //console.log("link>>"+JSON.stringify(link))
         return <MenuItem link={link}/>
          })
        })}
        
        </Switch>
           </div>
            </div>
           </div>
          
        
      
    );
  }
}