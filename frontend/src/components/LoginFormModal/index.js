import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { useHistory } from 'react-router-dom';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
const history = useHistory()
  const disabled = (credential.length < 4 || password.length < 6)
  const className = disabled ? "disabled_button" : "loginButton"


  const handleSubmit = (e) => {
    e.preventDefault();
    // setErrors({});
    // return 
    dispatch(sessionActions.login({ credential, password }))
    .then(closeModal)
    .catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    });
    history.push('/')
  };

  const demoLogin = (e) => {
    e.preventDefault();
    // return 
    dispatch(sessionActions.login({ 
      credential: 'Demo-lition', 
      password: 'password' 
    }))
    .then(closeModal)
    history.push('/')
  };

  return (
    <div className="login_form">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} >
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            className="login_input"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login_input"
            required
          />
        </label>
        <div className="buttons_container">
        <button type="submit" 
        className={className}
        disabled={credential.length < 4 || password.length < 6}>Log In</button>
        {errors.credential && (
            <p className="errors">{errors.credential}</p>
          )}
        <button 
        className="loginButton"
        onClick={demoLogin}>DemoUser</button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
