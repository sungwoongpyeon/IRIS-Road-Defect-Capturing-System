import * as firebase from 'firebase/app';
import "firebase/auth";
import "firebase/storage";
import {firebaseCredential}  from "../private/credential"

const app = firebase.initializeApp(firebaseCredential);

export default app;