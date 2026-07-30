import { useState } from "react";
import { login } from "../services/auth.service";
import Loader from "../components/Loaders/Loader";
import { Link, useNavigate } from "react-router-dom";
import { Toast, Notify } from "../components/Toasts/Toast";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [typeOfInput, setType] = useState("password");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [erroMsg, setError] = useState("");
    const navigate = useNavigate();

    async function submitHandler(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await login({ email, password });
            console.log(response.message);
            navigate("/dashboard");
        } catch (e) {
            if (e.response) {
                console.log(e.response.data.message);
                setError(e.response.data.message);
            } else {
                Notify("error", "Network error");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    {/* <span className="auth-logo">⚑</span> */}
                    <span className="auth-brand-name">FlagPulse</span>
                </div>

                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-subtitle">Log in to manage your projects and flags</p>

                <form className="auth-form" onSubmit={(e) => submitHandler(e)}>
                    <div className="auth-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-group">
                            <input
                                id="password"
                                type={typeOfInput}
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                className="visibility-toggle"
                                onClick={() =>
                                    typeOfInput === "password" ? setType("text") : setType("password")
                                }
                                aria-label={
                                    typeOfInput === "password" ? "Show password" : "Hide password"
                                }
                            >
                                {typeOfInput === "password" ? 
                                    <span className="material-symbols-outlined">visibility</span> :
                                    <span className="material-symbols-outlined">visibility_off</span>
                                }
                            </button>
                        </div>
                    </div>

                    {erroMsg && <p className="auth-error">{erroMsg}</p>}

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? <Loader r={5} cx={5} cy={5} /> : "Log in"}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
            <Toast />
        </div>
    );
}

export default Login;