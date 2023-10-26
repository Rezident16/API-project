import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import GroupForm from "./GroupForm";
import { useSelector } from "react-redux";
const CreateGroupForm = () => {
  const group = {
    name: "",
    about: "",
    type: "",
    isPrivate: "",
    location: "",
    image: "",
  };
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory('/')

  if (!sessionUser) {
    history.push('/')
  }
  /* **DO NOT CHANGE THE RETURN VALUE** */
  return (
    <div>
      <div className="create_group_upper_container">
        <h4>BECOME AN ORGANIZER</h4>
        <h3>
          We'll walk you through a few steps to build your local community
        </h3>
      </div>
      <GroupForm group={group} formType="Create Group" />
    </div>
  );
};

export default CreateGroupForm;
