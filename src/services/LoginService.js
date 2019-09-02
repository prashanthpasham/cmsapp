import React from 'react';

const LoginService = {
    isAuthenticated: true,
    authenticate(loginJson) {
      this.isAuthenticated = true
     
    },
    signout(username) {
      this.isAuthenticated = false
     
    }
  }
  
export default LoginService;