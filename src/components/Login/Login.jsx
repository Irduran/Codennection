/* eslint-disable no-unused-vars */
import './Login.css'
import { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  provider,
  auth,
} from '../../credentials';
import {Dashboard} from "../Dashboard/Dashboard"

export const Login = () => {
  const [registrando, setRegistrando] = useState(false);
  const funAuth = async (e) => {
    e.preventDefault();
    const correo = e.target.email.value;
    const contra = e.target.password.value;

    if (registrando) {
      try {
        await createUserWithEmailAndPassword(auth, correo, contra);
      } catch (error) {
        alert("Contraseña no cumple");
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, correo, contra);
      } catch (error) {
        alert("El correo o la contraseña son incorrectos");
      }
    }
  };

  const [value, setValue] = useState("");

  const handleClick = () => {
    signInWithPopup(auth, provider).then((data) => {
      setValue(data.user.email);
      localStorage.setItem("email", data.user.email);
    });
  };

  useEffect(() => {
    setValue(localStorage.getItem("email"));
  });
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-3 offset-md-3 position-absolute top-50 translate-middle start-50">
            <div className="padre">
              <div className="card card-body shadow-lg">
                <img src='src/assets/logo1.png' alt="logo" className="estilo-profile" />
                <form onSubmit={funAuth}>
                  <input
                    type="text"
                    placeholder="Email"
                    className="cajaTexto"
                    id="email"
                    maxLength={50}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="cajaTexto"
                    id="password"
                    maxLength={10}
                  />
                  <button className="btnForm">
                    {registrando ? "Sign up" : "Log in"}
                  </button>
                </form>
                <h6 className='forgot' >Forgot your password?</h6>
                <h4 className="texto">
                  {registrando ? "Already a codennecting?" : "Start codennecting"}
                  <button
                    className="btnswitch"
                    onClick={() => setRegistrando(!registrando)}
                  >
                    {registrando ? "Sign in" : "Here!"}
                  </button>
                </h4>
                {value?<Dashboard/>:
              <button onClick={handleClick}>Sign With Google</button>}
              </div>
            </div>
          </div>
          <div className="col-md-8"></div>
        </div>
      </div>
    </>
  );
};
