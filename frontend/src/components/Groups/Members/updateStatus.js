import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { updateMembershipStatus } from "../../../store/memberships";
import { readGroup } from "../../../store/group";

function ChangeStatusModal({ currUser, memberId, status, groupId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const goBack = (e) => {
    e.preventDefault();
    closeModal();
  };
  const handleStatusChange = async (memberId, status) => {
    await dispatch(updateMembershipStatus(currUser, memberId, status, groupId));
    await dispatch(readGroup(groupId));
    closeModal();
  };

  const text = status === "member" ? "Add New Member" : "Make Co-Host";
  const h2Text = status === "member" ? "Confrm New Member" : "Confrm Co-Host";

  return (
    <div className="delete_group_container">
      <h2>{h2Text}</h2>
      <button
        className="delete_group_button"
        onClick={() => handleStatusChange(memberId, status)}
      >
        {text}
      </button>
      <button
        className="keep_group_button"
        onClick={goBack}
      >{`Go Back`}</button>
    </div>
  );
}

export default ChangeStatusModal;
