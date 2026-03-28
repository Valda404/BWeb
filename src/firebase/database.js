import { db, auth } from './firebaseData.js';
import { ref, set, onValue, push, remove, update } from 'firebase/database';


// === NORMALIZACE DAT ===
// Převede Firebase formát (objekt s unikátními klíči) na standardní pole objektů s vlastností 'id'
export const normalizeData = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data.map((item, index) => ({ id: String(index), ...item }))
  return Object.entries(data).map(([id, item]) => ({ id, ...item }))
}


// === REAL-TIME LISTENERY ===
// Udržují nepřetržité spojení s databází. Jakmile dojde ke změně na serveru, automaticky pošlou nová data do aplikace, což eliminuje nutnost manuálního obnovování okna
export const listenToTasks = (callback) => {
  if (!auth.currentUser) return;
  const tasksRef = ref(db, 'tasks/' + auth.currentUser.uid);
  return onValue(tasksRef, (snapshot) => callback(snapshot.val() || []));
};

export const listenToGoals = (callback) => {
  if (!auth.currentUser) return;
  const goalsRef = ref(db, 'goals/' + auth.currentUser.uid);
  return onValue(goalsRef, (snapshot) => callback(snapshot.val() || []));
};


// === OPERACE PRO ÚKOLY ===
// Zápis, úprava a mazání. Cesty jsou vždy striktně vázány na UID aktuálně přihlášeného uživatele (bezpečnostní pravidlo a izolace dat)
export const addTask = async (task) => {
  if (!auth.currentUser) return Promise.reject('Not authenticated');
  const newTaskRef = push(ref(db, 'tasks/' + auth.currentUser.uid));
  await set(newTaskRef, task);
  return newTaskRef.key;
};

export const updateTask = async (taskId, taskData) => {
  if (!auth.currentUser) return Promise.reject('Not authenticated');
  await update(ref(db, 'tasks/' + auth.currentUser.uid + '/' + taskId), taskData);
};

export const deleteTask = async (taskId) => {
  if (!auth.currentUser) return Promise.reject('Not authenticated');
  await remove(ref(db, 'tasks/' + auth.currentUser.uid + '/' + taskId));
};


// === OPERACE PRO CÍLE (OKR METODIKA) ===
export const addGoal = async (goal) => {
  if (!auth.currentUser) return Promise.reject('Not authenticated');
  const newGoalRef = push(ref(db, 'goals/' + auth.currentUser.uid));
  await set(newGoalRef, goal);
  return newGoalRef.key;
};

export const updateGoal = async (goalId, goalData) => {
  if (!auth.currentUser) return Promise.reject('Not authenticated');
  await update(ref(db, 'goals/' + auth.currentUser.uid + '/' + goalId), goalData);
};

export const deleteGoal = async (goalId) => {
  if (!auth.currentUser) return Promise.reject('Not authenticated');
  await remove(ref(db, 'goals/' + auth.currentUser.uid + '/' + goalId));
};