import React from 'react';
import { Card } from 'primereact/card';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './Login.css';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import Template from '../Layout/Template';
import {Route,Switch,Redirect} from 'react-router-dom';
import LoginService from '../../services/LoginService'; 
import OrganizationAccess from '../OrganizationAcess/OrganizationPortal';
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      username: "",
      password: "",
      show: true,
     
    };
    this.enableLogin=this.enableLogin.bind(this);
    this.validateLogin=this.validateLogin.bind(this);
  }
  async enableLogin(key,value) {
   await this.setState({[key]:value});
    //console.log(this.state);
    if (this.state.username == undefined || this.state.username.trim().length ==0
      || this.state.password == undefined || this.state.password.length ==0) {
      this.setState({ show: true });
    } else {
      this.setState({ show: false });
    }
  }
  validateLogin(){
    LoginService.authenticate({'username':this.state.username,'password':this.state.password}).then(data=>{
      //var res=JSON.stringify(data);
     // alert("res>>"+res);
      if(Object.keys(data).length>0){
        if(data.error!=undefined && (data.error ||   data.error.length>0)){
           
              alert(data.error); 
            
        }else{
          //alert("token>>"+res);
          localStorage.setItem("username",data.username);
          localStorage.setItem("token",data.token);
          //alert("lll>"+localStorage.getItem("token"));
          LoginService.menusService().then(menus=>{
            localStorage.setItem("menus",JSON.stringify(menus));
           
            this.props.history.push('/dashboard');
          });
         // 
        }
      }
    });
     
    
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="p-grid">
            
            <div className="p-col-12 p-md-12 p-lg-12">
              <Card title="CMS Login" >
                <span className="p-float-label">
                  <InputText id="in" value={this.state.username} onChange={(e) => this.enableLogin('username', e.target.value) } />
                  <label htmlFor="in">Username</label>
                </span>
                <br />

                <span className="p-float-label">
                  <Password id="pwd" feedback={false} value={this.state.password} onChange={(e) =>this.enableLogin('password', e.target.value) } />
                  <label htmlFor="pwd">Password</label>
                </span>
                <br />
                <Button label="Login" onClick={()=>this.validateLogin()} disabled={this.state.show} className="p-button-primary" />
              </Card>




            </div>

          </div>
        </header>
       
  
      </div>
    );
  }
}


