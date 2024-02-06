import { useHistory } from "react-router-dom";

function MembersCount(members) {
  const currMembers = members.members.filter(
    (member) => member.status !== "pending"
  );
  const count = currMembers.length;
  const word = count === 1 ? "member" : "members";

  const history = useHistory();
  return (
    <div>
      {count} {word}
    </div>
  );
}

export default MembersCount;
