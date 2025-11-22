// CONFIGURAÇÃO DO FIREBASE (REALTIME DATABASE)
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI", // <--- COLE AQUI A SUA API KEY
  authDomain: "promocityvai-e278a.firebaseapp.com",
  databaseURL: "https://promocityvai-e278a-default-rtdb.firebaseio.com", // Seu banco!
  projectId: "promocityvai-e278a",
  storageBucket: "promocityvai-e278a.appspot.com",
  messagingSenderId: "SEU_SENDER_ID_AQUI", // <--- COLE AQUI O SEU SENDER ID
  appId: "SEU_APP_ID_AQUI" // <--- COLE AQUI O SEU APP ID
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database(); // Realtime Database

console.log("Firebase Realtime Conectado!");
