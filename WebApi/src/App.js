import React from 'react';
import logo from './thundercats.gif';
import './App.css';
import Login from './components/login';
//import responsiveDialog from './components/ResponsiveDialog';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));

function App() {

    const classes = useStyles();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>THUNDERHACKS RECONOCIMIENTO DE IDENTIDAD Y ENVIO DE CONTRATO</p>
      </header>
      <Login/>
    </div>
  );
}

export default App;
