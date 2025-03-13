import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import StarryBackground from "../Star/StarryBackground";
import "./Login.css";
import { TypingText } from "../TypingText/TypingText";
import { app } from "../../firebase"; 
import { GoogleAuth } from "../GoogleAuth/GoogleAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registrando, setRegistrando] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth(app);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (registrando) {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("Usuario registrado:", email);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Usuario logueado:", email);
      }
      navigate("/dashboard", { state: { user: { email } } });
    } catch (error) {
      console.error("Error:", error.message);
      alert(registrando ? "Error en el registro" : "Error en el inicio de sesión");
    }
  };

  return (
    <>
      <StarryBackground />
      <div className="login-page">
        <TypingText text1="Connect With" text2="Others" delay={100} infinite />
        <div className="login-container">
          <img
            src="src\assets\codennectionlogo_white.png"
            alt="Logo"
            className="image"
          />
          <form onSubmit={handleLogin}>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-button" id="login">
              {registrando ? "Sign up" : "Login"}
            </button>
          </form>
          <p
              className="forgot-password"
              onClick={() => alert("Forgot Password clicked")}>
              Forgot Password?
            </p>
          <GoogleAuth/>
          <p className="texto">
            {registrando ? "Already a Codder?" : "Start Codennecting"}
            <button
              className="btnswitch"
              onClick={() => setRegistrando(!registrando)}
            >
              {registrando ? "Login" : "Here!"}
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;