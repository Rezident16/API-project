import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import {useHistory} from 'react-router-dom'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory()
  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  const redirectToGroups = (e) => {
    e.preventDefault()
    setShowMenu(false);
    history.push('/groups')
  }

  const redirectToEvents = (e) => {
    e.preventDefault()
    setShowMenu(false);
    history.push('/events')
  }

  return (
    <>
      {user ? (
        <>
          <button onClick={openMenu} className="user_icon_button">
            <i className="fas fa-user-circle" />
            {/* < img className="user_icon" src='https://assets.materialup.com/uploads/b6c33467-82c3-442c-a2dc-c089bbff9fa1/preview.png'/> */}
            
          </button>
          <ul className={ulClassName} ref={ulRef}>
            {/* <li>{user.username}</li> */}
            <li>Hello, {user.firstName}</li>
            <li>{user.email}</li>
            <li className="seperator"></li>
            <li className = 'profile_buttons'onClick={redirectToGroups}>View Groups</li>
            <li className = 'profile_buttons'onClick={redirectToEvents}>View Events</li>
            <li className="logout_button_container">
              <button className="logout_button" onClick={logout}>
                Log Out
              </button>
            </li>
          </ul>
        </>
      ) : (
        <div className="login_signup_container">
          <div>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
          </div>
          <div>
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileButton;
