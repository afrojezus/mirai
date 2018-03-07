import React, { Component } from "react";
import LoadableVisibility from "react-loadable-visibility/react-loadable";
import { Route, withRouter, Switch } from "react-router-dom";
import { CircularProgress } from "material-ui/Progress";
import { withStyles } from "material-ui/styles";
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";
import { connect } from "react-redux";
import { MIR_PLAY_SHOW } from "../constants";
/* import Home from './home';
import Setup from './setup';
import Show from './show';
import Wizard from './wizard';
import User from './user';
import Feeds from './feeds';
import Rankings from './rankings';
import Live from './live';
import Monika from './monika';
import Settings from './settings';
import Search from './search';
import Fig from './fig';
import Read from './read';
import Tag from './tag';
import Later from './later';
import History from './history';
import Help from './help';
import Tos from './tos';
import DevPlayer from './dev/player';
import DevDB from './dev/db';
*/
import Watch from "./watch";
import PageNotFound from "./pnf";
import Stream from "../components/mirstreamer";

import withRoot from "../components/withRoot";

import Superbar from "../components/superbar";
import { LoadingScreen } from "../components/layouts";

import { history } from "../store";
import { mirLoader } from "../utils/mirLoader";

const styles = theme => ({
  root: {},
  welcomeMessage: {
    margin: "auto",
    flex: 0,
    marginBottom: -500,
    color: "white",
    fontWeight: 700,
    transition: theme.transitions.create(["all"])
  }
});
const Home = LoadableVisibility({
  loader: () => import("./home.jsx"),
  loading: LoadingScreen
});
const Setup = LoadableVisibility({
  loader: () => import("./setup.jsx"),
  loading: LoadingScreen
});
const Show = LoadableVisibility({
  loader: () => import("./show.jsx"),
  loading: LoadingScreen
});
const Wizard = LoadableVisibility({
  loader: () => import("./wizard.jsx"),
  loading: LoadingScreen
});
const Later = LoadableVisibility({
  loader: () => import("./later.jsx"),
  loading: LoadingScreen
});
const Live = LoadableVisibility({
  loader: () => import("./live.jsx"),
  loading: LoadingScreen
});
const Monika = LoadableVisibility({
  loader: () => import("./monika.jsx"),
  loading: LoadingScreen
});
const Read = LoadableVisibility({
  loader: () => import("./read.jsx"),
  loading: LoadingScreen
});
const Search = LoadableVisibility({
  loader: () => import("./search.jsx"),
  loading: LoadingScreen
});
const History = LoadableVisibility({
  loader: () => import("./history.jsx"),
  loading: LoadingScreen
});
const Rankings = LoadableVisibility({
  loader: () => import("./rankings.jsx"),
  loading: LoadingScreen
});
const User = LoadableVisibility({
  loader: () => import("./user.jsx"),
  loading: LoadingScreen
});
const Tos = LoadableVisibility({
  loader: () => import("./tos.jsx"),
  loading: LoadingScreen
});
const Tag = LoadableVisibility({
  loader: () => import("./tag.jsx"),
  loading: LoadingScreen
});
const Feeds = LoadableVisibility({
  loader: () => import("./feeds.jsx"),
  loading: LoadingScreen
});
const Settings = LoadableVisibility({
  loader: () => import("./settings.jsx"),
  loading: LoadingScreen
});
const Fig = LoadableVisibility({
  loader: () => import("./fig.jsx"),
  loading: LoadingScreen
});
const Help = LoadableVisibility({
  loader: () => import("./help.jsx"),
  loading: LoadingScreen
});
const DevDB = LoadableVisibility({
  loader: () => import("./dev/db.jsx"),
  loading: LoadingScreen
});
const DevPlayer = LoadableVisibility({
  loader: () => import("./dev/player.jsx"),
  loading: LoadingScreen
});
class Index extends Component {
  state = {
    loading: true
  };

  componentWillMount = () => {
    this.props.removeDataFromMir(null);
  };

  componentWillReceiveProps = async ({ authExists, mir, profile }) => {
    if (authExists && mir) {
      return await this.handleProfile(profile);
    } else if (mir) {
      return this.setState({ loading: false });
    } else {
      return this.setState({ loading: false });
    }
  };

  handleProfile = async profile => {
    if (profile.userID) {
      if (profile.role !== undefined) return this.setState({ loading: false });
      else
        return this.props.firebase
          .database()
          .ref("/users")
          .child(profile.userID)
          .update({ role: "Normal" })
          .then(() => this.setState({ loading: false }));
    } else {
      return this.setState({ loading: true });
    }
  };

  render() {
    if (this.state.loading) return <LoadingScreen />;
    return (
      <div
        className={this.props.classes.root}
        style={{ opacity: this.state.loading && !this.props.mir.twist ? 0 : 1 }}
      >
        <Superbar history={history}>
          <Switch>
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
            <Route path="/tag" exact component={Tag} />
            <Route path="/later" exact component={Later} />
            <Route path="/history" exact component={History} />
            <Route path="/help" exact component={Help} />
            <Route path="/stream" exact component={Stream} />
            <Route path="/tou" exact component={Tos} />
            <Route exact component={PageNotFound} />
            {isEmpty(this.props.profile) ? null : this.props.profile.role ===
            "Normal" ? null : this.props.profile.role === "dev" || "admin" ? (
              <Route path="/admin/db" exact component={DevDB} />
            ) : null}
            {!isEmpty(this.props.profile) &&
            this.props.profile.isDeveloper === true ? (
              <Route path="/dev/player" exact component={DevPlayer} />
            ) : null}
          </Switch>
        </Superbar>
      </div>
    );
  }
}

export const loadPlayer = play => ({
  type: MIR_PLAY_SHOW,
  play
});

const mapPTS = dispatch => ({
  removeDataFromMir: play => dispatch(loadPlayer(play))
});

export default withRouter(
  firebaseConnect()(
    connect(
      ({ firebase: { auth, profile }, mir, routing }) => ({
        authExists: !!auth && !!auth.uid && !!profile,
        mir,
        routing,
        profile
      }),
      mapPTS
    )(withRoot(withStyles(styles, { withTheme: true })(Index)))
  )
);
