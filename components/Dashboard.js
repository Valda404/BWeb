// ===== DASHBOARD KOMPONENTA (React) =====
// Toto je React komponenta pro testování Firebase připojení
// Demonstruje zápis a čtení dat z Firebase Realtime Database

// Import funkcí pro práci s uživatelskými daty z Firebase
import { listenToUserData, writeUserData } from '../firebase/database';

// React useEffect hook - spustí se při načtení komponenty
useEffect(() => {
  console.log('🔄 Načítání dat z Firebase...');
  
  // ===== TEST ZÁPISU DO FIREBASE =====
  // Zapíše testovací data uživatele do databáze
  writeUserData('testUser', { name: 'Test', email: 'test@test.cz' })
    .then(() => console.log('✅ Zápis do Firebase OK'))  // Úspěch
    .catch(err => console.error('❌ Chyba zápisu:', err)); // Chyba
  
  // ===== ČTENÍ DAT Z FIREBASE (REAL-TIME) =====
  // Naslouchá změnám v datech - callback se volá při každé změně
  listenToUserData((data) => {
    console.log('✅ Data z Firebase:', data);
    // Zde by se data zobrazila v UI (např. nastavení do state)
    // Například: setUserData(data);
  });
}, []); // Prázdné pole závislostí = spustí se jen jednou při načtení komponenty
