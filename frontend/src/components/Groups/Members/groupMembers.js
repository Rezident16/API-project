import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { readGroup } from "../../../store/group";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import MembersList from "./membersList";
import { readMemberships } from "../../../store/memberships";
function GroupMembers() {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const [memberListText, setMemberListText] = useState("All Members");
    const [memberList, setMemberList] = useState([]);
    
    useEffect(() => {
      const attempt = async () => {
        try{
            await dispatch(readMemberships(groupId));
        } catch (e) {
        history.push(`/groups/${groupId}`);
        }

      };
      attempt();
    }, [groupId]);
    
    const members = useSelector((state) => state.membership.Members);
    if (!members || members.length === 0) return 'Loading...';
    const allMembers = members.filter(
      (member) =>
        member.Membership.status === "co-host" || member.status === "member"
    );
    const leadership = members.filter(
      (member) => member.Membership.status === "co-host"
    );
    const pendingmembers = members.filter(
      (member) => member.Membership.status === "pending"
    );
    
    const onClick = (text, membersType) => {
        setMemberListText(text);
        setMemberList(membersType);
      };
  return (
    <div>
      TEST
      <div>
        <h5 onClick={() => onClick("All Members", allMembers)}>All Members</h5>
        <h5 onClick={() => onClick("Leadership team", leadership)}>
          Leadership Team
        </h5>
        <h5 onClick={() => onClick("Pending Members", pendingmembers)}>
          Pending Members
        </h5>
      </div>
      <MembersList members={memberList} text={memberListText} />
    </div>
  );
}

export default GroupMembers;
