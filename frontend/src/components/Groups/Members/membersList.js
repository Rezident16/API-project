function MembersList({ members, text }) {

  return (
    <div>
      <h3>{text}</h3>
      <ul>
        {members.map((member) => (
          <li key={member.id}>{member.firstName}</li>
        ))}
      </ul>
    </div>
  );
}

export default MembersList;
