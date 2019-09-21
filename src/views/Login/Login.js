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
    var routeTable=[{
      "name":"Portal Access",
      "path":"/dashboard/access-portal",
      "component":"OrganizationAccess"
    },{
      "name":"College Info",
      "path":"/dashboard/management-info",
      "component":"MangementInfo"
    },{
      "name":"Employee",
      "path":"/dashboard/employee-list",
      "component":"EmployeeList"
    }];
    this.state = {
      username: "",
      password: "",
      show: true,
      routes:routeTable
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
      var res=JSON.stringify(data);
      alert("res>>"+res);
      if(Object.keys(res).length>0){
        if(res.error!=undefined && (res.error ||   res.error.length>0)){
            if(res.error==="Invalid Credentails"){
              alert(res.error); 
            }
        }else{
          localStorage.setItem("token",res.token);
          this.props.history.push('/dashboard');
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


