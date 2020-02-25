import * as firebase from 'firebase/app';
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
    apiKey: 'AIzaSyCrP36HnT2vhLeV3dmJ8ISDfg5WISP3Smg',
    authDomain: 'road-defect.firebaseapp.com',
    databaseURL: 'https://road-defect.firebaseio.com',
    projectId: 'road-defect',
    storageBucket: 'road-defect.appspot.com',
    messagingSenderId: '273336642228',
    appId: '1:273336642228:web:61fffbb6ac028f1ac945e1',
    measurementId: 'G-VD6RXXVREB',
  };

const app = firebase.initializeApp(
    //Firebase config key goes here 
    firebaseConfig
);

export default app;