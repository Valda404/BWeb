import { db } from './firebaseConfig';
import { ref, set, onValue } from "firebase/database";
import { auth } from './firebaseConfig';

export const writeUserData = (data) => {
  if (!auth.currentUser) return;
  set(ref(db, 'users/' + auth.currentUser.uid), data);
};

export const listenToUserData = (callback) => {
  if (!auth.currentUser) return;
  const userRef = ref(db, 'users/' + auth.currentUser.uid);
  onValue(userRef, (snapshot) => callback(snapshot.val()));
};