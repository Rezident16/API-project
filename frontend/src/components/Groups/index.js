import React, { useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchGroups } from "../../store/groups";
import { fetchEvents } from "../../store/events";
import "./Groups.css";
import { clearState } from "../../store/group";

function GroupsList() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGroups());
    dispatch(fetchEvents());
    dispatch(clearState());
  }, [dispatch]);
  const groupsObj = useSelector((state) => state.groups);
  const groups = Object.values(groupsObj);

  const eventsObj = useSelector((state) => state.events);
  const events = Object.values(eventsObj);

  return (
    <section className="groups_list_container">
      <div className="groups_events_nav">
        <Link exact to="/events" className="groups_events_nav_events">
          Events
        </Link>
        <Link exact to="/groups" className="groups_events_nav_groups">
          Groups
        </Link>
      </div>
      <div className="groups-in-gatherup"> Groups in GatherUp</div>
      <div className="test">
        {groups.map((group) => (
          <Link
            exact
            to={`/groups/${group.id}`}
            key={group.id}
            className="groups_list_details_container"
          >
            <div className="groups_list_images">
              <img src={group.previewImage} />
            </div>
            <div className="groups_list_data">
              <div className="location_name">
                <h2>{group.name}</h2>
                <h4>
                  {group.city}, {group.state}
                </h4>
                <p>{group.about}</p>
              </div>
              <div className="groups_list_events_container">
                <div>
                  {events.filter((event) => event.groupId === group.id).length}{" "}
                  events
                </div>
                <div>{"·"}</div>
                {!group.private && <div className="public">Public</div>}
                {group.private && <div className="public">Private</div>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default GroupsList;
