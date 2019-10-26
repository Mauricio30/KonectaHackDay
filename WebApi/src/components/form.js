import React        from 'react';
import TextField from '@material-ui/core/TextField';
import Paper        from '@material-ui/core/Paper';
import { MuiPickersUtilsProvider, 
         DatePicker } 
         from 'material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';
import eLocale from "date-fns/locale/es";
import {MuiThemeProvider,  createMuiTheme } from "@material-ui/core";



class Form extends React.Component{
    state={
        name : '',
        lastName: '',
        bDate: new Date(),
        phone: '',
        dob: '',
        expiration: '',
        email: '',
        document: '',
        iDate: '',
        Today : new Date(),
        TodayDate: new Date()
    }
    
    handleClick(event){
        alert(event)
    }
    dobErrorChangeHandler=(Origin)=>{        

        if(this.state.bDate===''){
            let errorMessages = {...this.state.dobErrorMessageState}
            errorMessages=true;
            const dobErrorMessageText='Para nosotros es importante conocer tu fecha de nacimiento';
            this.setState({dobErrorMessageState:errorMessages})
            this.setState({dobErrorMessageText:dobErrorMessageText})
        }
        else{

            let errorMessages = {...this.state.dobErrorMessageState}
            errorMessages=false;
            this.setState({dobErrorMessageState:errorMessages})

 
        }
    }
    
    render(){
        // let DateTimeFormat = null;

        // if (areIntlLocalesSupported(['es', 'es-CO'])) {
        //     DateTimeFormat = global.Intl.DateTimeFormat;
        // } else {
        //     const IntlPolyfill = require('intl');
        //     DateTimeFormat = IntlPolyfill.DateTimeFormat;
        //     require('intl/locale-data/jsonp/es');
        //     require('intl/locale-data/jsonp/es-CO');
        //   }
        console.log(this.props.disabledEditing)

          const InitialDateDbo = new Date()

          const DatePickerStyle = createMuiTheme({
            
          });
        return (
            <div style={{width: '50%', margin:'120px', marginLeft:'120px', marginRight:'12px',display:'flex',  justifyContent:'center', flexDirection: 'column' ,flexWrap:'wrap', marginTop:'0px'}}>         
                <div>
                <Paper rounded={false} zDepth={0} className='PaperStyle'>
                        <h3>Formulario Registro Cliente y envio de contrato</h3>

                        <div style={{display:this.props.disabledEditing?'flex':'none'}}>

                        </div>
                    </Paper>
                </div>
                <div>
                    <Paper rounded={false} zDepth={0} className='PaperStyle' style={{marginTop:'20px'}}>
                    <p style={{fontSize:'10px', marginBottom: '5px'}}>
                        Diligencia tus datos como aparecen en tu cédula
                    </p>    
                   <div style={{display: 'flex', flexDirection: 'column'}}>         
                        <TextField
                            autoFocus           = {true}
                            id                  = 'Name'
                            onChange = {(event,newValue) => this.setState({name:newValue})}
                            value               = {this.state.name}
                            disabled            = {this.state.disabledEditing_personal}
                            floatingLabelStyle  = {{color: 'black', top: '20px'}}
                            inputStyle          = {{ marginTop: '4px'}}
                            style               = {{height: '50px'}}
                            label   = 'Nombres'
                            errorStyle          = {{ color:'red', top: '-10px'}}
                            onFocus             = {()=>(this.setState({nameErrorMessageState:false}))}
                            onBlur              = {()=>(this.state.name===''?this.setState({nameErrorMessageState:true}):this.setState({nameErrorMessageState:false}))}
                            errorText           = {this.state.nameErrorMessageState?'Necesitamos conocer tu nombre':''}
                            />
                        
                        <TextField
                            autoFocus           = {true}
                            id                  = 'lastName'
                            onChange = {(event,newValue) => this.setState({lastName:newValue})}
                            value               = {this.state.lastName}
                            floatingLabelStyle  = {{ top: '20px'}}
                            inputStyle          = {{ marginTop: '4px'}}
                            style               = {{height: '50px'}}
                            label   = 'Apellidos'
                            errorStyle          = {{ color:'red', top: '-10px'}}
                            onFocus             = {()=>(this.setState({nameErrorMessageState:false}))}
                            onBlur              = {()=>(this.state.lastName===''?this.setState({nameErrorMessageState:true}):this.setState({nameErrorMessageState:false}))}
                            errorText           = {this.state.nameErrorMessageState?'Necesitamos conocer tu nombre':''}
                            />
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale = {eLocale}>
                            <MuiThemeProvider theme={DatePickerStyle}>
                                <DatePicker
                                    autoOk
                                    variant = 'standard'
                                    openTo  = 'year'
                                    views   = {['year', 'month', 'day']}
                                    id      = 'DOB'
                                    margin  =   "normal"
                                    label   =   'Fecha de nacimiento'
                                    value   = {this.state.dob === ""? new Date:this.state.dob}
                                    onChange= {(event, date, values)=> this.setState({dob:date})}
                                    format  =   {	
                                        'dd MMMM, yyyy'}
                                    okLabel ="Aceptar" cancelLabel="Cancelar"
                                    maxDate = {new Date(this.state.TodayDate.setFullYear(this.state.Today.getFullYear()-18))}
                                    minDate = {new Date(this.state.TodayDate.setFullYear(this.state.Today.getFullYear()-80))}
                                    animateYearScrolling
                                    initialFocusedDate = {new Date(InitialDateDbo.setFullYear(InitialDateDbo.getFullYear()-18))}
                                    maxDateMessage = "Recuerda que debes ser mayor"
                                />
                                
                            </MuiThemeProvider>
                        </MuiPickersUtilsProvider>

                        <TextField
                                id                  = 'document'
                                onChange = {(event,newValue) => this.setState({document:newValue})}
                                value               = {this.state.document}
                                floatingLabelStyle  = {{ top: '20px'}}
                                inputStyle          = {{ marginTop: '4px'}}
                                style               = {{height: '50px'}}
                                label   = 'Número de documento'
                                errorStyle          = {{ color: 'red', top: '-10px'}}
                                onFocus             = {()=>(this.setState({regionErrorMessageState:false}))}
                                onBlur              = {()=>(this.state.document===''?this.setState({regionErrorMessageState:true}):this.setState({regionErrorMessageState:false}))}
                                errorText           = {this.state.regionErrorMessageState?'Necesitamos validar tu lugar de nacimiento':''}
                        />

<MuiPickersUtilsProvider utils={DateFnsUtils} locale = {eLocale}>
                            <MuiThemeProvider theme={DatePickerStyle}>
                                <DatePicker
                                    autoOk
                                    variant = 'standard'
                                    openTo  = 'year'
                                    views   = {['year', 'month', 'day']}
                                    id      = 'DOB'
                                    margin  =   "normal"
                                    label   =   'Fecha de expedición'
                                    value   = {this.state.expiration === ""? new Date:this.state.expiration}
                                    onChange= {(event, date, values)=> this.setState({expiration:date})}
                                    format  =   {	
                                        'dd MMMM, yyyy'}
                                    okLabel ="Aceptar" cancelLabel="Cancelar"
                                    maxDate = {new Date(this.state.bDate.setFullYear(this.state.Today.getFullYear()-18))}
                                    animateYearScrolling
                                    initialFocusedDate = {new Date(InitialDateDbo.setFullYear(InitialDateDbo.getFullYear()-18))}
                                    maxDateMessage = "Recuerda que debes ser mayor de edad"
                                />
                                
                            </MuiThemeProvider>
                        </MuiPickersUtilsProvider>

<TextField
                                id                  = 'phone'
                                onChange = {(event,newValue) => this.setState({phone:newValue})}
                                value               = {this.state.document}
                                floatingLabelStyle  = {{ top: '20px'}}
                                inputStyle          = {{ marginTop: '4px'}}
                                style               = {{height: '50px'}}
                                label   = 'Número celular'
                                errorStyle          = {{ color: 'red', top: '-10px'}}
                                onFocus             = {()=>(this.setState({regionErrorMessageState:false}))}
                                onBlur              = {()=>(this.state.document===''?this.setState({regionErrorMessageState:true}):this.setState({regionErrorMessageState:false}))}
                                errorText           = {this.state.regionErrorMessageState?'Necesitamos validar tu lugar de nacimiento':''}
                        />
                                                <TextField
                                id                  = 'email'
                                type = 'email'
                                onChange            = {(event,)=>this.setState({email: event.target.value})}
                                value               = {this.state.email}
                                floatingLabelStyle  = {{ top: '20px'}}
                                inputStyle          = {{ marginTop: '4px'}}
                                style               = {{height: '50px'}}
                                label   = 'Correo electronico'
                                errorStyle          = {{ color: 'red', top: '-10px'}}
                                onFocus             = {()=>(this.setState({regionErrorMessageState:false}))}
                                onBlur              = {()=>(this.state.document===''?this.setState({regionErrorMessageState:true}):this.setState({regionErrorMessageState:false}))}
                                errorText           = {this.state.regionErrorMessageState?'Necesitamos validar tu lugar de nacimiento':''}
                        />


                        
                        </div>  
                    </Paper>
                </div>             
            </div>
        )}}


export default Form;