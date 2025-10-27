import { login, register } from '../firebase/auth';

const handleLogin = async (email, password) => {
  try {
    await login(email, password);
    alert('Přihlášení proběhlo úspěšně!');
  } catch (e) {
    alert('Chyba při přihlášení: ' + e.message);
  }
};