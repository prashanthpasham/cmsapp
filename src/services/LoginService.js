import React from 'react';
import axios from 'axios';
var server="http://localhost:8084/";
var isAuthenticated=false;
const routeTable=[{
  "name":"Portal Access",
  "path":"/dashboard/access-portal",
  "component":"OrganizationPortal"
},{
  "name":"College Info",
  "path":"/dashboard/management-info",
  "component":"OrganizationPortal"
},{
  "name":"Employee",
  "path":"/dashboard/employee-list",
  "component":"EmployeeList"
}];
const LoginService = {
  //  isAuthenticated: false,
    isLoggedIn(){
     // alert(localStorage.getItem("username"))
      if(localStorage.getItem("username")===undefined || localStorage.getItem("username")==null){
        return false;
      }else
      return true;
      //alert(isAuthenticated);
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
	fetchGet(link,token){
		const myHeaders = new Headers();

//myHeaders.append('Content-Type', 'application/json');
myHeaders.append('token', 'Bearer '+token);

		return fetch(server+link, {
    method: 'GET',
    headers: myHeaders,
	mode:'no-cors'
  }).then(function (response) {
        //handle error
        console.log(response);
		  return response.json();
    }).catch(function (response) {
        //handle error
        console.log(response);
    })
	},
    getService(link,token){
		//console.log('Bearer '+token);

      return  axios({
        url:server+link,
        method:'get',
        headers: {
          'Authorization': 'Bearer '+token,
		  "Access-Control-Allow-Origin":"*"
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
      //this.isAuthenticated = false;
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      localStorage.removeItem("menus");
    },
	getAllClients(link,token) {
  

  return axios.get(server+link, {
    headers:{"Authorization" : `Bearer ${token}`}
  })
    .then(response => {return response.data})
    .catch((error) => {
      console.error(error);
    });
},
    menusService(){
     
      if(localStorage.getItem("username")!=undefined){
        if(localStorage.getItem("token")!=undefined){
         // alert(localStorage.getItem("token"));
          return this.getAllClients("login/menus-user?username="+localStorage.getItem("username"),localStorage.getItem("token"))
          .then(data=>{
			   var finalMenus=[];
            alert(JSON.stringify(data));
			if(data!=undefined){
            var map = new Map();
            routeTable.forEach(link=>{
               map.set(link.name,link);
            });
            console.log(map);
           
            data.links.forEach(element => {
              var obj={};
              obj.name=element.menutitle;
              obj.menus=[];
              var array=[];
             element.menus.forEach(menu=>{
               var menuItem=map.get(menu.menutitle);
               if(menuItem!=undefined){
               console.log("menuitem>>"+JSON.stringify(menuItem));
               menu['component']=menuItem.component;
               menu['path']=menuItem.path;
               array.push(menu);
               }
             })
              obj.menus=array;
              finalMenus.push(obj);
            });
            alert("finalMenus>>"+JSON.stringify(finalMenus));
			}
            return finalMenus;
          });
        }
      }
    }
  }
  
export default LoginService;
