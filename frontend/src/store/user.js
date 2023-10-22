/** Action Type Constants: */
export const LOAD_USERS = 'users/LOAD_USERS';
export const RECEIVE_USER = 'users/RECEIVE_USER';
export const UPDATE_USER = 'users/UPDATE_USER';
export const REMOVE_USER = 'users/REMOVE_USER';

/**  Action Creators: */
export const loadUsers = (users) => ({
  type: LOAD_USERS,
  users,
});

export const receiveUser = (user) => ({
  type: RECEIVE_USER,
  user,
});

export const editUser= (user) => ({
  type: UPDATE_USER,
  user,
});

export const removeUser = (id) => ({
  type: REMOVE_USER,
  id,
});

/** Thunk Action Creators: */

// Your code here
export const fetchUsers = () => async dispatch => {
  const response = await fetch('/api/users')
  const data = await response.json()
  dispatch(loadUsers(data))
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

// export const loadReportData = (id) => async dispatch => {
//   const response = await fetch(`/api/reports/${id}`)
//   if (response.ok) {
//     const data = await response.json()
//     dispatch(receiveReport(data))
//   }
// }

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
const usersReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_USERS:
      const usersState = {};
      action.users.Users.forEach((user) => {
        usersState[user.id] = user;
      });
      return usersState;
    // case RECEIVE_REPORT:
    //   return { ...state, [action.report.id]: action.report };
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

export default usersReducer;
