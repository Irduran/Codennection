import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import StarryBackground from "../Star/StarryBackground";
import "./Login.css";
import { TypingText } from "../TypingText/TypingText";
import { app, db } from "../../firebase";
import { GoogleAuth } from "../GoogleAuth/GoogleAuth";
import { doc, getDoc } from 'firebase/firestore';
import { Eye, EyeOff } from "lucide-react"; 
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registrando, setRegistrando] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  const auth = getAuth(app);

  const isPasswordStrong = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (registrando) {
        if (!isPasswordStrong(password)) {
          Swal.fire(
            "Weak Password ⚠️",
            "Password must be at least 8 characters long, include one uppercase letter, and one special character(!@#$%^&*).",
            "warning"
          );
          return;
        }
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (!userDoc.exists()) {
          Swal.fire("Sign Up Success! ✨", "You're a Codder Now!🥳", "success");
          navigate("/registro", { state: { user: { email } } });
        } else {
          Swal.fire("Welcome! ⭐", "Have fun 🐤", "success");
          navigate("/dashboard", { state: { user: { email } } });
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        Swal.fire("Welcome Again!!🌟", "You have successfully logged in", "success");
        navigate("/dashboard", { state: { user: { email } } });
      }
    } catch (error) {
      console.error("Error:", error.message);
      
      if (error.code === "auth/email-already-in-use") {
        Swal.fire(
          "Email Already Exists ⚠️",
          "This email is already in use. Try logging in or use a different email.",
          "warning"
        );
      } else if (error.code === "auth/weak-password") {
        Swal.fire(
          "Weak Password 🚫",
          "Password must be at least 6 characters long.",
          "warning"
        );
      } else {
        Swal.fire(
          "Error",
          registrando ? "Something happened... 🥺" : "Email or Password Incorrect‼️",
          "error"
        );
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Swal.fire("Warniiing", "Please, enter your email first 📧", "warning");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire("Email Send 📩", "Check your inbox to reset your password.", "success");
    } catch (error) {
      console.error(error.message);
      Swal.fire("Error", "The reset email could not be sent. ❌", "error");
    }
  };

  return (
    <>
      <StarryBackground />
      <div className="login-page">
        <TypingText text1="Connect With" text2="Others" delay={100} infinite />
        <div className="login-container">
          <img
            src="src/assets/codennectionlogo_white.png"
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
            <div className="password-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            <button type="submit" className="login-button" id="login">
              {registrando ? "Sign up" : "Login"}
            </button>
          </form>
          <p className="forgot-password" onClick={handleForgotPassword}>
            Forgot Password?
          </p>
          <GoogleAuth />
          <p className="texto">
            {registrando ? "Already a Codder?" : "Start Codennecting"}
            <button className="btnswitch" onClick={() => setRegistrando(!registrando)}>
              {registrando ? "Login" : "Here!"}
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
