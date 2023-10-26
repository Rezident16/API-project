import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import { useHistory } from 'react-router-dom';
import { deleteGroups } from "../../store/groups";
import { Redirect } from "react-router-dom";

function DeleteButtonModal({id, groupId}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const history = useHistory()
  const goBack = (e) => {
    e.preventDefault();
          closeModal()
  };
  id = parseInt(id)
  groupId = parseInt(groupId)
  console.log(groupId)
  const handleDelete = async (e) => {
    e.preventDefault();
    dispatch(deleteGroups(id, groupId))
    history.push('/')
  };

  return (
    <div className="delete_group_container">
        <h2>Confrm Delete</h2>
        <h5>Are you sure you want to remove this group?</h5>
        <button className='delete_group_button' onClick={handleDelete}>{'Yes (Delete Group)'}</button>
        <button className='keep_group_button'onClick={goBack}>{`No (Keep Group)`}</button>
    </div>
    
  );
}

export default DeleteButtonModal;