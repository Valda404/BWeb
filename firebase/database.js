import { db } from './firebase';
import { ref, set, onValue, push, remove, update } from "firebase/database";
import { auth } from './firebase';

export const writeUserData = (data) => {
  if (!auth.currentUser) return;
  set(ref(db, 'users/' + auth.currentUser.uid), data);
};

export const listenToUserData = (callback) => {
  if (!auth.currentUser) return;
  const userRef = ref(db, 'users/' + auth.currentUser.uid);
  onValue(userRef, (snapshot) => callback(snapshot.val()));
};

// Tasks functions
export const saveTasks = (tasks) => {
  if (!auth.currentUser) {
    console.error('❌ Uživatel není přihlášen');
    return Promise.reject('Not authenticated');
  }
  const tasksRef = ref(db, 'tasks/' + auth.currentUser.uid);
  return set(tasksRef, tasks);
};

export const listenToTasks = (callback) => {
  if (!auth.currentUser) {
    console.error('❌ Uživatel není přihlášen');
    return;
  }
  const tasksRef = ref(db, 'tasks/' + auth.currentUser.uid);
  onValue(tasksRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || []);
  });
};

export const addTask = (task) => {
  if (!auth.currentUser) {
    console.error('❌ Uživatel není přihlášen');
    return Promise.reject('Not authenticated');
  }
  const tasksRef = ref(db, 'tasks/' + auth.currentUser.uid);
  const newTaskRef = push(tasksRef);
  return set(newTaskRef, task);
};

export const updateTask = (taskId, taskData) => {
  if (!auth.currentUser) {
    console.error('❌ Uživatel není přihlášen');
    return Promise.reject('Not authenticated');
  }
  const taskRef = ref(db, 'tasks/' + auth.currentUser.uid + '/' + taskId);
  return update(taskRef, taskData);
};

export const deleteTask = (taskId) => {
  if (!auth.currentUser) {
    console.error('❌ Uživatel není přihlášen');
    return Promise.reject('Not authenticated');
  }
  const taskRef = ref(db, 'tasks/' + auth.currentUser.uid + '/' + taskId);
  return remove(taskRef);
};
