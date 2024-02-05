function MembersList({ members, text }) {
  // All members
  // Leadership team -> co-hosts

  const allMembers = members.filter(
    (member) => member.status === "co-host" || member.status === "member"
  );
  const leadership = members.filter((member) => member.status === "co-host");
  const pendingmembers = members.filter(
    (member) => member.status === "pending"
  );

  const members =
    text === "Leadership team"
      ? leadership
      : text === "Pending members"
      ? pendingmembers
      : allMembers;

  return (
    <div>
      <h3>{text}</h3>
      <ul>
        {allMembers.map((member) => (
          <li key={member.id}>{member.name}</li>
        ))}
      </ul>
    </div>
  );
}
