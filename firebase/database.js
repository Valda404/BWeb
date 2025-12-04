// ===== DATABÁZOVÉ OPERACE PRO FIREBASE =====
// Tento modul obsahuje všechny funkce pro práci s Firebase Realtime Database
// Umožňuje ukládat, číst, aktualizovat a mazat úkoly uživatelů

// Import Firebase databáze a autentizace z hlavního konfiguračního souboru
import { db, auth } from './firebaseData.js';
// Import funkcí pro práci s databází z Firebase SDK
import { ref, set, onValue, push, remove, update } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js';


// #region ===== FUNKCE PRO SPRÁVU ÚKOLŮ =====
/**
 * Uloží celý seznam úkolů do Firebase
 * @param {Array} tasks - Pole všech úkolů uživatele
 * @returns {Promise} - Promise, který se vyřeší po uložení
 */
export const saveTasks = async (tasks) => {
  // Kontrola autentizace
  if (!auth.currentUser) {
    console.error('❌ Uživatel není přihlášen');
    return Promise.reject('Not authenticated');
  }
  // Reference na úkoly daného uživatele: tasks/{userId}
  const tasksRef = ref(db, 'tasks/' + auth.currentUser.uid);
  // Uložení celého pole úkolů (přepíše všechny úkoly)
  await set(tasksRef, tasks);
  console.log('✅ Úkoly uloženy do Firebase');
};
// #endregion


// #region ===== POSLOUCHÁNÍ ZMĚN V ÚKOLECH (REAL-TIME) =====
/**
 * Naslouchá změnám v úkolech (real-time synchronizace)
 * Callback se zavolá pokaždé, když se úkoly změní (přidání, úprava, smazání)
 * @param {Function} callback - Funkce, která dostane aktuální seznam úkolů
 * @param {Function} - Funkce pro zrušení naslouchání
 */
export const listenToTasks = (callback) => {
  // Kontrola přihlášení
  if (!auth.currentUser) {
    console.error('❌ Uživatel není přihlášen');
    return;
  }
  // Reference na úkoly uživatele
  const tasksRef = ref(db, 'tasks/' + auth.currentUser.uid);
  // Listener - volá callback při každé změně
  return onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      console.log('📡 Real-time data received:', data);
      // Pokud nejsou žádné úkoly, vrátí prázdné pole
      callback(data || []);
  });
};
// #endregion


// #region ===== PŘIDÁNÍ NOVÉHO ÚKOLU =====
/**
 * Přidá nový úkol do Firebase
 * @param {Object} task - Objekt s daty úkolu (title, description, date, priority...)
 * @returns {Promise} - Promise, který se vyřeší po přidání
 */
export const addTask = async (task) => {
  // Kontrola autentizace
  if (!auth.currentUser) {
    console.error('❌ Uživatel není přihlášen');
    return Promise.reject('Not authenticated');
  }
  // Reference na seznam úkolů
  const tasksRef = ref(db, 'tasks/' + auth.currentUser.uid);
  // push() vytvoří nový unikátní klíč pro úkol
  const newTaskRef = push(tasksRef);
  // Uložení úkolu pod nově vygenerovaným klíčem
  await set(newTaskRef, task);
  console.log('✅ Úkol přidán s ID:', newTaskRef.key);
  return newTaskRef.key;
};
// #endregion


// #region ===== AKTUALIZACE ÚKOLU =====
/**
 * Aktualizuje existující úkol
 * @param {String} taskId - ID úkolu k aktualizaci
 * @param {Object} taskData - Nová data úkolu (pouze pole, která se mají změnit)
 * @returns {Promise} - Promise, který se vyřeší po aktualizaci
 */
export const updateTask = async (taskId, taskData) => {
  // Kontrola autentizace
  if (!auth.currentUser) {
    console.error('❌ Uživatel není přihlášen');
    return Promise.reject('Not authenticated');
  }
  // Reference na konkrétní úkol: tasks/{userId}/{taskId}
  const taskRef = ref(db, 'tasks/' + auth.currentUser.uid + '/' + taskId);
  // update() aktualizuje pouze zadaná pole, ostatní zůstávají beze změny
  await update(taskRef, taskData);
  console.log('✅ Úkol aktualizován:', taskId);
};
// #endregion


// #region ===== SMAZÁNÍ ÚKOLU =====
/**
 * Smaže úkol z Firebase
 * @param {String} taskId - ID úkolu ke smazání
 * @returns {Promise} - Promise, který se vyřeší po smazání
 */
export const deleteTask = async (taskId) => {
  // Kontrola autentizace
  if (!auth.currentUser) {
    console.error('❌ Uživatel není přihlášen');
    return Promise.reject('Not authenticated');
  }
  // Reference na konkrétní úkol
  const taskRef = ref(db, 'tasks/' + auth.currentUser.uid + '/' + taskId);
  // remove() smaže úkol z databáze
  await remove(taskRef);
  console.log('✅ Úkol smazán:', taskId);
};
// #endregion


// #region ===== FUNKCE PRO UŽIVATELSKÁ DATA =====
/**
 * Zapíše data uživatele do Firebase databáze
 * @param {Object} data - Data k uložení (např. {name: 'Jan', email: 'jan@email.cz'})
 */
export const writeUserData = (data) => {
  // Kontrola, zda je uživatel přihlášen
  if (!auth.currentUser) return;
  // Uložení dat do cesty: users/{userId}
  set(ref(db, 'users/' + auth.currentUser.uid), data);
};
// #endregion


// #region ===== NASLOUCHÁNÍ UŽIVATELSKÝCH DAT =====
/**
 * Naslouchá změnám v uživatelských datech (real-time listener)
 * @param {Function} callback - Funkce, která se zavolá při každé změně dat
 */
export const listenToUserData = (callback) => {
  // Kontrola přihlášení
  if (!auth.currentUser) return;
  // Vytvoření reference na uživatelská data
  const userRef = ref(db, 'users/' + auth.currentUser.uid);
  // Nastavení listeneru - callback se volá pokaždé, když se data změní
  onValue(userRef, (snapshot) => callback(snapshot.val()));
};
// #endregion