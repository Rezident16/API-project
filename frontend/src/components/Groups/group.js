import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link, useParams } from "react-router-dom";
import "./Groups.css";
import { readGroup } from "../../store/group";
import GroupImages from "./imageContainer";
import Buttons from "./buttons";
import MembersCount from "./Members/membersCount";
import GroupTabs from './groupTabs'

function GroupDetails() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { groupId } = useParams();
  const id = parseInt(groupId);
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

  const groupMembership = group.memberships.filter(
    (membership) => membership.userId === sessionUser?.id
  );

  let status = "not_signed";
  if (sessionUser && !groupMembership.length) {
    status = "not_joined";
  } else if (groupMembership.length) {
    status = groupMembership[0].status;
  }

  return (
    <section className="group_details_whole_container">
      <div className="whole_upper_conainer">
        <div>
          <Link to="/groups" className="page_events_breadcramb">
            {"<"} Groups
          </Link>
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
                  <div>{"·"}</div>
                    <MembersCount members={group.memberships} />
                </div>
                <div>
                  Organized by {organizer.firstName} {organizer.lastName}
                </div>
              </div>
              <Buttons
                status={status}
                groupId={groupId}
                sessionUser={sessionUser}
                group={group}
              />
            </div>
          </div>
        </div>
      </div>
          <GroupTabs organizer={organizer} group={group} className="group_full_container_lower"/>
    </section>
  );
}

export default GroupDetails;
