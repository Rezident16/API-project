import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, Link } from "react-router-dom";
import SignupFormModal from "../SignupFormModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { fetchGroups } from "../../store/groups";
import { fetchEvents } from "../../store/events";
import "./Groups.css";

function GroupsList() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGroups());
    dispatch(fetchEvents());
  }, [dispatch]);
  const groupsObj = useSelector((state) => state.groups);
  const groups = Object.values(groupsObj);

  const eventsObj = useSelector((state) => state.events);
  const events = Object.values(eventsObj);
  console.log(events);

  return (
    <section className="groups_list_container">
        <div className="groups_events_nav">
            <Link exact to='/groups' className="groups_events_nav_groups">Groups</Link>
            <Link exact to='/events'className="groups_events_nav_events">Events</Link>
        </div>
      {groups.map((group) => (
        <Link exact to={`/groups/${group.id}`} key={group.id} className="groups_list_details_container">
          <div className="groups_list_images">
            <img src={group.previewImage} />
          </div>
          <div className="groups_list_data">
            <div className="location_name">
              <h2>{group.name}</h2>
              <h4>
                {group.city}, {group.state}
              </h4>
              <p>{group.about}</p>
            </div>
            <div className="groups_list_events_container">
              <div >
                {events.filter((event) => event.groupId === group.id).length} events
              </div>
              {!group.private && <div className="public">Public</div>}
              {group.private && <div className="public">Private</div>}
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}

export default GroupsList;
