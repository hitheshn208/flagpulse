import { useState } from "react";
import { register } from "../services/auth.service";
import Loader from "../components/Loaders/Loader";
import "./Register.css"
import { Link, useNavigate } from "react-router-dom";
import { Toast, Notify } from "../components/Toasts/Toast";

function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [typeOfInput1, setType1] = useState("password");
    const [typeOfInput2, setType2] = useState("password");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConf, setNewPasswordConf] = useState("");
    const [loading, setLoading] = useState(false);
    const [erroMsg, setError] = useState("");
    const navigate = useNavigate();

    async function submitHandler(e) {
        e.preventDefault();
        if(newPassword !== newPasswordConf){
            setError("Passwords don't match");
            return;
        }
        setLoading(true);
        try {
            const response = await register({name, email, password: newPassword, confirmPassword: newPasswordConf})
            console.log(response.message);
            navigate("/dashboard");
        } catch (e) {
            if (e.response) {
                setError(e.response.data.message)
            } else {
                console.log("Network Error");
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

                <h1 className="auth-title">Register</h1>
                <p className="auth-subtitle">Create an account to manage your projects and feature flags</p>

                <form className="auth-form" onSubmit={(e) => submitHandler(e)}>
                    <div className="auth-field">
                        <label htmlFor="email">Full Name</label>
                        <input
                            id="email"
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            placeholder="Enter you full name"
                            required
                        />
                    </div>

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
                                type={typeOfInput1}
                                onChange={(e) => setNewPassword(e.target.value)}
                                value={newPassword}
                                placeholder="New password"
                                required
                            />
                            <button
                                type="button"
                                className="visibility-toggle"
                                onClick={() =>
                                    typeOfInput1 === "password" ? setType1("text") : setType1("password")
                                }
                                aria-label={
                                    typeOfInput1 === "password" ? "Show password" : "Hide password"
                                }
                            >
                                {typeOfInput1 === "password" ? 
                                    <span className="material-symbols-outlined">visibility</span> :
                                    <span className="material-symbols-outlined">visibility_off</span>
                                }
                            </button>
                        </div>
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">Confirm Password</label>
                        <div className="password-input-group">
                            <input
                                id="password"
                                type={typeOfInput2}
                                onChange={(e) => setNewPasswordConf(e.target.value)}
                                value={newPasswordConf}
                                placeholder="Enter password again"
                                required
                            />
                            <button
                                type="button"
                                className="visibility-toggle"
                                onClick={() =>
                                    typeOfInput2 === "password" ? setType2("text") : setType2("password")
                                }
                                aria-label={
                                    typeOfInput2 === "password" ? "Show password" : "Hide password"
                                }
                            >
                                {typeOfInput2 === "password" ? 
                                    <span className="material-symbols-outlined">visibility</span> :
                                    <span className="material-symbols-outlined">visibility_off</span>
                                }
                            </button>
                        </div>
                    </div>

                    {erroMsg && <p className="auth-error">{erroMsg}</p>}

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? <Loader r={5} cx={5} cy={5} /> : "Register"}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
            <Toast />
        </div>
    );
}

export default Register;