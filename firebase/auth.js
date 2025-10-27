// ===== AUTENTIZAČNÍ FUNKCE PRO FIREBASE =====
// Tento modul obsahuje wrapper funkce pro Firebase Authentication
// Zjednodušuje registraci, přihlášení a odhlášení uživatelů

// Import autentizačního objektu z hlavní Firebase konfigurace
import { auth } from './firebaseConfig';
// Import potřebných funkcí z Firebase Auth SDK
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

/**
 * Registrace nového uživatele
 * @param {String} email - Email uživatele
 * @param {String} password - Heslo (minimálně 6 znaků)
 * @returns {Promise} - Promise s daty nově vytvořeného uživatele
 */
export const register = (email, password) => createUserWithEmailAndPassword(auth, email, password);

/**
 * Přihlášení existujícího uživatele
 * @param {String} email - Email uživatele
 * @param {String} password - Heslo uživatele
 * @returns {Promise} - Promise s daty přihlášeného uživatele
 */
export const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

/**
 * Odhlášení aktuálně přihlášeného uživatele
 * @returns {Promise} - Promise, který se vyřeší po odhlášení
 */
export const logout = () => signOut(auth);
