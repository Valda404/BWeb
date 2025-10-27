// ===== FIREBASE INICIALIZACE A KONFIGURACE =====
// Tento soubor obsahuje hlavní konfiguraci Firebase projektu
// Firebase je Backend-as-a-Service platforma od Google, která poskytuje:
// - Autentizaci uživatelů (přihlášení, registrace)
// - Realtime Database (databáze v reálném čase)
// - Hosting, Storage a další služby

// ===== IMPORTY Z FIREBASE SDK =====
// Import funkce pro inicializaci Firebase aplikace
import { initializeApp } from "firebase/app";
// Import funkce pro získání autentizačního objektu
import { getAuth } from "firebase/auth";
// Import funkce pro získání databázového objektu
import { getDatabase } from "firebase/database";

// ===== KONFIGURACE FIREBASE PROJEKTU =====
// Objekt s přístupovými údaji k Firebase projektu "bweb-9f2f1"
// DŮLEŽITÉ: V produkčním prostředí by tyto údaje měly být v .env souboru!
const firebaseConfig = {
  apiKey: "AIzaSyD7eXWQRlvmJpuE3MSjopUtctvZiS9oQZQ",  // API klíč pro autorizaci požadavků
  authDomain: "bweb-9f2f1.firebaseapp.com",           // Doména pro autentizaci
  databaseURL: "https://bweb-9f2f1-default-rtdb.europe-west1.firebasedatabase.app",  // URL Realtime Database (region: Evropa Západ)
  projectId: "bweb-9f2f1",                            // Unikátní ID projektu
  storageBucket: "bweb-9f2f1.firebasestorage.app",    // Bucket pro ukládání souborů (Firebase Storage)
  messagingSenderId: "490498795009",                  // ID pro Firebase Cloud Messaging (push notifikace)
  appId: "1:490498795009:web:58dcd0689ce46c60768200", // Unikátní ID webové aplikace
  measurementId: "G-2DCRKJV60M"                       // ID pro Google Analytics
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
