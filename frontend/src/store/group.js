import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const READ_GROUP = 'group/READ_GROUP';
const CLEAR_STATE = 'group/CLEAR_STATE';

/**  Action Creators: */
export const readGroupCreator = (group) => ({
  type: READ_GROUP,
  group,
});

export const clearState = () => ({
  type: CLEAR_STATE
})


/** Thunk Action Creators: */


export const readGroup = (groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/`)
    const data = await response.json()
    dispatch(readGroupCreator(data))
}

const groupReducer = (state = {}, action) => {
  switch (action.type) {
    case READ_GROUP:
      return { ...action.group };
    case CLEAR_STATE:
      return {};
    default:
      return state;
  }
};

export default groupReducer;
