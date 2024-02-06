import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { readGroup } from "../../../store/group";
import { useHistory } from "react-router-dom";

function GroupMembers() {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  console.log(groupId);
  useEffect(() => {
    const attempt = async () => {
      try {
        await dispatch(readGroup(groupId));
      } catch (e) {}
    };
    attempt();
  }, [groupId]);

  const groupObj = useSelector((state) => state.group);
  const members = groupObj.memberships;
  const allMembers = members.filter(
    (member) => member.status === "co-host" || member.status === "member"
  );
  const leadership = members.filter((member) => member.status === "co-host");
  const pendingmembers = members.filter(
    (member) => member.status === "pending"
  );
  return (
    <div>
      <h1>Group Members</h1>
    </div>
  );
}

export default GroupMembers;
