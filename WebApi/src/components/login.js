import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class login extends React.Component {
    constructor(props){
        super(props);
        this.state={
        username:'',
        isLogin:true,
        loginmessage:'',
        password:''
        }
       }

       handleClick(event){
         console.log("event",this.state);

         var loginmessage;
      var loginscreen=[];
      loginmessage = "Already registered.Go to Login";
      this.setState({
                     loginscreen:loginscreen,
                     loginmessage:loginmessage,
                     buttonLabel:"Login",
                     isLogin:false
                   })
   
        
      }

      render() {
          return (
            <div>
              <MuiThemeProvider>
                <div>
                <AppBar
                   title="Login"
                 />
                 <TextField
                   hintText="Enter your Username"
                   floatingLabelText="Username"
                   onChange = {(event,newValue) => this.setState({username:newValue})}
                   />
                 <br/>
                   <TextField
                     type="password"
                     hintText="Enter your Password"
                     floatingLabelText="Password"
                     onChange = {(event,newValue) => this.setState({password:newValue})}
                     />
                   <br/>
                   <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
                   <br/>
                   <RaisedButton label="Register" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
                   <br/>
                   {this.state.loginmessage}
               </div>
               </MuiThemeProvider>
            </div>
          );
        }
      }
      const style = {
       margin: 15,
      };
export default login;


