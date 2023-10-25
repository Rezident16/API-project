import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventDetails, fetchEvents } from "../../store/events";
import { Link, NavLink } from "react-router-dom";

function EventDetails({ id }) {
  const dispatch = useDispatch();
  
  const eventsObj = useSelector((state) => state.events);
  const event = eventsObj[id];
  
  useEffect(() => {
      dispatch(fetchEventDetails(id));
    }, [dispatch, id]);

  if (!event || !event.EventImages || event.EventImages.length === 0) {
    return null;
  }

  const previewImage = event.EventImages.find(
    (image) => image.preview === true
  );

  if (!previewImage) {
    return null;
  }

  return (
    <Link
      exact
      to={`/events/${event.id}`}
      className="event-details-container-on-a-group-link"
    >
      <div>
        <div>
          <div>
            <img src={previewImage.url} />
            <div>
              <div>
                {event.upcomingEventDate}
              </div>
              <div>{event.name}</div>
              <div>
                {event.Venue.city}, {event.Venue.state}
              </div>
            </div>
          </div>

          <div>{event.description}</div>
        </div>
      </div>
    </Link>
  );
}

export default EventDetails;
