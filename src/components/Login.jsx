import { useState } from "react";
import { login, register } from "../firebase/auth.js";

function Login() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isRegistering) {
                await register(email, password);
            } else {
                await login(email, password);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                {/*Přepnutí režimu*/}
                <div style={styles.toggle}>
                    <button
                        style={isRegistering ? styles.toggleActive : styles.toggleInactive}
                        onClick={() => { setIsRegistering(false); setError(""); }}
                        type="button"
                    >
                        Přihlášení
                    </button>
                    <button
                        style={!isRegistering ? styles.toggleActive : styles.toggleInactive}
                        onClick={() => { setIsRegistering(true); setError(""); }}
                        type="button"
                    >
                        Registrace
                    </button>
                </div>

                <h2 style={styles.heading}>{isRegistering ? "Registrace" : "Přihlášení"}</h2>

                <form style={styles.form} onSubmit={handleSubmit}>
                    <label style={styles.label}>Email</label>
                    <input
                        type="email"
                        placeholder="Vas@email.cz"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <label style={styles.label}>Heslo</label>
                    <input
                        type="password"
                        placeholder="Minimálně 6 znaků"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />

                    {error && <p style={styles.error}>{error}</p>}

                    <button type="submit" disabled={loading} style={styles.submitBtn}>
                        {loading ? 'Načítání' : isRegistering ? "Registrace" : "Přihlášení"}
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  card: {
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '2rem 2.5rem',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  toggle: {
    display: 'flex',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #333',
    marginBottom: '1.5rem',
  },
  toggleActive: {
    flex: 1,
    padding: '0.5em',
    background: '#646cff',
    color: '#fff',
    border: 'none',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  toggleInactive: {
    flex: 1,
    padding: '0.5em',
    background: 'transparent',
    color: 'rgba(255,255,255,0.5)',
    border: 'none',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  heading: {
    margin: '0 0 1.5rem',
    fontSize: '1.4rem',
    fontWeight: 600,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.6)',
    marginTop: '0.6rem',
  },
  input: {
    padding: '0.6em 0.8em',
    borderRadius: '6px',
    border: '1px solid #444',
    background: '#242424',
    color: 'rgba(255,255,255,0.87)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '0.85rem',
    margin: '0.5rem 0 0',
  },
  submitBtn: {
    marginTop: '1.2rem',
    padding: '0.65em',
    background: '#646cff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    opacity: 1,
  },
}

export default Login;