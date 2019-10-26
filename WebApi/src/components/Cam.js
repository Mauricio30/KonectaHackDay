import React, { Component } from 'react';
//import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import PropTypes from 'prop-types';
import FlatButton   from 'material-ui/FlatButton';
import * as constants from '../../../hoc/Constants';

function hasGetUserMedia() {
  return !!(
    (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia
    || navigator.msGetUserMedia
  );
}


const constrainStringType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string),
  PropTypes.shape({
    exact: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
  }),
  PropTypes.shape({
    ideal: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
  }),
]);

const constrainBooleanType = PropTypes.oneOfType([
  PropTypes.shape({
    exact: PropTypes.bool,
  }),
  PropTypes.shape({
    ideal: PropTypes.bool,
  }),
]);

const constrainLongType = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.shape({
    exact: PropTypes.number,
    ideal: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
  }),
]);

const constrainDoubleType = constrainLongType;

const audioConstraintType = PropTypes.shape({
  deviceId: constrainStringType,
  groupId: constrainStringType,
  autoGainControl: constrainBooleanType,
  channelCount: constrainLongType,
  latency: constrainDoubleType,
  noiseSuppression: constrainBooleanType,
  sampleRate: constrainLongType,
  sampleSize: constrainLongType,
  volume: constrainDoubleType,
});

const videoConstraintType = PropTypes.shape({
  deviceId: constrainStringType,
  groupId: constrainStringType,
  aspectRatio: constrainDoubleType,
  facingMode: constrainStringType,
  frameRate: constrainDoubleType,
  height: constrainLongType,
  width: constrainLongType,
});

class Webcam extends Component {

  static defaultProps = {
    audio: true,
    className: '',
    height: 1280,
    imageSmoothing: true,
    onUserMedia: () => {},
    onUserMediaError: () => {},
    screenshotFormat: 'image/png',
    width: 720,
    screenshotQuality: 0.92,
  };

  static propTypes = {
    audio: PropTypes.bool,
    onUserMedia: PropTypes.func,
    onUserMediaError: PropTypes.func,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    screenshotFormat: PropTypes.oneOf([
      'image/png'
    ]),
    style: PropTypes.object,
    className: PropTypes.string,
    screenshotQuality: PropTypes.number,
    minScreenshotWidth: PropTypes.number,
    minScreenshotHeight: PropTypes.number,
    audioConstraints: audioConstraintType,
    videoConstraints: videoConstraintType,
    imageSmoothing: PropTypes.bool,
  };

  static mountedInstances = [];

  static userMediaRequested = false;

  constructor() {
    super();
    this.state = {
      hasUserMedia: false,
    };
 }

  componentDidMount() {
    if (!hasGetUserMedia()) return;

    const { state } = this;

    Webcam.mountedInstances.push(this);

    if (!state.hasUserMedia && !Webcam.userMediaRequested) {
      this.requestUserMedia();
    }

  }

  componentDidUpdate(nextProps) {
    const { props } = this;
    if (
      JSON.stringify(nextProps.audioConstraints)
        !== JSON.stringify(props.audioConstraints)
      || JSON.stringify(nextProps.videoConstraints)
        !== JSON.stringify(props.videoConstraints)
    ) {
      this.requestUserMedia();
    }
  }

  componentWillUnmount() {
    const { state } = this;
    const index = Webcam.mountedInstances.indexOf(this);
    Webcam.mountedInstances.splice(index, 1);

    Webcam.userMediaRequested = false;
    if (Webcam.mountedInstances.length === 0 && state.hasUserMedia) {
      if (this.stream.getVideoTracks && this.stream.getAudioTracks) {
        this.stream.getVideoTracks().map(track => track.stop());
        //this.stream.getAudioTracks().map(track => track.stop());
      } else {
        this.stream.stop();
      }
      window.URL.revokeObjectURL(state.src);
    }
  }

  getScreenshot() {
    const { state, props } = this;

    if (!state.hasUserMedia) return null;
 
    const canvas = this.getCanvas();


    return (
      canvas
      && canvas.toDataURL(
        props.screenshotFormat,
        props.screenshotQuality,
      )
    );
  }

  getCanvas() {
    const { state, props } = this;

    if (!state.hasUserMedia || !this.video.videoHeight) return null;

    if (!this.ctx) {
      const canvas = document.createElement('canvas');
      const aspectRatio = this.video.videoWidth / this.video.videoHeight;

      let canvasWidth = props.minScreenshotWidth || this.video.clientWidth;
      let canvasHeight = canvasWidth / aspectRatio;
      // canvasHeight = 640;
      // canvasWidth = canvasHeight * aspectRatio;
       canvas.width = canvasWidth*1.8;
       canvas.height = canvasHeight*1.8;
      //  alert("width:"+canvas.width)
      //  alert("height:"+canvas.height)

      // if(canvas.width > 1080){
      //   canvas.width = canvasWidth*1.4;
      //   canvas.height = canvasHeight*1.4;
      // }
      // if(canvas.height > 1080){
      //   canvas.width = canvasWidth*1.4;
      //   canvas.height = canvasHeight*1.4;
      // }
      // if(canvas.width > 1080){
      //   canvas.width = canvasWidth*1.3;
      //   canvas.height = canvasHeight*1.3;
      // }
      // if(canvas.height > 1080){
      //   canvas.width = canvasWidth*1.3;
      //   canvas.height = canvasHeight*1.3;
      // }
  
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
    }

    const { ctx, canvas } = this;


    //alert(canvas.width)
    //alert(canvas.height)
    ctx.imageSmoothingEnabled = props.imageSmoothing;
    ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height); 
    return canvas;
  }

  requestUserMedia() {
    const { props } = this;

    navigator.getUserMedia = navigator.mediaDevices.getUserMedia
      || navigator.webkitGetUserMedia
      || navigator.mozGetUserMedia
      || navigator.msGetUserMedia;

    const sourceSelected = (audioConstraints, videoConstraints) => {
      const constraints = {
        video: typeof videoConstraints !== 'undefined' ? videoConstraints : true,
      };

      if (props.audio) {
        constraints.audio = typeof audioConstraints !== 'undefined' ? audioConstraints : true;
      }

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          Webcam.mountedInstances.forEach(instance => instance.handleUserMedia(null, stream));
        })
        .catch((e) => {
          Webcam.mountedInstances.forEach(instance => instance.handleUserMedia(e));
        });
    };

    if ('mediaDevices' in navigator) {
      sourceSelected(props.audioConstraints, props.videoConstraints);
    } else {
      const optionalSource = id => ({ optional: [{ sourceId: id }] });

      const constraintToSourceId = (constraint) => {
        const { deviceId } = constraint || {};

        if (typeof deviceId === 'string') {
          return deviceId;
        }

        if (Array.isArray(deviceId) && deviceId.length > 0) {
          return deviceId[0];
        }

        if (typeof deviceId === 'object' && deviceId.ideal) {
          return deviceId.ideal;
        }

        return null;
      };

      MediaStreamTrack.getSources((sources) => {
        let audioSource = null;
        let videoSource = null;

        sources.forEach((source) => {
          if (source.kind === 'audio') {
            audioSource = source.id;
          }
          if (source.kind === 'video') {
            videoSource = source.id;
          }
        });

        const audioSourceId = constraintToSourceId(props.audioConstraints);
        if (audioSourceId) {
          audioSource = audioSourceId;
        }

        const videoSourceId = constraintToSourceId(props.videoConstraints);
        if (videoSourceId) {
         videoSource = videoSourceId;
        }

        sourceSelected(
          optionalSource(audioSource),
          optionalSource(videoSource),
        );
      });
    }

    Webcam.userMediaRequested = true;
  }
  captureclose = () => {
    //console.log(this.getScreenshot());
    // if(this.props.typecapture === 'toma1'){
    //   const imageSrc1 = this.getScreenshot();
    //   localStorage.setItem('screenshots1',imageSrc1);
    // }else if(this.props.typecapture === 'toma2'){
    //     const imageSrc2 = this.getScreenshot();
    //     localStorage.setItem('screenshots2',imageSrc2);
    // }else if(this.props.typecapture === 'toma3'){
    //     const imageSrc3 = this.getScreenshot();
    //     localStorage.setItem('screenshots3',imageSrc3);
    // }

    this.props.previewImage(this.getScreenshot());
    this.props.cerrarcam();
    };

  handleUserMedia(err, stream) {
    const { props } = this;

    if (err) {
      this.setState({ hasUserMedia: false });
      props.onUserMediaError(err);

      return;
    }

    this.stream = stream;

    try {
      this.video.srcObject = stream;
      this.setState({ hasUserMedia: true });
    } catch (error) {
      this.setState({
        hasUserMedia: true,
        src: window.URL.createObjectURL(stream),
      });
    }

    props.onUserMedia();
  }

  render() {
    const { state, props } = this;

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

    const FButton = (
      <FlatButton
      labelStyle        = {{...FlatButtonLabelStyle, alignItems: 'center',textTransform:'uppercase', fontFamily:'Kanit', fontWeight:'800', color:constants.colorWhite, fontStyle: 'italic'}}
      hoverColor        = {constants.colorBlue2}
      backgroundColor   = {constants.colorBlue1}
      onClick = {this.captureclose}
      rippleColor       = {constants.colorGreen1}
      primary           = {true}
      label             = {'Tomar foto'}
      />
          )
    return (
      <div style={{marginTop:'-10px'}}>  
          <video
            autoPlay
            width={props.width}
            height={props.height}
            src={state.src}
            muted={props.audio}
            className={props.className}
            playsInline
            style={props.style}
            ref={(ref) => {
              this.video = ref;
            }}
          />
       <div style={{textAlign: 'center', justifyContent:'center',marginTop:'-50px',float: 'left',position: 'absolute', width: '100%', height: 'auto'}}>  
         {FButton}
       </div> 
      </div>
    );
  }
}

export default Webcam;

