// ===== FIREBASE INICIALIZACE A KONFIGURACE =====
// Tento soubor obsahuje hlavní konfiguraci Firebase projektu
// Firebase je Backend-as-a-Service platforma od Google, která poskytuje:
// - Autentizaci uživatelů (přihlášení, registrace)
// - Realtime Database (databáze v reálném čase)
// - Hosting, Storage a další služby


// ===== IMPORTY Z FIREBASE SDK =====
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';


// ===== KONFIGURACE FIREBASE PROJEKTU =====
// Soubor s přístupovými údaji k Firebase projektu
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


// ===== INICIALIZACE FIREBASE =====
// Vytvoří a inicializuje Firebase aplikaci s danou konfigurací
// Tento objekt je základem pro všechny Firebase služby
const app = initializeApp(firebaseConfig);


// ===== EXPORT FIREBASE SLUŽEB =====
// Export autentizačního objektu - používá se pro přihlášení, registraci, odhlášení
// Používá se v auth.js a index.html
export const auth = getAuth(app);


// Export databázového objektu - používá se pro čtení/zápis dat
// Používá se v database.js pro práci s úkoly a uživatelskými daty
export const db = getDatabase(app);
