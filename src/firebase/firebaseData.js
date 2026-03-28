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
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
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
