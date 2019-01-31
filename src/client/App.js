import React, { Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "./store/configureStore";

import "./styles/App.scss";
import Navigation from "./components/Navigation";
import Overview from "./containers/Overview";
import Users from "./containers/Users";
import Media from "./containers/Media";
import Preview from "./containers/Preview";
import DisplayScreen from "./containers/DisplayScreen";

const onBeforeLift = () => {
  // take some action before the gate lifts
};

const App = () => (
  <Provider store={store}>
    <PersistGate
      loading={null}
      onBeforeLift={onBeforeLift}
      persistor={persistor}
    >
      <Router>
        <Fragment>
          <Route
            path="*"
            render={({ props, match }) => (
              <Fragment>
                {match.url.indexOf("/display") !== 0 && <Navigation />}
              </Fragment>
            )}
          />
          <Route path="/" exact component={Overview} />
          <Route path="/media" component={Media} />
          <Route path="/users" component={Users} />
          <Route path="/preview" component={Preview} />
          <Route path="/display" component={DisplayScreen} />
        </Fragment>
      </Router>
    </PersistGate>
  </Provider>
);

export default App;
