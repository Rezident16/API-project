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
  let members = useSelector((state) => state.membership.Members);
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

  members = members.map(member => {
    const date = new Date(member.Membership.createdAt);
    const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
    member.Membership.createdAt = formattedDate;
    return member;
  });

  console.log(members, 'MEMBERS')

  const filteredMembers =
    text == "All Members"
      ? allMembers
      : text == "Leadership team"
      ? leadership
      : pendingmembers;

  return (
    <div className="members_main_content">
      <h3 className="members_h3">{text}</h3>
      <ul className="member_full_list">
        {filteredMembers.map((member) => (
          <div className="member_action">
            <li className="members_list" key={member.id}>
              <img src="https://static.thenounproject.com/png/4154905-200.png" />
              <div>
              <div className="user_name">
                {member.firstName}
                </div>
              <div>Date Joined {member.Membership.createdAt}</div>

              </div>
            </li>
            {text === "Pending Members" && isOrganizer ? (
              <div className="organizer_buttons_container_user">
              <button className = 'membership_status_button'>
                <OpenModalMenuItem itemText="Approve"
                modalComponent={<ChangeStatusModal currUser={currUser} memberId={member.id} status='member' groupId={groupId}/>}
                />
              </button>
              </div>
            ) : (text === "All Members" || text=="Leadership Team") && isOrganizer && member.id != currUser.id ? (
              <div className="organizer_buttons_container_user">
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
