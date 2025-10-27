import { login, register } from '../firebase/auth';

const handleLogin = async (email, password) => {
  try {
    await login(email, password);
    // Redirect or show dashboard
  } catch (e) {
    // Handle error
  }
};