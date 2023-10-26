import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventDetails, fetchEvents } from "../../store/events";
import { Link, NavLink } from "react-router-dom";
import "./Events.css";
import { useParams } from "react-router-dom";
import { loadGroupData } from "../../store/groups";
import { fetchGroups } from "../../store/groups";
import { deleteEvents } from "../../store/events";
import { useHistory } from "react-router-dom";
import DeleteEventButtonModal from "./deleteEvent";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";

function formatEventDate(date) {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, "0");
  const day = String(newDate.getDate()).padStart(2, "0");
  const hours = String(newDate.getHours()).padStart(2, "0");
  const minutes = String(newDate.getMinutes()).padStart(2, "0");
  return `${year}/${month}/${day} · ${hours}:${minutes}`;
}

function EventDetails() {
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const id = parseInt(eventId);
  const eventsObj = useSelector((state) => state.events);
  const groupsObj = useSelector((state) => state.groups);
  const event = eventsObj[id];
  const sessionUser = useSelector((state) => state.session.user);
    const history = useHistory()

  useEffect(() => {
    if (event) {
        dispatch(fetchEventDetails(id));
    }
    // dispatch(dispatch(fetchGroups));
  }, [dispatch, id]);

  useEffect(() => {
    if (event && event.groupId) {
      dispatch(loadGroupData(event.groupId));
    }
  }, [dispatch, event]);

  if (!event) return null;

  if (!event || !event.EventImages || event.EventImages.length === 0) {
    return null;
  }
  const group = groupsObj[event.groupId];
  if (!group || !group.Organizer) return null;

  const previewImage = event.EventImages.find(
    (image) => image.preview === true
  );
  event.previewImage = previewImage;

  if (group.private === true) {
    group.isPrivate = "Private";
  } else {
    group.isPrivate = "Public";
  }
  const startDate = event.startDate;
  const eventStartDate = formatEventDate(startDate);
  event.upcomingEventDate = eventStartDate;

  const endDate = event.endDate;
  const eventEndDate = formatEventDate(endDate);
  event.upcomingEndDate = eventEndDate;

  if (event.price == 0) {
    event.price = "FREE";
  } else {
    let eventPrice = Number(event.price);
    event.price = eventPrice.toFixed(2);
  }

  return (
    <div>
      <div className="event_upper_description">
        <div>
          {"<"}
          <Link to="/events">Events</Link>
        </div>
        <h1>{event.name}</h1>
        <h4 className="event_group_info_text_isPrivate">
          Hosted by {group.Organizer.firstName} {group.Organizer.lastName}
        </h4>
      </div>
      <div className="event-details-container">
        <div className="photo_event_info">
          <img className="event_details_img" src={previewImage.url} />
          <div className="event_all_details">
            <div className="event_group_info">
              <img
                className="event_group_details_img"
                src={group.previewImage}
              />
              <div className="event_group_info_text">
                <h4>{group.name}</h4>
                <h4 className="event_group_info_text_isPrivate">
                  {group.isPrivate}
                </h4>
              </div>
            </div>
            <div className="event_details_info">
              <div className="event_each_detail">
                <img
                  className="icon_on_events"
                  src="https://static.vecteezy.com/system/resources/previews/019/873/849/original/clock-icon-transparent-free-icon-free-png.png"
                />
                <div className="event_timeline_container">
                  <div className="event_timeline event_timeline_text">
                    <h4>START</h4>
                    <h4>END</h4>
                  </div>
                  <div className="event_timeline event_timeline_date">
                    <h4>{event.upcomingEventDate.replace(/\//g, '-')}</h4>
                    <h4>{event.upcomingEndDate.replace(/\//g, '-')}</h4>
                  </div>
                </div>
              </div>
              <div className="event_each_detail">
                <img
                  className="icon_on_events"
                  src="https://cdn-icons-png.flaticon.com/512/1194/1194711.png"
                />
                {event.price > 0 ? <div>$ {event.price}</div> : <div>FREE</div>}
              </div>
              <div className="event_each_detail_with_delete">
                <div className="event_type_text">
                  <img
                    className="icon_on_events"
                    src="https://cdn-icons-png.flaticon.com/512/535/535239.png"
                  />
                  <div className="event_timeline">{event.type}</div>
                </div>
                {
                    sessionUser.id === group.Organizer.id && (

                <button className="event_button"><OpenModalMenuItem
                itemText='Delete'
                modalComponent={<DeleteEventButtonModal id={event.id} groupId={group.id}/>}
                /></button>
                    )
                }
              </div>
            </div>
          </div>
        </div>

        <div className="event_details_description">
          <h2>Details</h2>
          <p>{event.description}</p>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
