/* eslint-disable flowtype/require-valid-file-annotation */

import React, { Component } from "react";
import PropTypes from "prop-types";
import localForage from "localforage";
import { Route } from "react-router-dom";
import { CircularProgress } from "material-ui/Progress";
import { withStyles } from "material-ui/styles";
import withRoot from "../components/withRoot";

import Superbar from "../components/superbar";
import meta from "../meta";

import { history } from "../store";
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";

import { connect } from "react-redux";

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
import Fig from "./fig";
import Read from "./read";
import Typography from "material-ui/Typography/Typography";

const styles = theme => ({
  root: {},
  loadingRoot: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    animation: "loadIn .3s ease",
    transition: theme.transitions.create(["all"])
  },
  loadingCircle: {
    margin: "auto"
  },
  welcomeMessage: {
    margin: "auto",
    flex: 0,
    marginBottom: -500,
    color: "white",
    fontWeight: 700,
    transition: theme.transitions.create(["all"])
  }
});

class Index extends Component {
  state = {
    open: false,
    loading: true
  };

  componentWillMount = async () => localForage.ready();

  componentDidMount = async () => {
    const { auth } = this.props.firebase;
    if (isLoaded(auth)) {
      if (isEmpty(auth)) {
        console.log("Logged off");

        this.setState({ loading: false });
      } else {
        console.log("Logged in");
        this.setState({ loading: false });
      }
    }
    const twistBase = await Twist.load();
    if (twistBase) this.setState({ twistBase });
  };

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

  /*componentWillUnmount = async () =>
    this.state.user
      ? Database.ref("status")
          .child(this.state.user.userID)
          .remove()
          .then(async () =>
            Database.ref("users")
              .child(Auth.currentUser.uid)
              .update({ status: "Offline" })
          )
      : null;*/

  render() {
    if (this.state.loading)
      return (
        <div className={this.props.classes.loadingRoot}>
          <CircularProgress className={this.props.classes.loadingCircle} />
        </div>
      );
    return (
      <div className={this.props.classes.root}>
        <Superbar meta={meta} history={history}>
          <Route path="/" exact component={Home} />
          <Route path="/setup" exact component={Setup} />
          <Route path="/show" exact component={Show} />
          <Route path="/wizard" exact component={Wizard} />
          <Route path="/user" exact component={User} />
          <Route path="/feeds" exact component={Feeds} />
          <Route path="/rankings" exact component={Rankings} />
          <Route path="/live" exact component={Live} />
          <Route path="/watch" exact component={Watch} />
          <Route path="/monika" exact component={Monika} />
          <Route path="/settings" exact component={Settings} />
          <Route path="/search" exact component={Search} />
          <Route path="/read" exact component={Read} />
          <Route path="/fig" exact component={Fig} />
        </Superbar>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired
};

export default firebaseConnect()(withRoot(withStyles(styles)(Index)));
