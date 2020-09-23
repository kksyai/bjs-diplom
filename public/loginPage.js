'use strict';
const user = new UserForm();
// login
user.loginFormCallback = (data) => ApiConnector.login(data, response => {
    console.log(response); 
    response.success ? location.reload() : user.setLoginErrorMessage(response.error);
});
 
//registration
user.registerFormCallback = (data) => ApiConnector.register(data, response => {
    console.log(response); 
    response.success ? location.reload() : user.setRegisterErrorMessage(response.error);
});
