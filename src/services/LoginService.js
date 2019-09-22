import React from 'react';
import axios from 'axios';
var server="http://localhost:8084/";
var isAuthenticated=false;
const routeTable=[{
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
const LoginService = {
    //isAuthenticated: true,
    isLoggedIn(){
      if(localStorage.getItem("username")==undefined){
        isAuthenticated=false;
      }else
      isAuthenticated=true;
    },
    postService(link,data){
      return axios({
        url:server+link,
        method:'post',
        data:JSON.stringify(data),
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
    getService(link,token){
      return  axios({
        url:server+link,
        method:'get',
        headers: {
          'Authorization': "Bearer "+token
       }
      }) .then(function (response) {
        //handle success
       return response.data;
    })
    .catch(function (response) {
        //handle error
        console.log(response);
    })
    },
    authenticate(loginJson) {
      //this.isAuthenticated = true
      //alert("loginJson>"+loginJson);
     return this.postService("login/authenticate",loginJson);
     
    },
    signout(username) {
      this.isAuthenticated = false;
      localStorage.removeItem("username");
      localStorage.removeItem("token")
    },
    menusService(){
     
      if(localStorage.getItem("username")!=undefined){
        if(localStorage.getItem("token")!=undefined){
          //alert(localStorage.getItem("token"));
          return this.getService("login/menus-user?username="+localStorage.getItem("username"),localStorage.getItem("token"))
          .then(data=>{
            var finalMenus=[];
            data.links.forEach(element => {
              var check=false;
              var menu={};
              if(check){
                finalMenus.push(element);
              }
            });
          });
        }
      }
    }
  }
  
export default LoginService;