import { useState } from 'react';
import { login, register } from '../firebase/auth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Zabrání obnovení stránky
    try {
      await login(email, password);
      alert('Přihlášení proběhlo úspěšně!');
    } catch (e) {
      alert('Chyba při přihlášení: ' + e.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Přihlášení</h2>
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <input
        type="password"
        placeholder="Heslo"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <button type="submit">Přihlásit se</button>
    </form>
  );
}