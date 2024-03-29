import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import groupsReducer from "./groups";
import eventsReducer from "./events";
import usersReducer from "./user";
import groupsImagesReducer from "./groupImages";
import eventsImageReducer from "./eventImages";
import venuesReducer from "./venue";
// import membershipReducer from "./membership";
import membershipReducer from "./memberships";
import groupReducer from "./group";


const rootReducer = combineReducers({
  session: sessionReducer,
  groups: groupsReducer,
  events: eventsReducer,
  users: usersReducer,
  groupImages: groupsImagesReducer,
  eventImages: eventsImageReducer,
  venues: venuesReducer,
  membership: membershipReducer,
  group: groupReducer
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
