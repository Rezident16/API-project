import { useHistory } from "react-router-dom";
import DeleteButtonModal from "./deleteButton";
import { useDispatch } from "react-redux";
import { requestMembership } from "../../store/memberships";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import LeaveGroup from "./leaveGroup";
import "./Groups.css";
import { readGroup } from "../../store/group";

function Buttons({ groupId, status, sessionUser, group }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const joinGroupButton = async () => {
    await dispatch(requestMembership(groupId, sessionUser));
    await dispatch(readGroup(groupId));
  };
  const updateGroup = () => {
    history.push(`/groups/${groupId}/edit`);
  };

  const createEvent = () => {
    history.push(`/groups/${groupId}/events/new`);
  };

  return (
    <div>
      {status == "not_joined" && (
        <button className="request_button" onClick={joinGroupButton}>Request to Join</button>
      )}
      {status == "pending" && <button className="pending_button">Membership Pending</button>}
      {status == "co-host" && group.organizerId == sessionUser.id && (
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
        </div>
      )}
        <div className="organizer_buttons_container">
      {status == "co-host" && group.organizerId != sessionUser.id && (
          <button onClick={createEvent} className="organizer_buttons">
            Create event
          </button>
      )}
      {(status == "co-host" || status == "member") &&
        group.organizerId != sessionUser.id && (
          <button className="organizer_buttons">
          <OpenModalMenuItem
          itemText="Leave Group"
          modalComponent={
            <LeaveGroup id={sessionUser.id} groupId={groupId} />
          }
          />
          </button>
          )}
          </div>
    </div>
  );
}

export default Buttons;
