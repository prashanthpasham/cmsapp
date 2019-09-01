import React from 'react';
import {Route,Switch,Redirect} from 'react-router-dom';
import Template from './views/Layout/Template';
import Login from './views/Login/Login';
const routes=(
  <Switch>
   <Route path="/" component={Login}/>
   <Route path="/login" component={Login}/>
   <Route path="/welcome" component={Template}/>
   </Switch>
);
export default class App extends React.Component {
constructor(props){
super(props);
}
render(){
  return (<div>
    {this.props.children}
    {routes}
  </div>);
}
}