import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventsbyGroupId } from "../../store/events";
import { useHistory, Link } from "react-router-dom/";
import "./Groups.css";

function EventList({ groupId }) {
  const dispatch = useDispatch();
  const history = useHistory;
  const today = new Date();
  useEffect(() => {
    const attempt = async () => {
      try {
        await dispatch(fetchEventsbyGroupId(groupId));
      } catch (e) {
        if (e) history.push("/groups");
      }
    };
    attempt();
  }, [groupId]);

  const eventsObj = useSelector((state) => state.events);
  let events = Object.values(eventsObj);

  let upcomingEvents = [];
  let pastEvents = [];

  events.forEach((event) => {
    const date = event.startDate;
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    let hours = String(newDate.getHours()).padStart(2, "0");
    let time = hours >= 12 && hours < 24 ? 'PM' : 'AM'
    hours = hours > 12 && hours < 24 ? hours - 12 : hours
    hours = hours == 0 ? 12 : hours
    const minutes = String(newDate.getMinutes()).padStart(2, "0");
    const formattedDate = `${year}/${month}/${day} · ${hours}:${minutes} ${time}`;
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

  return (
    <div className="past_upcoming_events_container">
          {upcomingEvents.length > 0 && (
            <div>
              <div className="event_type">
                Upcoming Events ({upcomingEvents.length})
              </div>
              {upcomingEvents.map((event) => (
                <div>
                  {/* <EventDetailsForAGroup id={event.id} /> */}
                  <Link
                    exact
                    to={`/events/${event.id}`}
                    className="event-details-container-on-a-group-link"
                  >
                    <div className="event-details-container-on-a-group">
                      <div className="event-details-container-on-a-group-upper">
                        <div className="image_group_details">
                          <img src={event.previewImage} />
                          <div>
                            <div className="event-list-event-date">
                              {event.upcomingEventDate}
                            </div>
                            <div className="event-list-event-name">
                              {event.name}
                            </div>
                            <div className="event-list-event-location">
                              {event.Venue.city}, {event.Venue.state}
                            </div>
                          </div>
                        </div>
                        <div className="event_description">{event.description}</div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
          {pastEvents.length > 0 && (
            <div>
              <div className="event_type">
                Past Events ({pastEvents.length})
              </div>
              {pastEvents.map((event) => (
                <div>
                  {/* <EventDetailsForAGroup id={event.id} /> */}
                  <Link
                    exact
                    to={`/events/${event.id}`}
                    className="event-details-container-on-a-group-link"
                  >
                    <div className="event-details-container-on-a-group">
                      <div className="event-details-container-on-a-group-upper">
                        <div className="image_group_details">
                          <img src={event.previewImage} />
                          <div>
                            <div className="event-list-event-date">
                              {event.upcomingEventDate}
                            </div>
                            <div className="event-list-event-name">
                              {event.name}
                            </div>
                            <div className="event-list-event-location">
                              {event.Venue.city}, {event.Venue.state}
                            </div>
                          </div>
                        </div>
                        <div className="event_description">{event.description}</div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
  )
}

export default EventList;
