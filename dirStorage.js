import {Platform} from 'react-native';
const RNFS = require('react-native-fs');

export const dirHome = Platform.select({
  ios: `${RNFS.DocumentDirectoryPath}/photoApp`,
  android: `${RNFS.DocumentDirectoryPath}/photoApp`,
});
console.log(`${RNFS.DocumentDirectoryPath} RNFS path`);
//dirHome = '/data/com.photoapp/'
export const dirPicutures = `${dirHome}/Pictures`;
export const dirAudio = `${dirHome}/Audio`;