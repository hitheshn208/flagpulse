import { useState } from "react";
import { login } from "../services/auth.service";
import Loader from "../components/Loaders/Loader";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [typeOfInput, setType] = useState("password");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [erroMsg, setError] = useState("");
    const navigate = useNavigate();

    async function submitHandler(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await login({email, password})
            console.log(response.message);
            navigate("/dashboard");
        } catch (e) {
            if (e.response) {
                console.log(e.response.data.message);
                setError(e.response.data.message)
            } else {
                console.log("Network Error");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <h1>Login Page</h1>
            <form onSubmit={(e)=> submitHandler(e)}>
                <input type="email" onChange={(e)=>setEmail(e.target.value)} value={email} placeholder="Enter the email" required/>
                <input type={typeOfInput} onChange={(e)=>setPassword(e.target.value)} value={password} placeholder="Enter the password" required/>
                <button type="button" onClick={()=>typeOfInput === "password" ? setType("text") : setType("password")} >Change visibility</button><br />
                <button type="submit">{loading? <Loader/> : "submit"}</button>
            </form>
            <p>{erroMsg}</p>
            <p>
                Don't have an account?{" "}
                <Link to="/register"><div>Register</div></Link>
            </p>
            
        </>
    );
}

export default Login;