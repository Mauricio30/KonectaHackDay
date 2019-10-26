import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Form from './form';
import WebcamResponsive from './WebcamResponsiveDialog';

class login extends React.Component {
    constructor(props){
        super(props);
        this.state={
        username:'',
        isLogin:true,
        loginmessage:'',
        password:'',
        isOpen: false,
        closed: false,
        typecapture: 'toma1'
        }
       }
handleClose=()=>{
this.setState({closed: false})
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

            fetch('http://example.com/movies.json')
                        .then(function(response) {
                          return response.json();
                        })
                        .then(function(myJson) {
                          console.log(myJson);
                        });            
      }

      render() {
          return (
            <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column'}}>
               <MuiThemeProvider>
               <WebcamResponsive {...this.props} handleClose={this.handleClose} closed={this.state.closed} typecapture={this.state.typecapture}/>
               {this.state.isOpen?
               <Form/>:
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
                  {this.state.loginmessage}
              </div>
              }
                  <br/>
                  <RaisedButton label={this.state.isOpen?"Registrarse":"Iniciar Sesión"} primary={true} style={style} onClick={(event) => this.setState({isOpen: !this.state.isOpen, closed: true})}/>
                  <br/>
              </MuiThemeProvider>
            </div>
          );
        }
      }
      const style = {
       margin: 15,
      };
export default login;


