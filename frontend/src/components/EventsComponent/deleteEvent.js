import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import { useHistory } from 'react-router-dom';
import { deleteEvents } from "../../store/events";
import { fetchEvents } from "../../store/events";

function DeleteEventButtonModal({id, groupId}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const history = useHistory()
  const goBack = (e) => {
    e.preventDefault();
          closeModal()
  };
  id = parseInt(id)
  groupId = parseInt(groupId)
  const handleDelete = async (e) => {
    dispatch(deleteEvents(id))
    closeModal()
    dispatch(fetchEvents())
    history.push(`/groups/${groupId}`)
  };

  return (
    <div className="delete_group_container">
        <h2>Confrm Delete</h2>
        <h5>Are you sure you want to remove this group?</h5>
        <button className='delete_group_button' onClick={handleDelete}>{'Yes (Delete Event)'}</button>
        <button className='keep_group_button'onClick={goBack}>{`No (Keep Event)`}</button>
    </div>
    
  );
}

export default DeleteEventButtonModal;
