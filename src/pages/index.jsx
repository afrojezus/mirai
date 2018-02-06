/* eslint-disable flowtype/require-valid-file-annotation */
// TODO: Fix every single eslint-airbnb issue
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';
import { Route, withRouter } from 'react-router-dom';
import { CircularProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';
import {
	firebaseConnect,
	isLoaded,
	isEmpty,
	firebase
} from 'react-redux-firebase';
import { connect } from 'react-redux';

import withRoot from '../components/withRoot';

import Superbar from '../components/superbar';

import { history } from '../store';

const styles = theme => ({
	root: {},
	loadingRoot: {
		height: '100%',
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		animation: 'loadIn .3s ease',
		transition: theme.transitions.create(['all'])
	},
	loadingCircle: {
		margin: 'auto',
		color: 'white'
	},
	welcomeMessage: {
		margin: 'auto',
		flex: 0,
		marginBottom: -500,
		color: 'white',
		fontWeight: 700,
		transition: theme.transitions.create(['all'])
	}
});

const Home = Loadable({
	loader: () => import('./home.jsx')
});
const Setup = Loadable({
	loader: () => import('./setup.jsx')
});
const Show = Loadable({
	loader: () => import('./show.jsx')
});
const Wizard = Loadable({
	loader: () => import('./wizard.jsx')
});
const Later = Loadable({
	loader: () => import('./later.jsx')
});
const Live = Loadable({
	loader: () => import('./live.jsx')
});
const Monika = Loadable({
	loader: () => import('./monika.jsx')
});
const Read = Loadable({
	loader: () => import('./read.jsx')
});
const Search = Loadable({
	loader: () => import('./search.jsx')
});
const History = Loadable({
	loader: () => import('./history.jsx')
});
const Rankings = Loadable({
	loader: () => import('./rankings.jsx')
});
const User = Loadable({
	loader: () => import('./user.jsx')
});
const Watch = Loadable({
	loader: () => import('./watch.jsx')
});
const Tos = Loadable({
	loader: () => import('./tos.jsx')
});
const Tag = Loadable({
	loader: () => import('./tag.jsx')
});
const Feeds = Loadable({
	loader: () => import('./feeds.jsx')
});
const Settings = Loadable({
	loader: () => import('./settings.jsx')
});
const Fig = Loadable({
	loader: () => import('./fig.jsx')
});
const Help = Loadable({
	loader: () => import('./help.jsx')
});
const DevDB = Loadable({
	loader: () => import('./dev/db.jsx')
});
const DevPlayer = Loadable({
	loader: () => import('./dev/player.jsx')
});

// TODO: Use code-splitting on every route
class Index extends Component {
	state = {
		loading: true
	};

	componentDidMount = async () => {
		const { auth } = this.props.firebase;
		if (isLoaded(auth)) {
			if (isEmpty(auth)) {
				// Logged off
				this.setState({ loading: false });
			} else {
				// Logged in
				this.setState({ loading: false });
			}
		}
	};

	componentWillReceiveProps = nextProps => {
		if (
			nextProps.mir !== undefined ||
			((null && nextProps.mir.twist !== undefined) || null)
		) {
			this.setState({ loading: false });
		}
	};

	handleTwist = async () => {
		const database = this.props.firebase.ref('twist');
		if (this.props.mir && this.props.mir.twist) {
			const twist = this.props.mir.twist.filter(s => !s.ongoing);
			if (twist) {
				database.update(twist);
			} else return null;
		}
		return false;
	};

	/* componentWillUnmount = async () =>
      this.state.user
        ? Database.ref("status")
            .child(this.state.user.userID)
            .remove()
            .then(async () =>
              Database.ref("users")
                .child(Auth.currentUser.uid)
                .update({ status: "Offline" })
            )
        : null; */

	render() {
		if (this.state.loading)
			return (
  <div className={this.props.classes.loadingRoot}>
    <CircularProgress className={this.props.classes.loadingCircle} />
  </div>
			);
		return (
  <div className={this.props.classes.root}>
    <Superbar history={history}>
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
      <Route path="/tou" exact component={Tos} />
      {!isEmpty(this.props.firebase.profile) &&
					this.props.firebase.profile.isDeveloper === true ? (
  <Route path="/dev/db" exact component={DevDB} />
					) : null}
      {!isEmpty(this.props.firebase.profile) &&
					this.props.firebase.profile.isDeveloper === true ? (
  <Route path="/dev/player" exact component={DevPlayer} />
					) : null}
    </Superbar>
  </div>
		);
	}
}

Index.propTypes = {
	classes: styles,
	firebase,
	mir: {
		title: PropTypes.string,
		mir: []
	}
};

Index.defaultProps = {
	classes: styles,
	firebase,
	mir: null
};

export default withRouter(
	firebaseConnect()(
		connect(state => state)(withRoot(withStyles(styles)(Index)))
	)
);
