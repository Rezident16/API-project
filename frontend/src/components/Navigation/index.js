import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="navigation_container">
      <li className="logo">
        <Link exact to="/" className='nav_logo_text'>
          <div className="nav_logo">
            <img
              className="image_container"
              src="https://cdn-icons-png.flaticon.com/128/2400/2400800.png"
              alt="logo"
            />
            <h3 className="logo_text">GatherUp</h3>
          </div>
        </Link>
      </li>
      {isLoaded && (
        <div className="navigation-right-side-container">
          {sessionUser && (
        <li >
          <Link to='/groups/new' className="event-link">
        Start a new group
          </Link>
        </li>
          )}
        <li>
          <ProfileButton user={sessionUser} />
        </li>
          
        </div>
      )}
    </ul>
  );
}

export default Navigation;
