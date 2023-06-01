importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js'); 
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging.js');

firebase.initializeApp({ 
    projectId: 'futbolapp-9f858',
    appId: '1:270632453523:web:392280d90f9e7ca7c95466',
    storageBucket: 'futbolapp-9f858.appspot.com',
    apiKey: 'AIzaSyBRlw_HfZU70MKOIVepeo7FXb8rwOpDrWU',
    authDomain: 'futbolapp-9f858.firebaseapp.com',
    messagingSenderId: '270632453523',
});

const messaging = firebase.messaging();
