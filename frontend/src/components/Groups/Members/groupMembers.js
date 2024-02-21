import { useState } from "react";
import MembersList from "./membersList";
import { useSelector } from "react-redux";
import "../Groups.css";


function GroupMembers({ members, organizer, groupId }) {
  const [memberListText, setMemberListText] = useState("All Members");
  const onClick = (text) => {
    setMemberListText(text);
  };
  const user = useSelector((state) => state.session.user);

  const memberStatus = members.filter((member) => member.id === user?.id);

  return (
    <div className="member_list_tab">
      <div className="member_list_type">
        <h5 className="member_type" onClick={() => onClick("All Members")}>
          All Members
        </h5>
        <h5 className="member_type" onClick={() => onClick("Leadership team")}>
          Leadership Team
        </h5>
        {memberStatus[0]?.Membership.status === "co-host" && (
          <h5
            className="member_type"
            onClick={() => onClick("Pending Members")}
          >
            Pending Members
          </h5>
        )}
      </div>
      <MembersList
        text={memberListText}
        organizer={organizer}
        groupId={groupId}
      />
    </div>
  );
}

export default GroupMembers;
