import React from 'react';

const LoginService = {
    isAuthenticated: false,
    authenticate(loginJson) {
      this.isAuthenticated = true
     
    },
    signout(username) {
      this.isAuthenticated = false
     
    }
  }
  
export default LoginService;