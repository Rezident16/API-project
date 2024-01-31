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
import OpenModelDeleteButton from "./deleteButton";
import DeleteButtonModal from "./deleteButton";
import { fetchEvents } from "../../store/events";
import { requestMembership,updateMembershipStatus } from "../../store/memberships";
import groupMembers from "./groupMembers";
import { readGroup } from "../../store/group";
import EventList from "./eventList";

function GroupDetails() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { groupId } = useParams();
  const id = parseInt(groupId);
  const [currentImage, setCurrentImage] = useState(0);
  const sessionUser = useSelector((state) => state.session.user);
  let userClass = sessionUser
    ? "user_logged_in_group"
    : "user_not_logged_in_group";
  const group = useSelector((state) => state.group);
  // const group = groupSelector[groupId];

  useEffect(() => {
    const attempt = async () => {
      try {
        // await dispatch(loadGroupData(id));
        await dispatch(fetchEventsbyGroupId(id));
        await dispatch(readGroup(id));
      } catch (e) {
        if (e) history.push("/groups");
      }
    };
    attempt();
  }, [dispatch, id]);

  const eventsObj = useSelector((state) => state.events);
  let events = Object.values(eventsObj);

  if (!Object.keys(group).length) return null;

  const organizer = group.Organizer;
  if (!group) return null;
  if (!organizer) return null;
  const groupImages = [];

  for (let i = group.GroupImages.length - 1; i >= 0; i--) {
    let image = group.GroupImages[i];
    if (image.preview === true) groupImages.push(image);
  }
  for (let i = 0; i < group.GroupImages.length; i++) {
    let image = group.GroupImages[i];
    if (image.preview === false) groupImages.push(image);
  }

  const changeImageNext = () => {
    const nextIndex = (currentImage + 1) % groupImages.length;
    setCurrentImage(nextIndex);
  };

  const changeImagePrevious = () => {
    const previousIndex =
      (currentImage - 1 + groupImages.length) % groupImages.length;
    setCurrentImage(previousIndex);
  };

  const joinGroupButton = async () => {
    await dispatch(requestMembership(id, sessionUser));
  };

  const updateGroup = () => {
    history.push(`/groups/${id}/edit`);
  };

  const createEvent = () => {
    history.push(`/groups/${id}/events/new`);
  };
  const disabled = () => {
    if (groupImages.length > 1) {
      return "enabled_next_image_button";
    }
    return "disabled_next_image_button";
  };

  const groupMembership = group.memberships.filter(

    (membership) => membership.userId === sessionUser?.id)
  let status = null
  if (groupMembership.length) {
    status = groupMembership[0].status
  }

  return (
    <section className="group_details_whole_container">
      <div className="whole_upper_conainer">
        <div>
          {/* {"<"} */}
          <Link to="/groups" className='page_events_breadcramb'>{"<"} Groups</Link>
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
            
            {sessionUser && sessionUser.id !== organizer.id && status != 'pending' && (
              <button className={userClass} onClick={joinGroupButton}>
                Join this group
              </button>
            )}
            {sessionUser && status == 'pending' && (
              <button className={userClass}>
                Membership Pending
              </button>
            )}
            {sessionUser && sessionUser.id === organizer.id && (
              <div className="organizer_buttons_container">
                <button onClick={createEvent} className="organizer_buttons">
                  Create event
                </button>
                <button onClick={updateGroup} className="organizer_buttons">
                  Update
                </button>
                <div>
                  <button className="organizer_buttons">
                    <OpenModalMenuItem
                      itemText="Delete"
                      modalComponent={<DeleteButtonModal id={groupId} />}
                    />
                  </button>
                </div>
                {/* <button className="organizer_buttons" modalComponent={<SignupFormModal/>}>Delete</button> */}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="group_full_container_lower">
        <div className="group_lower_container">
          <div className="lower_container_group_upper_details">
            <h2>Organizer</h2>
            <div className="first_last_name_group">
              {organizer.firstName} {organizer.lastName}
            </div>
            <h2>What we're about</h2>
            <p className="description_on_a_group">{group.about}</p>
          </div>
        </div>
        <EventList groupId = {groupId} />
      </div>
    </section>
  );
}

export default GroupDetails;
