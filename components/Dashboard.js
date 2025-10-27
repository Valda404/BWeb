import { listenToUserData, writeUserData } from '../firebase/database';

useEffect(() => {
  listenToUserData((data) => {
    // Display user data
  });
}, []);