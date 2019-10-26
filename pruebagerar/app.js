const vision = require('@google-cloud/vision');
// Creates a client  Gerardo
const client = new vision.ImageAnnotatorClient({
  keyFilename: './keyfile.json'
});

//Performs label detection on the image file
client
  .labelDetection('./resources/car.png')
  .then(results => {
    const labels = results[0].labelAnnotations;

    console.log('Respuesta labelDetection:');
    labels.forEach(label => console.log(label));
    //console.log(results);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });


//   // Performs label detection on the image file
client
.faceDetection('gs://test_gerardo/IMG_20190925_095924.jpg')
.then(results => {
    const faces = results.faceAnnotations;
    console.log(faces);
})
.catch(err => {
  console.error('ERROR:', err);
});



/**
 * TODO(developer): Uncomment the following line before running the sample.
 */
// const fileName = 'Local image file, e.g. /path/to/image.png';

// Performs text detection on the local file
asyncCall();
async function asyncCall() {
    console.log('asyncCall')
const [result] = await client.textDetection('gs://test_gerardo/cedula.jpg');
const detections = result.textAnnotations;
console.log('Text:');
detections.forEach(text => console.log(text));
}


  