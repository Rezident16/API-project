import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, Link, useParams } from "react-router-dom";
import SignupFormModal from "../SignupFormModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { fetchGroups, loadGroupData } from "../../store/groups";
import "./Groups.css";
import { fetchEventsbyGroupId } from "../../store/events";
import EventDetailsForAGroup from "./eventsDetails";

function GroupDetails() {
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const id = parseInt(groupId);
  const [currentImage, setCurrentImage] = useState(0);
  const sessionUser = useSelector((state) => state.session.user);
  let userClass = sessionUser
    ? "user_logged_in_group"
    : "user_not_logged_in_group";

  useEffect(() => {
    dispatch(fetchEventsbyGroupId(id));
    dispatch(loadGroupData(id));
  }, [dispatch, id]);

  const groupSelector = useSelector((state) => state.groups);
  const eventsObj = useSelector((state) => state.events);
  let events = Object.values(eventsObj);

  if (!Object.keys(groupSelector).length) return null;

  const group = groupSelector[groupId];
  const organizer = group.Organizer;
  if (!organizer) return null;
  const groupImages = group.GroupImages;

  const changeImageNext = () => {
    const nextIndex = (currentImage + 1) % groupImages.length;
    setCurrentImage(nextIndex);
  };

  const changeImagePrevious = () => {
    const previousIndex =
      (currentImage - 1 + groupImages.length) % groupImages.length;
    setCurrentImage(previousIndex);
  };

  const joinGroupButton = () => {
    alert("Feature Coming Soon...");
  };
  const disabled = () => {
    if (groupImages.length > 1) {
      return "enabled_next_image_button";
    }
    return "disabled_next_image_button";
  };

  const today = new Date();
  events = events.filter((event) => event.groupId === group.id);

  let upcomingEvents = [];
  let pastEvents = [];

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
    return dateA - dateB;
  });


  //   const hours = String(newDate.getUTCHours()).padStart(2, '0');
  // const minutes = String(newDate.getUTCMinutes()).padStart(2, '0');
  // const seconds = String(newDate.getUTCSeconds()).padStart(2, '0');

  // const formattedDateTime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;

  return (
    <section className="group_details_whole_container">
      <div>
        <div>
          {"<"}
          <Link to="/groups">Groups</Link>
        </div>
        <div className="group_upper_container">
          <div className="groupImage">
            {groupImages && (
              <img
                className="main_group_image"
                src={groupImages[currentImage].url}
              />
            )}
            <div>
              {groupImages && (
                <ul className="next_previos">
                  <button
                    onClick={changeImagePrevious}
                    disabled={groupImages.length === 1}
                    className={disabled()}
                  >
                    Previous
                  </button>
                  <button
                    onClick={changeImageNext}
                    disabled={groupImages.length === 1}
                    className={disabled()}
                  >
                    Next
                  </button>
                </ul>
              )}
            </div>
          </div>
          <div className="groupInfo">
            <div className="group_text_info">
              <h1>{group.name}</h1>
              <div className="group_text_info_details">
                <div>
                  {group.city}, {group.state}
                </div>
                <div className="groups_list_events_container">
                  <div>
                    {
                      events.filter((event) => event.groupId === group.id)
                        .length
                    }{" "}
                    events
                  </div>{" "}
                  <div>{"·"}</div>
                  {group.private && <div>Private</div>}{" "}
                  {!group.private && <div>Public</div>}
                </div>
                <div>
                  Organized by {organizer.firstName} {organizer.lastName}
                </div>
              </div>
            </div>
            {sessionUser && sessionUser.id !== organizer.id && (
              <button className={userClass} onClick={joinGroupButton}>
                Join this group
              </button>
            )}
            {sessionUser && sessionUser.id === organizer.id && (
              <div className="organizer_buttons_container">
                <button className="organizer_buttons">Create event</button>
                <button className="organizer_buttons">Update</button>
                <button className="organizer_buttons">Delete</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="group_lower_container">
        <div className="lower_container_group_upper_details">
          <h2>Organizer</h2>
          <div className="first_last_name_group">
            {organizer.firstName} {organizer.lastName}
          </div>
          <h2>What we're about</h2>
          <p>{group.about}</p>
        </div>
      </div>
      <div className="past_upcoming_events_container">
        {upcomingEvents.length > 0 && (
          <div>
            <div className="event_type">
              Upcoming Events ({upcomingEvents.length})
            </div>
            {upcomingEvents.map((event) => (
              <div>
                <EventDetailsForAGroup id={event.id} />
              </div>
            ))}
          </div>
        )}
        {pastEvents.length > 0 && (
          <div>
            <div className="event_type">Past Events ({pastEvents.length})</div>
            {pastEvents.map((event) => (
              <div>
                <EventDetailsForAGroup id={event.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default GroupDetails;
