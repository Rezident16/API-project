import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { updateMembershipStatus } from "../../../store/memberships";
import { readGroup } from "../../../store/group";
import { useHistory } from 'react-router-dom';
import { readMemberships } from "../../../store/memberships";

function MembersList({ text, organizer, groupId }) {
  const currUser = useSelector((state) => state.session.user);
  const [options, setOptions] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(readMemberships(groupId));
  }, [dispatch, groupId])
  const members = useSelector((state) => state.membership.Members);

  // cohost can change pending users to members
  // organizer can make members cohosts
  const isOrganizer = organizer.id === currUser.id;
  const leadership = members.filter(
    (member) => member.Membership.status === "co-host"
    );
    const isLeader = leadership.some((leader) => leader.id === currUser.id);
  const pendingmembers = members.filter(
    (member) => member.Membership.status === "pending"
  );
  const allMembers = members.filter(
    (member) => member.Membership.status !== "pending"
  );

  const filteredMembers = text == 'All Members' ? allMembers : text == 'Leadership team' ? leadership : pendingmembers;


  const handleStatusChange = async (memberId, status) => {
    await dispatch(updateMembershipStatus(currUser, memberId, status, groupId));
    await dispatch(readGroup(groupId));
  }

  return (
    <div>
      <h3>{text}</h3>
      <ul>
        {filteredMembers.map((member) => (
          <div>
            <li key={member.id}>{member.firstName} {member.id} {member.Membership.status}</li>
            {text == 'Pending Members' && isOrganizer ? (
              <button onClick={() => handleStatusChange(member.id, 'member')}>
                Approve
              </button>
            ) : (
             null 
            )}
          </div>
        ))}
      </ul>
    </div>
  );
}

export default MembersList;
