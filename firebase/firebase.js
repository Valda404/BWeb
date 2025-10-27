import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD7eXWQRlvmJpuE3MSjopUtctvZiS9oQZQ",
  authDomain: "bweb-9f2f1.firebaseapp.com",
  databaseURL: "https://bweb-9f2f1-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bweb-9f2f1",
  storageBucket: "bweb-9f2f1.firebasestorage.app",
  messagingSenderId: "490498795009",
  appId: "1:490498795009:web:58dcd0689ce46c60768200",
  measurementId: "G-2DCRKJV60M"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);