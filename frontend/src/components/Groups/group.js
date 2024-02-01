import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link, useParams } from "react-router-dom";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import "./Groups.css";
import DeleteButtonModal from "./deleteButton";
import { requestMembership,updateMembershipStatus } from "../../store/memberships";
import { readGroup } from "../../store/group";
import EventList from "./eventList";
import GroupImages from "./imageContainer";

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

  useEffect(() => {
    const attempt = async () => {
      try {
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


  const joinGroupButton = async () => {
    await dispatch(requestMembership(id, sessionUser));
  };

  const updateGroup = () => {
    history.push(`/groups/${id}/edit`);
  };

  const createEvent = () => {
    history.push(`/groups/${id}/events/new`);
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
          <Link to="/groups" className='page_events_breadcramb'>{"<"} Groups</Link>
        </div>
        <div className="group_upper_container">
          <GroupImages group={group} />
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
