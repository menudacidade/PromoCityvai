// CONFIGURAÇÃO DO FIREBASE (REALTIME DATABASE)
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI", // <--- COLAR AQUI
  authDomain: "promocityvai-e278a.firebaseapp.com",
  databaseURL: "https://promocityvai-e278a-default-rtdb.firebaseio.com", // Seu banco!
  projectId: "promocityvai-e278a",
  storageBucket: "promocityvai-e278a.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database(); // Realtime Database

console.log("Firebase Realtime Conectado!");
