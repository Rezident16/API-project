import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    const errorsObj = {}
    if (credential.length < 4) errorsObj.username = "Username/Email must be at least 4 characters"
    if (password.length < 6) errorsObj.password="password must be at least 6 characters"

    setErrors(errorsObj)
  }, [credential, password])

  const handleSubmit = (e) => {
    e.preventDefault();
    // setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
    .then(closeModal)
    .catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    });

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
            required
          />
        </label>
          {/* {errors.username && (
            <p className="errors">{errors.username}</p>
          )} */}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {/* {errors.password && (
            <p className="errors">{errors.password}</p>
          )} */}
        <button type="submit" disabled={Object.keys(errors).length}>Log In</button>
        {errors.credential && (
            <p className="errors">{errors.credential}</p>
          )}
      </form>
    </div>
  );
}

export default LoginFormModal;
