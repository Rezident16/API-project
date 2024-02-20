import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { readMemberships } from "../../../store/memberships";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import ChangeStatusModal from "./updateStatus";
import LeaveGroup from "../leaveGroup";
import './members.css'

function MembersList({ text, organizer, groupId }) {
  const currUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(readMemberships(groupId));
  }, [dispatch, groupId]);
  const members = useSelector((state) => state.membership.Members);

  const currUserId = currUser ? currUser.id : null;
  const isOrganizer = organizer.id === currUserId;
  const leadership = members.filter(
    (member) => member.Membership.status === "co-host"
  );
  const isLeader = leadership.some((leader) => leader.id === currUserId);
  const pendingmembers = members.filter(
    (member) => member.Membership.status === "pending"
  );
  const allMembers = members.filter(
    (member) => member.Membership.status !== "pending"
  );

  const filteredMembers =
    text == "All Members"
      ? allMembers
      : text == "Leadership team"
      ? leadership
      : pendingmembers;

  return (
    <div>
      <h3>{text}</h3>
      <ul>
        {filteredMembers.map((member) => (
          <div>
            <li key={member.id}>
              {member.firstName} {member.id} {member.Membership.status}
            </li>
            {text === "Pending Members" && isOrganizer ? (
              <button className = 'membership_status_button'>
                <OpenModalMenuItem itemText="Approve"
                modalComponent={<ChangeStatusModal currUser={currUser} memberId={member.id} status='member' groupId={groupId}/>}
                />
              </button>
            ) : text === "All Members" && isOrganizer && member.id != currUser.id ? (
              <div className="organizer_buttons_container">
                {member.Membership.status != 'co-host' && (<button className = 'membership_status_button'>
                <OpenModalMenuItem  itemText="Make Co-Host"
                modalComponent={<ChangeStatusModal currUser={currUser} memberId={member.id} status='co-host' groupId={groupId}/>}
                />
              </button>)}
              <button className = 'membership_status_button'>
                <OpenModalMenuItem  itemText="Remove user"
                modalComponent={<LeaveGroup id={member.id} groupId={groupId} subject = 'Remove'/>}
                />
              </button>
              </div>
            ) : null}
          </div>
        ))}
      </ul>
    </div>
  );
}

export default MembersList;
