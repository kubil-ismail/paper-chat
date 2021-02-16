import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA2T2jqfGqormkDJkUIqaeEl3Z9blyIh34",
  authDomain: "chat-example-cc6fe.firebaseapp.com",
  projectId: "chat-example-cc6fe",
  storageBucket: "chat-example-cc6fe.appspot.com",
  messagingSenderId: "196283243549",
  appId: "1:196283243549:web:d2a6783f8c75f69b82baf4",
  measurementId: "G-X0DKWV41E1",
};

export default firebase.initializeApp(firebaseConfig);