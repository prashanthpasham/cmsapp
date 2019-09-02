import React from 'react';
import {Route,Switch,Redirect} from 'react-router-dom';
import Template from './views/Layout/Template';
import Login from './views/Login/Login';
import LoginService from './services/LoginService';
import OrganizationAccess from './views/OrganizationAcess/OrganizationPortal';
const PrivateRoute = ({ component: Component, ...rest }) => (
<Route {...rest} render={(props) => (
   LoginService.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
  );
const routes=(
  <Switch>
   <Route exact path="/" component={Login}/>
   <Route path="/login" component={Login}/>
 
   <PrivateRoute path="/dashboard" component={Template} >
    
     </PrivateRoute>
     <Route path="/dashboard/accessportal" component={OrganizationAccess}/>
   </Switch>
);
export default class App extends React.Component {
constructor(props){
super(props);

}
render(){
  return (<div>
    {routes}
  </div>);
}
}