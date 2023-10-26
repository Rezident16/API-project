import { csrfFetch } from "./csrf";

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
  const response = await csrfFetch('/api/events')
  const data = await response.json()
  dispatch(loadEvents(data))
}

export const fetchEventsbyGroupId = (id) => async dispatch => {
  const response = await csrfFetch(`/api/groups/${id}/events`)
  if (response.ok) {
    const data = await response.json()
    dispatch(loadEvents(data))
  }
}

export const fetchEventDetails = (id) => async dispatch => {
  const response = await csrfFetch (`/api/events/${id}`)
  if(response.ok) {
    const data = await response.json ()
    dispatch(receiveEvent(data))
  }
}

export const deleteEvents = (id, groupId) => async dispatch => {
    const res = await csrfFetch(`/api/events/${id}`, {
        method: 'DELETE'
    })

    if (res.ok) {
        dispatch(removeEvent(id));
    }

    return res;
}

export const createNewEvent = (payload) => async dispatch => {
  const response = await csrfFetch (`/api/groups/${payload.groupId}/events`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  })
  if (response.ok) {
    const data = await response.json()
    dispatch(receiveEvent(data))
    return data
  } else {
    const errors = await response.json()
    return errors
  }
}

// export const updateEvent = (payload) => async dispatch => {
//   const response = await csrfFetch (, {
//     method: 'PUT',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify(payload)
//   })
//   if (response.ok) {
//     const data = await response.json()
//     dispatch(editEvent(data))
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
    case RECEIVE_EVENT:
      
      return { ...state, [action.event.id]: action.event };
    case UPDATE_EVENT:
      return { ...state, [action.event.id]: action.event };
    case REMOVE_EVENT:
      const newState = { ...state };
      delete newState[action.id];
      return newState;
    default:
      return state;
  }
};

export default eventsReducer;
