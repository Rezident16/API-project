import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import { useHistory } from 'react-router-dom';
import { deleteGroups } from "../../store/groups";
import { fetchGroups } from "../../store/groups";
import { deleteMembershipStatus } from "../../store/memberships";
import { readGroup } from "../../store/group";

function LeaveGroup({id, groupId, subject}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const history = useHistory()
  const goBack = (e) => {
    e.preventDefault();
          closeModal()
  };
  id = parseInt(id)
  groupId = parseInt(groupId)
  const user = useSelector((state) => state.session.user);
  
  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(deleteMembershipStatus(id, groupId, user))
    await dispatch(readGroup(groupId))
    closeModal()
  };

  const h2 = subject == 'Remove' ? 'Remove Member' : 'Leave Group'
  const h5 = subject == 'Remove' ? 'Are you sure you want to remove this member?' : 'Are you sure you want to leave this group?'
  const deleteButton = subject == 'Remove' ? 'Yes (Remove Member)' : 'Yes (Leave Group)'
  const keepButton = subject == 'Remove' ? 'No (Keep Member)' : 'No (Stay in the Group)'

  return (
    <div className="delete_group_container">
        <h2>{h2}</h2>
        <h5>{h5}</h5>
        <button className='delete_group_button' onClick={handleDelete}>{deleteButton}</button>
        <button className='keep_group_button'onClick={goBack}>{keepButton}</button>
    </div>
    
  );
}

export default LeaveGroup;
