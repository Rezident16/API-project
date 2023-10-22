import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import GroupsList from './components/Groups/index'
import GroupDetails from "./components/Groups/group";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && 
      <Switch>
        <Route exact path='/'>
          <LandingPage/>
        </Route>
        <Route exact path='/groups'>
          <GroupsList/>
        </Route>
        <Route exact path='/groups/:groupId'>
          <GroupDetails/>
        </Route>
        </Switch>
        }
    </>
  );
}

export default App;
