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

  useEffect(() => {
      dispatch(fetchEvents());
    }, [dispatch]);
    
    const eventsObj = useSelector((state) => state.events);
    const events = Object.values(eventsObj);
  //   useEffect (() => {
  //     events.forEach(event => {
  //         dispatch (fetchEventDetails(event.id))
  //     })
  //   }, [dispatch])
  if (!events) return null;

  let upcomingEvents = [];
  let pastEvents = [];
  const today = new Date();
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
    if (newDate < today) {
      pastEvents.push(event);
    } else {
      upcomingEvents.push(event);
    }
  });

  upcomingEvents.sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateA - dateB;
  });

  pastEvents.sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateB - dateA;
  });

  const allEvents = [...upcomingEvents, ...pastEvents];

  return (
    <section className="groups_list_container">
      <div className="groups_events_nav">
        <Link exact to="/events" className="events_nav_groups">
          Events
        </Link>
        <Link exact to="/groups" className="events_nav_events">
          Groups
        </Link>
      </div>
      <div className="groups-in-gatherup"> Events in GatherUp</div>
      <div className="test">
        {allEvents.map((event) => (
          <Link
            exact
            to={`/events/${event.id}`}
            className="events_list_details_container"
          >
              <div className="event_image_quickdesc">
                <div className="event groups_list_images">
                  <img src={event.previewImage} />
                </div>
                <div className="events_location_name">
                  <div>{event.upcomingEventDate.replace(/\//g, '-')}</div>
                  <h2>{event.name}</h2>
                  <h4>
                    {/* {event.Venue.city},{event.Venue.state} */}
                  </h4>
                </div>
              </div>
              <div className="event_list_description">{event.description}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default EventsList;
