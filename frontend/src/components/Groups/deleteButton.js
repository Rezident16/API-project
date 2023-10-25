import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import { useHistory } from 'react-router-dom';
import { deleteGroups } from "../../store/groups";

function DeleteButtonModal({id}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const history = useHistory()
  const goBack = (e) => {
    e.preventDefault();
          closeModal()
  };
  id = parseInt(id)
  const handleDelete = async (e) => {
    e.preventDefault();
    dispatch(deleteGroups(id))
    closeModal()
    history.push('/groups')
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
