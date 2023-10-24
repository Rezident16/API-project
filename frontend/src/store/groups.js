import { csrfFetch } from "./csrf";


/** Action Type Constants: */
export const LOAD_GROUPS = 'groups/LOAD_GROUPS';
export const RECEIVE_GROUP = 'groups/RECEIVE_GROUP';
export const UPDATE_GROUP = 'groups/UPDATE_GROUP';
export const REMOVE_GROUP = 'groups/REMOVE_GROUP';

/**  Action Creators: */
export const loadGroups = (groups) => ({
  type: LOAD_GROUPS,
  groups,
});

export const receiveGroup = (group) => ({
  type: RECEIVE_GROUP,
  group,
});

export const editGroup= (group) => ({
  type: UPDATE_GROUP,
  group,
});

export const removeGroup = (id) => ({
  type: REMOVE_GROUP,
  id,
});

/** Thunk Action Creators: */

// Your code here
export const fetchGroups = () => async dispatch => {
  const response = await csrfFetch('/api/groups')
  const data = await response.json()
  dispatch(loadGroups(data))
}

// export const deleteReports = (id) => async dispatch => {
//   const response = await fetch(`/api/reports/${id}`, {
//     method: 'DELETE',
//     headers: {'Content-Type': 'application/json'},
//   })
//   if (response.ok) {
//     dispatch(removeReport(id))
//   }
// }

export const loadGroupData = (id) => async dispatch => {
  const response = await csrfFetch(`/api/groups/${id}`)
  if (response.ok) {
    const data = await response.json()
    dispatch(receiveGroup(data))
  }
}

// export const createNewReport = (payload) => async dispatch => {
//   const response = await fetch ('/api/reports', {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify(payload)
//   })
//   if (response.ok) {
//     const data = await response.json()
//     dispatch(receiveReport(data))
//     return data
//   } else {
//     const errors = await response.json()
//     return errors
//   }
// }

// export const updateReportThunk = (payload) => async dispatch => {
//   const response = await fetch (`/api/reports/${payload.id}`, {
//     method: 'PUT',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify(payload)
//   })
//   if (response.ok) {
//     const data = await response.json()
//     dispatch(editReport(data))
//     return data
//   } else {
//     const errors = await response.json()
//     return errors
//   }
// }

/** The reports reducer is complete and does not need to be modified */
const groupsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_GROUPS:
      const groupsState = {};
      action.groups.Groups.forEach((group) => {
        groupsState[group.id] = group;
      });
      return groupsState;
    case RECEIVE_GROUP:
      return { ...state, [action.group.id]: action.group };
    // case UPDATE_REPORT:
    //   return { ...state, [action.report.id]: action.report };
    // case REMOVE_REPORT:
    //   const newState = { ...state };
    //   delete newState[action.id];
    //   return newState;
    default:
      return state;
  }
};

export default groupsReducer;
