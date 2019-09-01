import React from 'react';
import logo from './logo.svg';
import { Card } from 'primereact/card';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      show: true
    };
    this.enableLogin=this.enableLogin.bind(this);
  }
  async enableLogin(key,value) {
   await this.setState({[key]:value});
    console.log(this.state);
    if (this.state.username == undefined || this.state.username.trim().length ==0
      || this.state.password == undefined || this.state.password.length ==0) {
      this.setState({ show: true });
    } else {
      this.setState({ show: false });
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="p-grid">
            <div className="p-col-12 p-md-4 p-lg-3"></div>
            <div className="p-col-12 p-md-8 p-lg-6">
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
                <Button label="Login" disabled={this.state.show} className="p-button-primary" />
              </Card>




            </div>

          </div>
        </header>
      </div>
    );
  }
}

export default App;
