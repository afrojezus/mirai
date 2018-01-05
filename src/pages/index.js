/* eslint-disable flowtype/require-valid-file-annotation */

import React, { Component } from "react";
import PropTypes from "prop-types";
import "zen-observable";
import localForage from "localforage";
import "localforage-observable";
import { Router, Route, Switch } from "react-router-dom";
import { spring } from "react-router-transition";
import Button from "material-ui/Button";
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "material-ui/Dialog";
import { CircularProgress } from "material-ui/Progress";
import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";
import withRoot from "../components/withRoot";

import Superbar from "../components/superbar";
import { Auth, Database } from "../utils/firebase";
import history from "../history";
import meta from "../meta";

import Twist from "../twist-api";

import Home from "./home";
import Setup from "./setup";
import Show from "./show";
import Wizard from "./wizard";
import User from "./user";
import Feeds from "./feeds";
import Rankings from "./rankings";
import Live from "./live";
import Watch from "./watch";
import Monika from "./monika";
import Settings from "./settings";
import Search from "./search";

const styles = theme => ({
  root: {},
  loadingRoot: {
    height: "100%",
    width: "100%",
    display: "flex"
  },
  loadingCircle: {
    margin: "auto"
  }
});

// Temp code, way too lazy to care.

// we need to map the `scale` prop we define below
// to the transform style property
function mapStyles(styles) {
  return {
    opacity: styles.opacity,
    transform: window.safari ? "initial" : `scale(${styles.scale})`
  };
}

// wrap the `spring` helper to use a bouncy config
function bounce(val) {
  return spring(val, {
    stiffness: 400,
    damping: 44
  });
}

// child matches will...
const bounceTransition = {
  // start in a transparent, upscaled state
  atEnter: {
    opacity: 0,
    scale: 1.12
  },
  // leave in a transparent, downscaled state
  atLeave: {
    opacity: bounce(0),
    scale: bounce(0.8)
  },
  // and rest at an opaque, normally-scaled state
  atActive: {
    opacity: bounce(1),
    scale: bounce(1)
  }
};

class Index extends Component {
  state = {
    open: false,
    user: null,
    loading: true,
    twistBase: [],
    yu: null,
    status: {}
  };

  componentWillMount = async () => localForage.ready();

  componentDidMount = () =>
    Auth.onAuthStateChanged(async user => {
      if (user) {
        let db = Database.ref("users").child(Auth.currentUser.uid);
        db.on("value", async rawdata => {
          const data = rawdata.val();
          this.setState({ user: data, loading: false }, async () => {
            if (data.mal) this.popuraFetch(data.mal);
            Database.ref("status").on("value", s =>
              this.setState({ status: s.val() }, async () =>
                Database.ref("status")
                  .child(Auth.currentUser.uid)
                  .set({ online: true })
                  .then(async () =>
                    Database.ref("users")
                      .child(Auth.currentUser.uid)
                      .update({ status: "Online" })
                  )
              )
            );
            const userInStorage = await localForage.setItem("user", data);
            if (userInStorage) {
            }
          });
        });
      } else {
        this.setState({ user: null, loading: false }, async () =>
          localForage.removeItem("user")
        );
      }
      const twistBase = await Twist.load();
      if (twistBase) this.setState({ twistBase }); //async () => user ? Database.ref('anidb').update(twistBase).then(() => console.info('Anime database updated!')) : null);
    });

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  };

  handleClick = () => {
    this.setState({
      open: true
    });
  };

  componentWillUnmount = async () =>
    Database.ref("status")
      .child(this.state.user.userID)
      .remove()
      .then(async () =>
        Database.ref("users")
          .child(Auth.currentUser.uid)
          .update({ status: "Offline" })
      );

  render() {
    if (this.state.loading)
      return (
        <div className={this.props.classes.loadingRoot}>
          <CircularProgress className={this.props.classes.loadingCircle} />
        </div>
      );
    return (
      <div className={this.props.classes.root}>
        <Router history={history}>
          <div>
            <Superbar
              meta={meta}
              history={history}
              user={this.state.user}
              twistBase={this.state.twistBase}
              status={this.state.status}
            >
              <Switch
                atEnter={bounceTransition.atEnter}
                atLeave={bounceTransition.atLeave}
                atActive={bounceTransition.atActive}
                mapStyles={mapStyles}
                className="switch-wrapper"
              >
                <Route
                  path="/"
                  exact
                  component={() => (
                    <Home
                      user={this.state.user}
                      history={history}
                      meta={meta}
                      status={this.state.status}
                    />
                  )}
                />
                <Route
                  path="/setup"
                  exact
                  component={() => (
                    <Setup
                      user={this.state.user}
                      history={history}
                      meta={meta}
                    />
                  )}
                />
                <Route
                  path="/show"
                  exact
                  component={() => (
                    <Show
                      user={this.state.user}
                      history={history}
                      meta={meta}
                    />
                  )}
                />
                <Route
                  path="/wizard"
                  exact
                  component={() => (
                    <Wizard
                      user={this.state.user}
                      history={history}
                      meta={meta}
                    />
                  )}
                />
                <Route
                  path="/user"
                  exact
                  component={() => (
                    <User
                      user={this.state.user}
                      history={history}
                      meta={meta}
                      status={this.state.status}
                    />
                  )}
                />
                <Route
                  path="/feeds"
                  exact
                  component={() => (
                    <Feeds
                      user={this.state.user}
                      history={history}
                      meta={meta}
                    />
                  )}
                />
                <Route
                  path="/rankings"
                  exact
                  component={() => (
                    <Rankings
                      user={this.state.user}
                      history={history}
                      meta={meta}
                    />
                  )}
                />
                <Route
                  path="/live"
                  exact
                  component={() => (
                    <Live
                      user={this.state.user}
                      history={history}
                      meta={meta}
                    />
                  )}
                />
                <Route
                  path="/watch"
                  exact
                  component={() => (
                    <Watch
                      user={this.state.user}
                      history={history}
                      meta={meta}
                      twist={this.state.twistBase}
                    />
                  )}
                />
                <Route
                  path="/monika"
                  exact
                  component={() => (
                    <Monika
                      user={this.state.user}
                      history={history}
                      meta={meta}
                      twist={this.state.twistBase}
                    />
                  )}
                />
                <Route
                  path="/settings"
                  exact
                  component={() => (
                    <Settings
                      user={this.state.user}
                      history={history}
                      meta={meta}
                      twist={this.state.twistBase}
                    />
                  )}
                />
                <Route
                  path="/search"
                  exact
                  component={() => (
                    <Search
                      user={this.state.user}
                      history={history}
                      meta={meta}
                      twist={this.state.twistBase}
                    />
                  )}
                />
              </Switch>
            </Superbar>
          </div>
        </Router>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(Index));
