import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";
import { useHistory } from 'react-router-dom';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const history = useHistory()

  const disabled =
(    username.length < 4 ||
    password.length < 6 ||
    confirmPassword.length < 6 ||
    !email.length ||
    !firstName.length ||
    !lastName.length)
  const className = disabled ? "signup_disabled_button" : "signupButton";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(() => {
          closeModal()
          history.push('/')
        })
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <div className="signup_form_container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="signup_input"
          />
        </label>
        {errors.email && <p className="errors">{errors.email}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="signup_input"
          />
        </label>
        {errors.username && <p className="errors">Username already exists</p>}
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="signup_input"
          />
        </label>
        {errors.firstName && <p className="errors">{errors.firstName}</p>}
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="signup_input"
          />
        </label>
        {errors.lastName && <p className="errors">{errors.lastName}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="signup_input"
          />
        </label>
        {errors.password && <p className="errors">{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="signup_input"
          />
        </label>
        {errors.confirmPassword && <p className="errors">{errors.confirmPassword}</p>}
        <button
          type="submit"
          disabled={
            disabled
          }
          className={className}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
