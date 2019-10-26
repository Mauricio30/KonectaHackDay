import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import * as constants from '../../../hoc/Constants';
import FlatButton   from 'material-ui/FlatButton';
import BGAyuda               from '../../../Images/ayudacambloqueada.jpg';
import marco_cedula          from '../../../Images/marco_cedula.png';
import marco_cedula2         from '../../../Images/marco_cedula2.png';
import sugerencia_pantalla   from '../../../Images/cambiopantalla.png';
import Webcam       from './Cam';
//import Webcam from "react-webcam";

//import Camuser   from '../DesignComponents/Camuser';
class ResponsiveDialog extends React.Component {
  state = {
    checked: true,
    checked_errorCam: true,
    change_windows: false,
    marco: '',
    pantalla: '',
    preview: '',
    checkphoto: false
  };
  componentDidMount() {   
    //alert(this.props.typecapture)
    //cconsole.log(this.props.WindowHeight);
    this.setRef();

    if (window.matchMedia("(orientation: portrait)").matches) {
      this.setState({ pantalla: "portrait" })
      if(this.props.typecapture !== 'toma3'){
        this.setState({ change_windows: true });
      }
    }
   
    if (window.matchMedia("(orientation: landscape)").matches) {
       this.setState({ pantalla: "landscape" });
       this.setState({ change_windows: false });
    }

    window.addEventListener("orientationchange", ()=> {
      //console.log(window.screen.orientation);
      if (window.screen.orientation.type === "landscape-primary") {
        this.setState({ pantalla: "landscape" })
        this.setState({ change_windows: false });      
      }else if (window.screen.orientation.type === "portrait-primary") {
         this.setState({ pantalla: "portrait" });
          if(this.props.typecapture !== 'toma3'){
            this.setState({ change_windows: true });
          }
      }
    });
    }

    previewImage = (imageSrc) => {
      this.props.handlechangeimage(imageSrc);
      this.setState({preview: imageSrc});
    }
    cerrarcam = () =>{
      this.setState({checkphoto: true});
    }
        
  setRef = webcam => {
    try{

    this.webcam = webcam;
    //console.log(this.webcam);
      }catch(e){
        console.log('error', e);    
       // alert(e)    
    }
    }

    continuar = () => {
      //this.props.capture();
      this.props.handleClose();
      //window.location.reload();
      };

    abrircam = () => {
      this.setState({checkphoto: false});
    };
    
  captureclose = () => {
    console.log("captureclose");
    if(this.props.typecapture === 'toma1'){
      const imageSrc1 = this.webcam.getScreenshot();
      this.setState({preview: imageSrc1});
    }else if(this.props.typecapture === 'toma2'){
        const imageSrc2 = this.webcam.getScreenshot();
        this.setState({preview: imageSrc2});
    }else if(this.props.typecapture === 'toma3'){
        const imageSrc3 = this.webcam.getScreenshot();
        this.setState({preview: imageSrc3});
    }
    this.setState({checkphoto: true});

    this.props.capture();
    //this.props.handleClose();

    };

captureclosedialog = () => {
this.props.handleClose();
};
handleChangeCam = () => {
  this.props.handleChangecam();
};

  render() {

    
    const { fullScreen } = this.props;


    const videoconstraints = {
      width: 1280,
      height: 720,
      facingMode: this.props.modecam
    };


    const FlatButtonLabel         = {
      borderRadius              : '100px', 
      fontFamily                : constants.FontFamily2,
      fontWeight                : '300',
      textTransform             : 'initial',
      fontSize                  : '12px',
      textDecoration            : 'none',
      padding                   : '0px',
    }
    
    const FlatButtonLabelStyle  = {
      ...FlatButtonLabel,
      color                     : constants.colorBlue1,
    }

const FlatButtonCloseLabel         = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: constants.colorBlue1,    
    color: constants.colorWhite,

}

const    FButtonContinue= (
  <FlatButton
  labelStyle        = {{...FlatButtonLabelStyle, alignItems: 'center',textTransform:'uppercase', fontFamily:'Kanit', fontWeight:'800', color:constants.colorWhite, fontStyle: 'italic'}}
  hoverColor        = {constants.colorBlue2}
  backgroundColor   = {constants.colorBlue1}
  onClick = {this.continuar}
  rippleColor       = {constants.colorGreen1}
  primary           = {true}
  label             = {'Continuar'}
  />)

  const FButtonCam = (
    <FlatButton
    labelStyle        = {{...FlatButtonLabelStyle, alignItems: 'center',textTransform:'uppercase', fontFamily:'Kanit', fontWeight:'800', color:constants.colorWhite, fontStyle: 'italic'}}
    hoverColor        = {constants.colorBlue2}
    backgroundColor   = {constants.colorBlue1}
    onClick = {this.abrircam}
    rippleColor       = {constants.colorGreen1}
    primary           = {true}
    label             = {'Mejorar foto'}
    />
        )

const FButtonclose = (
  <FlatButton
  labelStyle             = {{...FlatButtonCloseLabel}}
  onClick = {this.captureclosedialog}
  rippleColor       = {constants.colorGreen1}
  primary           = {true}
  label             = {'X'}
  />
      )

  // const FButton = (
  //   <FlatButton
  //   labelStyle        = {{...FlatButtonLabelStyle, alignItems: 'center',textTransform:'uppercase', fontFamily:'Kanit', fontWeight:'800', color:constants.colorWhite, fontStyle: 'italic'}}
  //   hoverColor        = {constants.colorBlue2}
  //   backgroundColor   = {constants.colorBlue1}
  //   onClick = {this.captureclose}
  //   rippleColor       = {constants.colorGreen1}
  //   primary           = {true}
  //   label             = {'Tomar foto'}
  //   />
  //       )
    return (
      <div>
      
        <Dialog
          fullScreen={fullScreen}
          open={this.props.open}
          onClose={this.props.handleClose}
          style={{width:'100%', height:'auto', overflowY: 'hidden',overflowX: 'hidden', scrollSnapTypeX: 'hidden', maxWidth: '100%'}}
          contentstyle={{height: 'auto', overflow: 'hidden'}}>
          

              {this.state.checkphoto === true?
              <img style={{maxWidth: '100%', overflow: 'hidden', margin: '0 auto', padding: 0, position: 'relative'}} src={this.state.preview}  alt={this.state.preview}/> 
              
              :this.state.checked_errorCam === true?
              <div style={{float: 'left'}}>

                          <Webcam {...this.props} {...this.state} previewImage={this.previewImage} cerrarcam={this.cerrarcam} captureclosedialog={this.captureclosedialog}
                            videoConstraints={videoconstraints}
                            audio={false}
                            height='auto'
                            ref={this.setRef}
                            screenshotFormat="image/png"
                            width='100%'
                            overflow="hidden"/>
              </div>
            :<img style={{maxWidth: '100%', overflow: 'hidden', margin: '0 auto', padding: 0, position: 'relative'}} src={BGAyuda} alt={BGAyuda}/>}      

            {this.state.checkphoto === false?
              <div style={{textAlign: 'right', justifyContent:'right',marginLeft: 'auto', marginRight: 'auto',float: 'left',position: 'absolute', width: '100%', height: 'auto'}}>  
                  {FButtonclose} 
                  {/* <p style={{textAlign: 'center', justifyContent:'center', width: '100%', fontSize: '10px', fontFamily: constants.FontFamily2,color: constants.colorWhite,  backgroundColor: '#00000085'}}>{this.props.tittletextcapture+': '+this.props.textcapture}</p> */}
                    <div style={{textAlign: 'center', justifyContent:'center',marginLeft: 'auto', marginRight: 'auto',float: 'left',position: 'absolute', width: '100%', height: 'auto'}}>
                            {this.props.typecapture === 'toma1'?
                            <img  style={{maxWidth: '100%', overflow: 'hidden', margin: '0 auto', padding: 0, position: 'relative'}} src={marco_cedula} alt="" />
                            :this.props.typecapture === 'toma2'?
                            <img  style={{maxWidth: '100%', overflow: 'hidden', margin: '0 auto', padding: 0, position: 'relative'}} src={marco_cedula2} alt=""/>
                            :this.props.typecapture === 'toma3'?
                            <div style={{justifyContent:'center',marginTop: '230px', marginRight: 'auto'}}>  </div>
                            :null}


                            {this.state.change_windows?
                              <img  style={{maxWidth: '100%', overflow: 'hidden', margin: '0 auto', padding: 0, position: 'relative'}} src={sugerencia_pantalla} alt=""/>
                             :null}

                          {/* <div style={{textAlign: 'center', justifyContent:'center',marginLeft: 'auto', marginRight: 'auto',float: 'left',position: 'absolute', width: '100%', height: 'auto'}}>  
                          {FButton}
                          </div>  */}
                     </div>     
              </div>     
                :
                <div style={{textAlign: 'right', justifyContent:'right',marginLeft: 'auto', marginRight: 'auto',float: 'left',position: 'absolute', width: '100%', height: 'auto'}}>  
                    <p style={{textAlign: 'center', justifyContent:'center', width: '100%', fontSize: '14px', fontFamily: constants.FontFamily2,color: constants.colorWhite,  backgroundColor: '#000000'}}>{this.props.textcapture}</p>    {FButtonCam}   {FButtonContinue}  {FButtonclose} 
                </div> 
                }
        </Dialog>
      </div>
    );
  }
}

ResponsiveDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};
const mapStateToProps = state => {
  return{
    personIdentificationDTO : state.mbr.personIdentificationDTO,
    WindowWidth         : state.app.WindowWidth,
    WindowHeight        : state.app.WindowHeight
  };
};


export default withMobileDialog(mapStateToProps)(ResponsiveDialog);
