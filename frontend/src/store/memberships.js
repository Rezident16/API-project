import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const CREATE_MEMBERSHIP = 'memberships/CREATE_MEMBERSHIP';
const UPDATE_MEMBERSHIP = 'memberships/UPDATE_MEMBERSHIP';

/**  Action Creators: */
export const createMembership = (membership) => ({
  type: CREATE_MEMBERSHIP,
  membership,
});

const updateMembership = (membership) => ({
    type: UPDATE_MEMBERSHIP,
    membership,
})

/** Thunk Action Creators: */

export const requestMembership = (groupId, user) => async dispatch => {
//   const response = await csrfFetch('/api/groups/:groupId/membership')
  const response = await csrfFetch (`/api/groups/${groupId}/membership`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(user)
  })
  const data = await response.json()
  dispatch(createMembership(data))
}

export const updateMembershipStatus = (user, memberId, status, groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/membership/`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user, memberId, status})
    })
    const data = await response.json()
    dispatch(updateMembership(data))
}

const membershipReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_MEMBERSHIP:
      return { ...state, [action.membership.id]: action.membership };
    default:
      return state;
  }
};

export default membershipReducer;
