const firebaseConfig = {
  apiKey: "AIzaSyAFPsGZCnG4Gdqwvqs_3E1WPqHFB96_wr4",
  authDomain: "gs-mockup-generator.firebaseapp.com",
  projectId: "gs-mockup-generator",
  storageBucket: "gs-mockup-generator.firebasestorage.app",
  messagingSenderId: "330922303588",
  appId: "1:330922303588:web:de925744294d2f00607f71",
  measurementId: "G-3SGZPTBDH8"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();