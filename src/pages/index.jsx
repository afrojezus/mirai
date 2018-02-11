/* eslint-disable flowtype/require-valid-file-annotation */
// TODO: Fix every single eslint-airbnb issue
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadableVisibility from 'react-loadable-visibility/react-loadable';
import { Route, withRouter } from 'react-router-dom';
import { CircularProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';
import {
	firebaseConnect,
	isLoaded,
	isEmpty,
	firebase,
} from 'react-redux-firebase';
import { connect } from 'react-redux';
import { MIR_PLAY_SHOW } from '../constants';

import Home from './home';
import Setup from './setup';
import Show from './show';
import Wizard from './wizard';
import User from './user';
import Feeds from './feeds';
import Rankings from './rankings';
import Live from './live';
import Watch from './watch';
import Monika from './monika';
import Settings from './settings';
import Search from './search';
import Fig from './fig';
import Read from './read';
import Tag from './tag';
import Later from './later';
import History from './history';
import PageNotFound from './pnf';
import Help from './help';
import Tos from './tos';
import DevPlayer from './dev/player';
import DevDB from './dev/db';
import withRoot from '../components/withRoot';

import Superbar from '../components/superbar';
import { LoadingScreen } from '../components/layouts';

import { history } from '../store';

const styles = theme => ({
	root: {},
	welcomeMessage: {
		margin: 'auto',
		flex: 0,
		marginBottom: -500,
		color: 'white',
		fontWeight: 700,
		transition: theme.transitions.create(['all']),
	},
});
/*
const Home = LoadableVisibility({
	loader: () => import('./home.jsx'),
	loading: LoadingScreen
});
const Setup = LoadableVisibility({
	loader: () => import('./setup.jsx'),
	loading: LoadingScreen
});
const Show = LoadableVisibility({
	loader: () => import('./show.jsx'),
	loading: LoadingScreen
});
const Wizard = LoadableVisibility({
	loader: () => import('./wizard.jsx'),
	loading: LoadingScreen
});
const Later = LoadableVisibility({
	loader: () => import('./later.jsx'),
	loading: LoadingScreen
});
const Live = LoadableVisibility({
	loader: () => import('./live.jsx'),
	loading: LoadingScreen
});
const Monika = LoadableVisibility({
	loader: () => import('./monika.jsx'),
	loading: LoadingScreen
});
const Read = LoadableVisibility({
	loader: () => import('./read.jsx'),
	loading: LoadingScreen
});
const Search = LoadableVisibility({
	loader: () => import('./search.jsx'),
	loading: LoadingScreen
});
const History = LoadableVisibility({
	loader: () => import('./history.jsx'),
	loading: LoadingScreen
});
const Rankings = LoadableVisibility({
	loader: () => import('./rankings.jsx'),
	loading: LoadingScreen
});
const User = LoadableVisibility({
	loader: () => import('./user.jsx'),
	loading: LoadingScreen
});
const Tos = LoadableVisibility({
	loader: () => import('./tos.jsx'),
	loading: LoadingScreen
});
const Tag = LoadableVisibility({
	loader: () => import('./tag.jsx'),
	loading: LoadingScreen
});
const Feeds = LoadableVisibility({
	loader: () => import('./feeds.jsx'),
	loading: LoadingScreen
});
const Settings = LoadableVisibility({
	loader: () => import('./settings.jsx'),
	loading: LoadingScreen
});
const Fig = LoadableVisibility({
	loader: () => import('./fig.jsx'),
	loading: LoadingScreen
});
const Help = LoadableVisibility({
	loader: () => import('./help.jsx'),
	loading: LoadingScreen
});
const DevDB = LoadableVisibility({
	loader: () => import('./dev/db.jsx'),
	loading: LoadingScreen
});
const DevPlayer = LoadableVisibility({
	loader: () => import('./dev/player.jsx'),
	loading: LoadingScreen
}); */
class Index extends Component {
	state = {
		loading: true,
	};

	componentWillMount = () => {
		this.props.removeDataFromMir(null);
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

		if (this.props.firebase.auth !== nextProps.firebase.auth) {
			this.setState({ loading: true }, () => this.setState({ loading: false }));
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

export const loadPlayer = play => ({
	type: MIR_PLAY_SHOW,
	play,
});

const mapPTS = dispatch => ({
	removeDataFromMir: play => dispatch(loadPlayer(play)),
});

export default withRouter(
	firebaseConnect()(
		connect(state => state, mapPTS)(
			withRoot(withStyles(styles, { withTheme: true })(Index))
		)
	)
);
