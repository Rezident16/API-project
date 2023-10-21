import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import "./LandingPage.css";
// import LandingPage from './index';
import { NavLink, useHistory } from 'react-router-dom';
import SignupFormModal from "../SignupFormModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";

function LandingPage() {
    const history = useHistory()
    const sessionUser = useSelector(state => state.session.user)
    const userClass = sessionUser ? 'user_logged_in_class' : 'user_not_logged_in'

    const handleClick = (e) => {
        e.preventDefault()
        // SignupFormModal()
    }

  return (
    <div className="landing_page_container">
      <div className="about_us_main_container">
        <div className="about_us_text">
          <h1>Meet, Mingle, Make Friends: Unite Your Hobbies with GatherUp!</h1>
          <p>
            Join GatherUp to bond with fellow hobby enthusiasts. From hiking to
            networking, we offer daily events for you to make friends and create
            memorable experiences. Connect now and unite through shared
            interests!
          </p>
        </div>
        <div className="landing_page_image_container">
          <img src="https://media.istockphoto.com/id/1257101256/vector/happy-people-jumping-celebrating-victory-flat-cartoon-characters-illustration.jpg?s=612x612&w=0&k=20&c=mjajhkk2Ylq69UaJMIKZRlF27qHuWJMcZPb9LxmUxqs=" />
        </div>
      </div>
      <div className="how_does_it_work_container">
        <h2>How GatherUp works</h2>
        <p>
          People use GatherUp to meet new friends, expand their knowledge, find
          encouragement, step beyond their comfort zones, and chase their
          passions, all without any membership fees.
        </p>
      </div>
      <div className="see_groups_events_start_new_container">
        <div className="sub_see_groups_events_start_new_container">
          <img className='about_us_img' src="https://img.freepik.com/free-vector/group-happy-smiling-people-looking-up-top-view-white-background-flat-vector-illustration_1284-78599.jpg" />
          <NavLink to='/groups' className="see_groups_events_start_new_container_link">See All Groups</NavLink>
        </div>
        <div className="sub_see_groups_events_start_new_container">
          <img className='about_us_img'  src="https://img.freepik.com/premium-vector/group-friends-hanging-out-home-talking-playing-music-drinking-wine-eating-chips_318844-306.jpg" />
          <NavLink to='/events' className="see_groups_events_start_new_container_link"> Find an event</NavLink>
        </div>
        <div className="sub_see_groups_events_start_new_container">
          <img className='about_us_img'  src="https://media.istockphoto.com/id/1405367167/vector/team-with-young-people-character-standing-together-with-folded-arms-and-smiling-vector.jpg?s=612x612&w=0&k=20&c=JkdtiWDbErQpoxbhqv_7K2A0mzsDnmVzP_vUZrrPNZM=" />
          <NavLink to='/groups/new' className={userClass}>Start a group</NavLink>
        </div>
      </div>
      {!sessionUser && (
          <div className="join_us"><button 
          className="see_groups_events_start_new_container_button">
            <OpenModalMenuItem
          itemText='Join GatherUp'
          modalComponent={<SignupFormModal />}
          /></button></div>
      )}
    </div>
  );
}

export default LandingPage;
