// ===== IMPORTY =====
// Importujeme useState - React hook, který umožňuje ukládat data v komponentě
import { useState } from 'react';
// Importujeme funkce pro přihlášení a registraci z našeho Firebase modulu
import { login, register } from '../firebase/auth';

// ===== HLAVNÍ KOMPONENTA PŘIHLAŠOVACÍHO FORMULÁŘE =====
// Tato funkce vytváří a vrací přihlašovací formulář
export default function LoginForm() {
  // ----- STATE PROMĚNNÉ -----
  // Vytvoříme proměnnou "email" pro uložení emailu, který uživatel zadá
  // setEmail je funkce, kterou můžeme měnit hodnotu emailu
  // useState('') znamená, že na začátku je email prázdný řetězec
  const [email, setEmail] = useState('');
  
  // Stejně jako email, vytvoříme proměnnou pro heslo
  // Na začátku je také prázdné
  const [password, setPassword] = useState('');

  // ----- FUNKCE PRO ZPRACOVÁNÍ PŘIHLÁŠENÍ -----
  // "async" znamená, že funkce může čekat na dokončení operací (např. přihlášení)
  // "e" je událost (event), která se stane když uživatel odešle formulář
  const handleLogin = async (e) => {
    // Zabrání tomu, aby se stránka obnovila po odeslání formuláře
    // (standardní chování formuláře, které nechceme)
    e.preventDefault();
    
    // "try" znamená "zkus toto udělat"
    try {
      // Počkej (await) na přihlášení uživatele pomocí emailu a hesla
      // Toto volá Firebase, aby ověřilo údaje
      await login(email, password);
      // Pokud přihlášení proběhlo v pořádku, ukáže se tato zpráva
      alert('Přihlášení proběhlo úspěšně!');
    } catch (e) {
      // Pokud se něco pokazilo (např. špatné heslo), ukáže se chybová zpráva
      alert('Chyba při přihlášení: ' + e.message);
    }
  };

  // ----- VRÁCENÍ HTML KÓDU (TO, CO SE ZOBRAZÍ NA STRÁNCE) -----
  return (
    // Formulář - když uživatel klikne na tlačítko Submit, zavolá se handleLogin
    <form onSubmit={handleLogin}>
      {/* Nadpis formuláře */}
      <h2>Přihlášení</h2>
      
      {/* Input pole pro email */}
      <input
        type="email"              // Typ "email" zajistí validaci emailové adresy
        placeholder="Email"       // Text, který se zobrazí v prázdném poli
        value={email}             // Aktuální hodnota je z naší proměnné "email"
        onChange={(e) => setEmail(e.target.value)}  // Když uživatel píše, uložíme to do "email"
        required                  // Pole je povinné - nelze odeslat prázdné
      />
      
      {/* Input pole pro heslo */}
      <input
        type="password"           // Typ "password" skryje znaky hesla (•••)
        placeholder="Heslo"       // Text, který se zobrazí v prázdném poli
        value={password}          // Aktuální hodnota z proměnné "password"
        onChange={(e) => setPassword(e.target.value)}  // Při psaní uložíme do "password"
        required                  // Pole je povinné
      />
      
      {/* Tlačítko pro odeslání formuláře */}
      <button type="submit">Přihlásit se</button>
    </form>
  );
}