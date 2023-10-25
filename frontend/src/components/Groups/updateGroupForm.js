import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchGroups } from "../../store/groups";
import { loadGroupData } from "../../store/groups";
import GroupForm from "./GroupForm";

const EditGroupForm = () => {
  const { groupId } = useParams();
  const sessionUser = useSelector((state) => state.session.user);

  const dispatch = useDispatch();
  const id = parseInt(groupId);

  useEffect(() => {
    dispatch(loadGroupData(id));
  }, [dispatch, id]);

  const groupObj = useSelector((state) => state.groups);
  const group = groupObj[groupId];

  if (!group) return null;
  if (!group.GroupImages) return null;
  if (!sessionUser || group.organizerId !== sessionUser.id) {
    return (
        <div>YOU CAN'T BE HERE</div>
    )
  }
  const previwImage = group.GroupImages.find((image) => image.preview === true);
  let isPrivate = "";
  if (group.private === true) {
    isPrivate = "Private";
  } else {
    isPrivate = "Public";
  }
  const location = group.city + "," + group.state;
  console.log("location ", location);

  group.previewImage = previwImage.url;
  group.isPrivate = isPrivate;
  group.location = location;

  /* **DO NOT CHANGE THE RETURN VALUE** */
  return (
    Object.keys(group).length > 1 && (
      <div>
        <div className="create_group_upper_container">
          <h4>UPDATE YOUR GROUP'S INFORMATION</h4>
          <h3>
            We'll walk you through a few steps to build your local community
          </h3>
        </div>
        <GroupForm group={group} formType="Update Group" />
      </div>
    )
  );
};

export default EditGroupForm;
