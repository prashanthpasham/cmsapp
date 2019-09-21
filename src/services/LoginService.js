import React from 'react';
import axios from 'axios';
var server="http://localhost:8084/";
var isAuthenticated=false;
const LoginService = {
    //isAuthenticated: true,
    isLoggedIn(){
      if(localStorage.getItem("username")==undefined){
        isAuthenticated=false;
      }else
      isAuthenticated=true;
    },
    authenticate(loginJson) {
      //this.isAuthenticated = true
      alert("loginJson>"+loginJson);
    return axios({
      url:server+"login/authenticate",
      method:'post',
      data:JSON.stringify(loginJson),
       headers: {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' }
     // config: { headers: {'Content-Type': 'application/json' }}
     }) .then(function (response) {
      //handle success
     return response.data;
  })
  .catch(function (response) {
      //handle error
      console.log(response);
  })
    },
    signout(username) {
      this.isAuthenticated = false
      localStorage.removeItem("username");
    }
  }
  
export default LoginService;