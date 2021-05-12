import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  PermissionsAndroid,
  Image,
  TouchableOpacity,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {dirPicutures} from './dirStorage';
// import RNFS from 'react-native-fs';
import moment from 'moment';
import Snackbar from 'react-native-snackbar';

console.log('working');

const PendingView = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'blue'
    }}>
    <Text style={{fontSize: 30, color: 'red'}}>Loading...</Text>
  </View>
);
const RNFS = require('react-native-fs');
const App = () => {
  const [image, setImage] = useState(null);
  const saveImage = async filePath => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Permission",
          message: "swahiliPodcast needs to read storage "
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        try {
          // set new image name and filepath
          const newImageName = `${moment().format('DDMMYY_HHmmSSS')}.jpg`;
          console.log(dirPicutures);
          const newFilepath = `${dirPicutures}/${newImageName}`;
          // move and save image to new filepath
          const imageMoved = await moveAttachment(filePath, newFilepath);
          console.log('image moved', imageMoved);
          Snackbar.show({
            text: 'Image Saved !!',
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log(
          'Permission Denied!',
          'You need to give  permission to see contacts',
        );
      }
    } catch (err) {
     console.log(err);
    }
  };
  const moveAttachment = async (filePath, newFilepath) => {
    return new Promise((resolve, reject) => {
      RNFS.mkdir(dirPicutures)
        .then(() => {
          RNFS.moveFile(filePath, newFilepath)
            .then(() => {
              console.log('FILE MOVED', filePath, newFilepath);
              resolve(true);
            })
            .catch(error => {
              console.log('moveFile error', error);
              reject(error);
            });
        })
        .catch(err => {
          console.log('mkdir error', err);
          reject(err);
        });
    });
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
            style={styles.button}
            onPress={() => saveImage(image)}>
            <Text>Save To Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={reTake}>
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
    marginBottom: 30,
    borderRadius: 25,
    // alignSelf: 'center',
  },
  textP: {
    color: 'red',
    fontSize: 30,
  },
  camText: {
    backgroundColor: '#E6425E',
    color: '#fff',
    marginBottom: 30,
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
    marginVertical: 130,
    width: 300,
    height: 300,
    borderColor: '#E6425E',
    borderWidth: 5,
    borderRadius: 200,
  },
});
