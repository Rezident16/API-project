import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, Link, useParams } from "react-router-dom";
import SignupFormModal from "../SignupFormModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { fetchGroups, loadGroupData } from "../../store/groups";
import { fetchEvents } from "../../store/events";
import "./Groups.css";
import { fetchUsers } from "../../store/user";

function GroupDetails() {
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const id = parseInt(groupId);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    dispatch(loadGroupData(id));
    dispatch(fetchUsers);
    dispatch(fetchEvents);
  }, [dispatch, id]);

  const groupSelector = useSelector((state) => state.groups);
  const eventsObj = useSelector((state) => state.events);

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

  const events = Object.values(eventsObj);

  return (
    <section>
      <div className="group_details_whole_container">
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
                  {events.filter((event) => event.groupId === group.id).length}{" "}
                  events
                </div>{" "}
                {group.private && <div>Private</div>}{" "}
                {!group.private && <div>Public</div>}
              </div>
              <div>
                Organized by {organizer.firstName} {organizer.lastName}
              </div>
              </div>
            </div>
            <button onClick={joinGroupButton}> Join this group</button>
          </div>
        </div>
      </div>
      BOTTOM SECTION: Organizer First Name/ Last Name What we're about Upcoming
      Events {"(If exist)"}
      Past Events {"(If exist)"}
      Events display: Image {"==>"} time Event Title Location Description
    </section>
  );
}

export default GroupDetails;
