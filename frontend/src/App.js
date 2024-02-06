import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import GroupsList from "./components/Groups/index";
import GroupDetails from "./components/Groups/group";
import CreateGroupForm from "./components/Groups/createNewGroupForm";
import EditGroupForm from "./components/Groups/updateGroupForm";
import EventsList from "./components/EventsComponent/loadAllEvents";
import EventDetails from "./components/EventsComponent/eventDetails";
import CreateEvent from "./components/EventsComponent/eventForm";
import groupMembers from "./components/Groups/Members/groupMembers";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/groups/new" component={CreateGroupForm}></Route>
          <Route exact path = '/groups/:groupId/events/new' component={CreateEvent}></Route>
          <Route exact path="/groups">
            <GroupsList />
          </Route>
          <Route exact path="/groups/:groupId">
            <GroupDetails />
          </Route>
          <Route
            exact
            path="/groups/:groupId/edit"
            component={EditGroupForm}
          ></Route>
          <Route exact path = '/events' component = {EventsList}></Route>
          <Route exact path = '/events/:eventId' component={EventDetails}>
          </Route>
          <Route exact path = '/groups/:groupdId/members' component={groupMembers}></Route>
        </Switch>
      )}
    </>
  );
}

export default App;
