import { useState } from "react";
import MembersList from "./membersList";

function GroupMembers({ members, organizer, groupId }) {
  const [memberListText, setMemberListText] = useState("All Members");
  const onClick = (text) => {
    setMemberListText(text);
  };
  
  return (
    <div>
      <div>
        <h5 onClick={() => onClick("All Members")}>All Members</h5>
        <h5 onClick={() => onClick("Leadership team")}>Leadership Team</h5>
        <h5 onClick={() => onClick("Pending Members")}>Pending Members</h5>
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
