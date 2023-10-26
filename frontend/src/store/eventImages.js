import { csrfFetch } from "./csrf";


/** Action Type Constants: */
export const LOAD_EVENT_IMAGES = 'events/LOAD_EVENT_IMAGES';
export const RECEIVE_EVENT_IMAGES = 'events/RECEIVE_EVENT_IMAGES';
export const UPDATE_EVENT_IMAGES = 'events/UPDATE_EVENT_IMAGES';
export const REMOVE_EVENT_IMAGES = 'events/REMOVE_EVENT_IMAGES';


export const recieveEventImages = (image) => ({
  type: RECEIVE_EVENT_IMAGES,
  image,
});


export const createNewEventImage = (payload) => async dispatch => {
  const response = await csrfFetch (`/api/events/${payload.eventId}/images`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  })
  if (response.ok) {
    const data = await response.json()
    dispatch(recieveEventImages(data))
    return data
  } else {
    const errors = await response.json()
    return errors
  }
}


/** The reports reducer is complete and does not need to be modified */
const eventsImageReducer = (state = {}, action) => {
  switch (action.type) {
    // case LOAD_GROUPS:
    //   const groupsState = {};
    //   action.groups.Groups.forEach((group) => {
    //     groupsState[group.id] = group;
    //   });
    //   return groupsState;
    case RECEIVE_EVENT_IMAGES:
        console.log(action)
      return { ...state, [action.image.id]: action.image };
    // case UPDATE_GROUP:
    //   return { ...state, [action.group.id]: action.group };
    // case REMOVE_GROUP:
    //   const newState = { ...state };
    //   delete newState[action.id];
    //   return newState;
    default:
      return state;
  }
};

export default eventsImageReducer;
