import { listenToUserData, writeUserData } from '../firebase/database';

useEffect(() => {
  console.log('🔄 Načítání dat z Firebase...');
  
  // Test zápisu
  writeUserData('testUser', { name: 'Test', email: 'test@test.cz' })
    .then(() => console.log('✅ Zápis do Firebase OK'))
    .catch(err => console.error('❌ Chyba zápisu:', err));
  
  // Čtení dat
  listenToUserData((data) => {
    console.log('✅ Data z Firebase:', data);
    // Display user data
  });
}, []);