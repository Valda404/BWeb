import { auth } from './firebaseData.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';

// === FIREBASE AUTH WRAPPER ===
// Zapouzdření (encapsulation) nativních Firebase funkcí
// Skrýváme implementační detaily Firebase SDK před zbytkem React komponent
export const register = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);


// === SPRÁVA UŽIVATELSKÉHO PROFILU ===
// Aktualizace dodatečných metadat uživatele, která nejsou součástí základní e-mailové registrace
export const updateUserName = async (newName) => {
  if (!auth.currentUser) return;
  await updateProfile(auth.currentUser, { displayName: newName });
}


// === LISTENER STAVU RELACE ===
// Sleduje globální přihlášení uživatele (zajišťuje, že uživatel zůstane přihlášený i po obnovení stránky)
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);