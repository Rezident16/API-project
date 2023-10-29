import { csrfFetch } from "./csrf";


/** Action Type Constants: */
export const LOAD_GROUP_IMAGES = 'groups/LOAD_GROUP_IMAGES';
export const RECEIVE_GROUP_IMAGES = 'groups/RECEIVE_GROUP_IMAGES';
export const UPDATE_GROUP_IMAGES = 'groups/UPDATE_GROUP_IMAGES';
export const REMOVE_GROUP_IMAGES = 'groups/REMOVE_GROUP_IMAGES';

/**  Action Creators: */
// export const loadGroupImages = (groups) => ({
//   type: LOAD_GROUP_IMAGES,
//   groups,
// });

export const recieveGroupImages = (image) => ({
  type: RECEIVE_GROUP_IMAGES,
  image,
});

// export const updateGroupImages= (group) => ({
//   type: UPDATE_GROUP_IMAGES,
//   group,
// });

export const removeGroupImages = (id) => ({
  type: REMOVE_GROUP_IMAGES,
  id,
});


export const createNewGroupImage = (payload) => async dispatch => {

  const response = await csrfFetch (`/api/groups/${payload.groupId}/images`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  })
  if (response.ok) {
    const data = await response.json()
    dispatch(recieveGroupImages(data))
    return data
  } else {
    const errors = await response.json()
    return errors
  }
}


/** The reports reducer is complete and does not need to be modified */
const groupsImagesReducer = (state = {}, action) => {
  switch (action.type) {
    // case LOAD_GROUPS:
    //   const groupsState = {};
    //   action.groups.Groups.forEach((group) => {
    //     groupsState[group.id] = group;
    //   });
    //   return groupsState;
    case RECEIVE_GROUP_IMAGES:

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

export default groupsImagesReducer;
