import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, Link } from "react-router-dom";
import SignupFormModal from "../SignupFormModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { fetchGroups } from "../../store/groups";
import { fetchEvents } from "../../store/events";
import { fetchEventDetails } from "../../store/events";
import "../Groups/Groups.css";
import "./Events.css";
import EventDetails from "./eventDetails";

function EventsList() {
  const dispatch = useDispatch();



  const eventsObj = useSelector((state) => state.events);
  const events = Object.values(eventsObj);
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  if (!events) return null

//   let upcomingEvents = [];
//   let pastEvents = [];
//   const today = new Date();
  events.forEach((event) => {
    const date = event.startDate;
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    const hours = String(newDate.getHours()).padStart(2, "0");
    const minutes = String(newDate.getMinutes()).padStart(2, "0");
    const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}`;
    event.upcomingEventDate = formattedDate;
    // if (newDate < today) {
    //   pastEvents.push(event);
    // } else {
    //   upcomingEvents.push(event);
    // }
  });

//   upcomingEvents.sort((a, b) => {
//     const dateA = new Date(a.startDate);
//     const dateB = new Date(b.startDate);
//     return dateA - dateB;
//   });

//   pastEvents.sort((a, b) => {
//     const dateA = new Date(a.startDate);
//     const dateB = new Date(b.startDate);
//     return dateB - dateA;
//   });

//   const allEvents = [...upcomingEvents, ...pastEvents];

  return (
    <section className="groups_list_container">
      <div className="groups_events_nav">
        <Link exact to="/events" className="groups_events_nav_groups">
          Events
        </Link>
        <Link exact to="/groups" className="groups_events_nav_events">
          Groups
        </Link>
      </div>
      <div className="groups-in-gatherup"> Events in GatherUp</div>
      <div>
        {events.map((event) => (
          <div key={event.id} >
            <EventDetails id = {event.id}/>
          </div>
        ))}
      </div>
    </section>
  );
}

export default EventsList;
