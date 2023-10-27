import { csrfFetch } from "./csrf";


/** Action Type Constants: */
export const RECEIVE_VENUE = 'venues/RECEIVE_VENUE';


export const recieveVenue = (venue) => ({
  type: RECEIVE_VENUE,
  venue,
});


export const createNewVenue = (payload) => async dispatch => {
    console.log(payload)
    const response = await csrfFetch (`/api/groups/${payload.groupId}/venues`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  })
  if (response.ok) {
    const data = await response.json()
    dispatch(recieveVenue(data))
    return data
  } else {
    const errors = await response.json()
    return errors
  }
}

const venuesReducer = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_VENUE:
        console.log(action)
      return { ...state, [action.venue.id]: action.venue };
    default:
      return state;
  }
};

export default venuesReducer;
