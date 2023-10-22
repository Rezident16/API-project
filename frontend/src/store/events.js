/** Action Type Constants: */
export const LOAD_EVENTS = 'events/LOAD_EVENTS';
export const RECEIVE_EVENT = 'events/RECEIVE_EVENT';
export const UPDATE_EVENT = 'events/UPDATE_EVENT';
export const REMOVE_EVENT = 'events/REMOVE_EVENT';

/**  Action Creators: */
export const loadEvents = (events) => ({
  type: LOAD_EVENTS,
  events,
});

export const receiveEvent = (event) => ({
  type: RECEIVE_EVENT,
  event,
});

export const editEvent= (event) => ({
  type: UPDATE_EVENT,
  event,
});

export const removeEvent = (id) => ({
  type: REMOVE_EVENT,
  id,
});

/** Thunk Action Creators: */

// Your code here
export const fetchEvents = () => async dispatch => {
  const response = await fetch('/api/events')
  const data = await response.json()
  dispatch(loadEvents(data))
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
const eventsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_EVENTS:
      const eventsState = {};
      action.events.Events.forEach((event) => {
        eventsState[event.id] = event;
      });
      return eventsState;
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

export default eventsReducer;
