import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  PermissionsAndroid,
  Image,
  TouchableOpacity,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import {RNCamera} from 'react-native-camera';
// import {dirPicutures} from './dirStorage';
// import moment from 'moment';
// import Snackbar from 'react-native-snackbar';

console.log('working');

const PendingView = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Text style={{fontSize: 30, color: 'red'}}>Loading...</Text>
  </View>
);
const RNFS = require('react-native-fs');
const App = () => {
  const [image, setImage] = useState(null);
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Cool Photo App storage Permission',
          message:
            'Cool Photo App needs access to storage ' +
            'so you can save the awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Storage');
      } else {
        console.log('storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const saveImage = async path => {
    CameraRoll.save(path, 'photo')
      .then(res => console.warn(res))
      .catch(err => console.warn(err));
  };
  const takePicture = async camera => {
    try {
      const options = {qualit: 0.9, base64: false};
      const data = await camera.takePictureAsync(options);
      setImage(data.uri);
    } catch (error) {
      console.warn(error);
    }
  };
  const reTake = () => {
    setImage(null);
  };
  return (
    <View style={styles.container}>
      {image ? (
        <View style={styles.imageContainer}>
          <Text style={styles.camText}>Image Ready!!</Text>
          <Image
            source={{uri: image, width: '100%', height: '100%'}}
            style={styles.clicked}
          />
          {console.log(image)}
          <TouchableOpacity
            style={styles.button2}
            onPress={() => {
              requestStoragePermission();
              saveImage(image);
            }}>
            <Text>Save To Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2} onPress={reTake}>
            <Text>ReTake</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          captureAudio={false}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'use camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use Audio',
            message: 'use audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}>
          {({camera, status}) => {
            if (status !== 'READY') {
              return <PendingView />;
            }
            return (
              <View style={styles.buttonView}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => takePicture(camera)}>
                  <Text>Capture</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </RNCamera>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#242B2E',
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonView: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    flex: 0,
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 490,
    borderRadius: 25,
    // alignSelf: 'center',
  },
  button2: {
    flex: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 25,
    marginVertical: 15,
  },
  textP: {
    color: 'red',
    fontSize: 30,
  },
  camText: {
    backgroundColor: '#E6425E',
    color: '#fff',
    marginBottom: 5,
    width: '100%',
    textAlign: 'center',
    paddingVertical: 30,
    fontSize: 30,
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clicked: {
    marginVertical: 100,
    width: 300,
    height: 300,
    borderColor: '#E6425E',
    borderWidth: 5,
    borderRadius: 200,
  },
});
