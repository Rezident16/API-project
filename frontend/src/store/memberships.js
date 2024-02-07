import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const CREATE_MEMBERSHIP = 'memberships/CREATE_MEMBERSHIP';
const UPDATE_MEMBERSHIP = 'memberships/UPDATE_MEMBERSHIP';
const DELETE_MEMBERSHIP = 'memberships/DELETE_MEMBERSHIP';
const GET_ALL_MEMBERSHIPS = 'memberships/GET_ALL_MEMBERSHIPS';


/**  Action Creators: */
export const createMembership = (membership) => ({
  type: CREATE_MEMBERSHIP,
  membership,
});

const updateMembership = (membership) => ({
    type: UPDATE_MEMBERSHIP,
    membership,
})

const deleteMembership = (membershipId) => ({
    type: DELETE_MEMBERSHIP,
    membershipId,
})

const getAllMemberships = (memberships) => ({
  type: GET_ALL_MEMBERSHIPS,
  memberships,
})

/** Thunk Action Creators: */

export const readMemberships = (groupId) => async dispatch => {
  const response = await csrfFetch(`/api/groups/${groupId}/members`)
  const data = await response.json()
  dispatch(getAllMemberships(data))
}

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

export const deleteMembershipStatus = (memberId, groupId, user) => async dispatch => {
  const response = await csrfFetch(`/api/groups/${groupId}/membership/`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({memberId, user})
  })
  const data = await response.json()
  dispatch(deleteMembership(data))
}

const membershipReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ALL_MEMBERSHIPS:
      return { ...action.memberships };
    case CREATE_MEMBERSHIP:
      return { ...state, [action.membership.id]: action.membership };
    case UPDATE_MEMBERSHIP:
      return { ...state, [action.membership.id]: action.membership };
    case DELETE_MEMBERSHIP:
      const newState = { ...state };
      delete newState[action.membershipId];
      return newState
    default:
      return state;
  }
};

export default membershipReducer;
