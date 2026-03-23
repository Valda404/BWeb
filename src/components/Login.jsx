import { useState } from "react";
import { login, register } from "../firebase/auth.js";
import { CheckCircle } from "lucide-react";


// === LOKÁLNÍ STAVY ===
// Řízení chování formuláře a přepínání uživatelského rozhraní
function Login() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    // === AUTENTIZACE A FIREBASE ===
    // Jednotná funkce pro ošetření loginu i registrace s asynchronním chytáním chyb
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


    // === VYKRESLENÍ UŽIVATELSKÉHO ROZHRANÍ ===
    // Rozdělení obrazovky (split-screen) pro moderní vzhled na velkých displejích
    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Levý panel — branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 flex-col justify-between p-12">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-white font-semibold text-lg tracking-tight">Soustředění</span>
                </div>

                <div>
                    <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                        Vaše úkoly.<br />Vaše cíle.<br />Váš fokus.
                    </h1>
                    <p className="text-indigo-200 text-base leading-relaxed max-w-sm">
                        Jednoduchý GTD nástroj pro lidi, kteří chtějí mít věci pod kontrolou.
                    </p>
                </div>

                <p className="text-indigo-300 text-sm">© 2026 Soustředění</p>
            </div>

            {/* Pravý panel — formulář */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm">

                    {/* Logo (mobile) */}
                    <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-gray-900 font-semibold text-lg tracking-tight">Soustředění</span>
                    </div>

                    {/* Nadpis */}
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {isRegistering ? "Vytvořit účet" : "Vítejte zpět"}
                    </h2>
                    <p className="text-gray-500 text-sm mb-8">
                        {isRegistering
                            ? "Začněte sledovat své úkoly a cíle ještě dnes."
                            : "Všechny vaše úkoly a cíle na jednom místě."}
                    </p>

                    {/* Formulář */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                E-mailová adresa
                            </label>
                            <input
                                type="email"
                                placeholder="vas@email.cz"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Heslo
                            </label>
                            <input
                                type="password"
                                placeholder="Minimálně 6 znaků"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm shadow-sm"
                        >
                            {loading ? "Načítání…" : isRegistering ? "Vytvořit účet" : "Přihlásit se"}
                        </button>
                    </form>

                    {/* Přepínač režimu */}
                    <p className="mt-6 text-center text-sm text-gray-500">
                        {isRegistering ? "Již máte účet?" : "Ještě nemáte účet?"}{" "}
                        <button
                            type="button"
                            onClick={() => { setIsRegistering(!isRegistering); setError(""); }}
                            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                        >
                            {isRegistering ? "Přihlásit se" : "Zaregistrovat se"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;