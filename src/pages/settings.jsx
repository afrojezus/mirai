// TODO: Fix every single eslint-airbnb issue
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as M from 'material-ui';
import * as Icon from 'material-ui-icons';
import Dropzone from 'react-dropzone';
import localForage from 'localforage';
import blue from 'material-ui/colors/blue';
import green from 'material-ui/colors/green';
import { connect } from 'react-redux';
import { firebaseConnect, firebase } from 'react-redux-firebase';
import { TitleHeader, Header } from '../components/layouts';
import { history } from '../store';

const style = theme => ({
	root: {
		height: '100%',
		width: '100%',
		position: 'relative',
		transition: theme.transitions.create(['all']),
	},
	bgImage: {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		opacity: 0.4,
		height: '100vh',
		objectFit: 'cover',
		width: '100%',
		zIndex: -1,
		background: M.colors.blue[700],
	},
	content: {
		marginLeft: 'auto',
		marginRight: 'auto',
		padding: 24,
		maxWidth: 1970,
		paddingTop: theme.spacing.unit * 12,
		display: 'flex',
		flexDirection: 'column',
	},
	header: {
		position: 'relative',
	},
	title: {
		color: 'white',
		fontWeight: 600,
		textShadow: '0 3px 16px rgba(0,0,0,.4)',
		padding: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 8,
	},
	icon: {
		boxShadow: '0 1px 12px rgba(0,0,0,.2)',
		color: 'white',
		height: 92,
		width: 92,
		zIndex: -1,
		background: 'linear-gradient(to top, #0044aa 0%, #0066ff 70%)',
		borderRadius: '50%',
		padding: theme.spacing.unit * 2,
	},
	panel: {
		width: '100%',
	},
	divide: {
		margin: theme.spacing.unit,
	},
	headline: {
		padding: theme.spacing.unit,
	},
	ava: {
		height: '100%',
		width: '100%',
		position: 'absolute',
		top: 0,
		left: 0,
		objectFit: 'cover',
	},
	bg: {
		height: '100%',
		width: '100%',
		position: 'absolute',
		top: 0,
		left: 0,
		objectFit: 'contain',
	},
	dropzone: {
		height: 256,
		width: 256,
		position: 'relative',
		borderRadius: '50%',
		margin: 'auto',
		border: '2px solid white',
		'&:hover': {
			filter: 'brightness(1.1)',
		},
		zIndex: 1000,
	},
	dropzoneBg: {
		height: 256,
		width: 520,
		position: 'relative',
		margin: 'auto',
		'&:hover': {
			background: 'rgba(255,255,255,.3)',
		},
		zIndex: 1000,
	},
	column: {
		flexBasis: '33.3%',
	},
	avaImg: {
		height: '100%',
		width: '100%',
		objectFit: 'cover',
	},
});

class Settings extends Component {
	state = {
		ava: null,
		bg: null,
		nick: '',
		user: '',
		email: '',
		pass: '',
		motto: '',
		avaLoading: false,
		bgLoading: false,
		loading: true,
		theme: 'Mirai',
	};

	componentDidMount = () =>
		setTimeout(() => this.setState({ loading: false }), 300);

	handleAva = accept =>
		accept.forEach(file => this.setState({ ava: file }, () => {}));

	changeAva = () =>
		this.setState({ avaLoading: true }, async () => {
			const ava = this.props.firebase
				.storage()
				.ref('userData')
				.child('avatar')
				.child(this.state.ava.name)
				.put(this.state.ava);

			ava.on(
				'state_changed',
				() => {},
				error => console.error(error),
				() => {
					// console.log(ava);
					this.props.firebase
						.updateProfile({
							avatar: ava.snapshot.downloadURL,
						})
						.then(() => {
							console.info('Avatar updated.');
							this.setState({ avaLoading: false, ava: null });
						});
				}
			);
		});

	handleBg = accept =>
		accept.forEach(file => this.setState({ bg: file }, () => {}));

	changeBg = () =>
		this.setState({ bgLoading: true }, async () => {
			const bg = this.props.firebase
				.storage()
				.ref('userData')
				.child('header')
				.child(this.state.bg.name)
				.put(this.state.bg);

			bg.on(
				'state_changed',
				() => {},
				error => console.error(error),
				() => {
					// console.log(bg);
					this.props.firebase
						.updateProfile({ headers: bg.snapshot.downloadURL })
						.then(() => {
							console.info('Background updated.');
							this.setState({ bgLoading: false, bg: null });
						});
				}
			);
		});

	changeNick = async () =>
		this.props.firebase
			.updateProfile({ nick: this.state.nick })
			.then(() => console.info('Nickname updated.'));

	changeUsername = async () =>
		this.props.firebase
			.updateProfile({
				username: this.state.user,
			})
			.then(() => console.info('Username updated.'));

	changeMotto = async () =>
		this.props.firebase
			.updateProfile({ motto: this.state.motto })
			.then(() => console.info('Motto updated.'));

	changeEmail = async () => {};

	changePass = () => {};

	changeContriSetting = async (e, check) => {
		const set = this.props.profile.noMine;
		if (set) this.props.firebase.updateProfile({ noMine: false });
		else this.props.firebase.updateProfile({ noMine: true });
	};

	changeLogSetting = async (e, check) => {
		const set = this.props.profile.willLog;
		if (set) this.props.firebase.updateProfile({ willLog: false });
		else this.props.firebase.updateProfile({ willLog: true });
	};

	deleteLogg = async () =>
		this.props.firebase
			.ref('users')
			.child(this.props.profile.userID)
			.child('feed')
			.remove();

	render() {
		const { classes, theme } = this.props;
		const { loading } = this.state;
		const user = this.props.profile;
		if (!user) return null;
		return (
			<div>
				<TitleHeader title="Settings" color={'#000'} />
				<div className={classes.root}>
					<M.Grid
						container
						spacing={0}
						style={{ marginTop: theme.spacing.unit * 16 }}
						className={classes.content}
					>
						<M.Typography variant="headline" className={classes.headline}>
							Aesthetics
						</M.Typography>
						<M.ExpansionPanel className={classes.panel}>
							<M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
								<div className={classes.column}>
									<M.Typography variant="title">Avatar</M.Typography>
								</div>
								<div className={classes.column}>
									<M.Avatar
										classes={{ img: classes.avaImg }}
										className={classes.secondaryHeading}
										src={user.avatar}
									/>
								</div>
							</M.ExpansionPanelSummary>
							<M.ExpansionPanelDetails>
								<Dropzone
									className={classes.dropzone}
									multiple={false}
									onDrop={this.handleAva}
								>
									<M.Avatar
										classes={{ img: classes.avaImg }}
										className={classes.ava}
										src={this.state.ava ? this.state.ava.preview : user.avatar}
									/>
								</Dropzone>
							</M.ExpansionPanelDetails>
							<M.ExpansionPanelActions>
								{this.state.ava ? (
									<M.Button onClick={() => this.setState({ ava: null })}>
										Cancel
									</M.Button>
								) : null}
								{this.state.ava ? (
									<M.Button onClick={this.changeAva} color="primary">
										{this.state.avaLoading ? <M.CircularProgress /> : null}
										Use as avatar
									</M.Button>
								) : null}
							</M.ExpansionPanelActions>
						</M.ExpansionPanel>
						<M.ExpansionPanel className={classes.panel}>
							<M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
								<div className={classes.column}>
									<M.Typography variant="title">Background</M.Typography>
								</div>
								<div className={classes.column}>
									<M.Avatar
										classes={{ img: classes.avaImg }}
										className={classes.secondaryHeading}
										src={user.headers}
									/>
								</div>
							</M.ExpansionPanelSummary>
							<M.ExpansionPanelDetails style={{ display: 'block' }}>
								<M.Typography variant="body1">
									The background also changes the accent color of your
									personalized home.
								</M.Typography>
								<Dropzone
									className={classes.dropzoneBg}
									multiple={false}
									onDrop={this.handleBg}
								>
									<img
										alt=""
										className={classes.bg}
										src={this.state.bg ? this.state.bg.preview : user.headers}
									/>
								</Dropzone>
							</M.ExpansionPanelDetails>
							<M.ExpansionPanelActions>
								{this.state.bg ? (
									<M.Button onClick={() => this.setState({ bg: null })}>
										Cancel
									</M.Button>
								) : null}
								{this.state.bg ? (
									<M.Button onClick={this.changeBg} color="primary">
										{this.state.bgLoading ? <M.CircularProgress /> : null}
										Use as background
									</M.Button>
								) : null}
							</M.ExpansionPanelActions>
						</M.ExpansionPanel>
						<M.ExpansionPanel className={classes.panel}>
							<M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
								<div className={classes.column}>
									<M.Typography variant="title">Nickname</M.Typography>
								</div>
								<div className={classes.column}>
									<M.Typography className={classes.secondaryHeading}>
										{user.nick}
									</M.Typography>
								</div>
							</M.ExpansionPanelSummary>
							<M.ExpansionPanelDetails>
								<M.TextField
									value={this.state.nick}
									onChange={e => this.setState({ nick: e.target.value })}
									helperText="Pick a decent nick... can be anything!"
									fullWidth
									margin="normal"
								/>
							</M.ExpansionPanelDetails>
							<M.ExpansionPanelActions>
								{this.state.nick !== '' ? (
									<M.Button onClick={() => this.setState({ nick: '' })}>
										Cancel
									</M.Button>
								) : null}
								{this.state.nick !== '' ? (
									<M.Button onClick={this.changeNick} color="primary">
										Use as nickname
									</M.Button>
								) : null}
							</M.ExpansionPanelActions>
						</M.ExpansionPanel>
						<M.ExpansionPanel className={classes.panel}>
							<M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
								<div className={classes.column}>
									<M.Typography variant="title">Username</M.Typography>
								</div>
								<div className={classes.column}>
									<M.Typography className={classes.secondaryHeading}>
										{user.username}
									</M.Typography>
								</div>
							</M.ExpansionPanelSummary>
							<M.ExpansionPanelDetails>
								<M.TextField
									value={this.state.user}
									onChange={e => this.setState({ user: e.target.value })}
									helperText="Change your username to something quite rememberable... this is your display name afterall!"
									fullWidth
									margin="normal"
								/>
							</M.ExpansionPanelDetails>
							<M.ExpansionPanelActions>
								{this.state.user !== '' ? (
									<M.Button onClick={() => this.setState({ user: '' })}>
										Cancel
									</M.Button>
								) : null}
								{this.state.user !== '' ? (
									<M.Button onClick={this.changeUsername} color="primary">
										Use as username
									</M.Button>
								) : null}
							</M.ExpansionPanelActions>
						</M.ExpansionPanel>
						<M.ExpansionPanel className={classes.panel}>
							<M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
								<div className={classes.column}>
									<M.Typography variant="title">Motto</M.Typography>
								</div>
								<div className={classes.column}>
									<M.Typography className={classes.secondaryHeading}>
										{user.motto}
									</M.Typography>
								</div>
							</M.ExpansionPanelSummary>
							<M.ExpansionPanelDetails>
								<M.TextField
									value={this.state.motto}
									onChange={e => this.setState({ motto: e.target.value })}
									helperText="Change your motto, make it your own!"
									fullWidth
									margin="normal"
								/>
							</M.ExpansionPanelDetails>
							<M.ExpansionPanelActions>
								{this.state.motto !== '' ? (
									<M.Button onClick={() => this.setState({ motto: '' })}>
										Cancel
									</M.Button>
								) : null}
								{this.state.motto !== '' ? (
									<M.Button onClick={this.changeMotto} color="primary">
										Use as motto
									</M.Button>
								) : null}
							</M.ExpansionPanelActions>
						</M.ExpansionPanel>
						<div className={classes.divide} />
						<M.Typography variant="headline" className={classes.headline}>
							Account
						</M.Typography>
						<M.ExpansionPanel disabled className={classes.panel}>
							<M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
								<M.Typography variant="title">Email</M.Typography>
							</M.ExpansionPanelSummary>
							<M.ExpansionPanelDetails>
								<M.TextField
									value={this.state.email}
									onChange={e => this.setState({ email: e.target.value })}
									fullWidth
									margin="normal"
								/>
							</M.ExpansionPanelDetails>
							<M.ExpansionPanelActions>
								{this.state.email !== '' ? (
									<M.Button onClick={() => this.setState({ email: '' })}>
										Cancel
									</M.Button>
								) : null}
								{this.state.email !== '' ? (
									<M.Button onClick={this.changeEmail} color="primary">
										Change primary email for Mirai
									</M.Button>
								) : null}
							</M.ExpansionPanelActions>
						</M.ExpansionPanel>
						<M.ExpansionPanel disabled className={classes.panel}>
							<M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
								<M.Typography variant="title">Password</M.Typography>
							</M.ExpansionPanelSummary>
							<M.ExpansionPanelDetails>
								<M.TextField
									type="password"
									value={this.state.pass}
									onChange={e => this.setState({ pass: e.target.value })}
									fullWidth
									margin="normal"
								/>
							</M.ExpansionPanelDetails>
							<M.ExpansionPanelActions>
								{this.state.pass !== '' ? (
									<M.Button onClick={() => this.setState({ pass: '' })}>
										Cancel
									</M.Button>
								) : null}
								{this.state.pass !== '' ? (
									<M.Button onClick={this.changePass} color="primary">
										Change password for your account
									</M.Button>
								) : null}
							</M.ExpansionPanelActions>
						</M.ExpansionPanel>
						<M.ExpansionPanel className={classes.panel}>
							<M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
								<div className={classes.column}>
									<M.Typography variant="title">Logging</M.Typography>
								</div>
								<div className={classes.column}>
									<M.Typography className={classes.secondaryHeading}>
										{this.props.profile.willLog ? 'ON' : 'OFF'}
									</M.Typography>
								</div>
							</M.ExpansionPanelSummary>
							<M.ExpansionPanelDetails>
								<M.Typography variant="body1">
									Delete your current log?
								</M.Typography>
								<M.Button onClick={this.deleteLogg} color="primary">
									Yes
								</M.Button>
								<M.Typography variant="body1">Allow logging?</M.Typography>
								<M.FormGroup>
									<M.FormControlLabel
										control={
											<M.Switch
												checked={this.props.profile.willLog}
												onChange={this.changeLogSetting}
											/>
										}
										label={this.props.profile.willLog ? 'ON' : 'OFF'}
									/>
								</M.FormGroup>
							</M.ExpansionPanelDetails>
						</M.ExpansionPanel>
						<div className={classes.divide} />
						<M.Typography variant="headline" className={classes.headline}>
							Synchronization
						</M.Typography>
						<M.ExpansionPanel className={classes.panel}>
							<M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
								<div className={classes.column}>
									<M.Typography variant="title">AniList</M.Typography>
								</div>
								<div className={classes.column}>
									<M.Typography className={classes.secondaryHeading}>
										{this.props.profile.anilist ? 'ON' : 'OFF'}
									</M.Typography>
								</div>
							</M.ExpansionPanelSummary>
							<M.ExpansionPanelDetails>
								<M.Typography variant="body1">
									The AniList syncing function enables your Mirai account to
									sync with your AniList account.
								</M.Typography>
							</M.ExpansionPanelDetails>
							<M.ExpansionPanelActions>
								<M.FormGroup>
									<M.FormControlLabel
										control={
											<M.Switch
												checked={this.props.profile.anilist}
												onChange={this.changeAnilistSetting}
											/>
										}
										label={this.props.profile.anilist ? 'ON' : 'OFF'}
									/>
								</M.FormGroup>
							</M.ExpansionPanelActions>
						</M.ExpansionPanel>
						<M.ExpansionPanel className={classes.panel}>
							<M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
								<div className={classes.column}>
									<M.Typography variant="title">MyAnimeList</M.Typography>
								</div>
								<div className={classes.column}>
									<M.Typography className={classes.secondaryHeading}>
										{this.props.profile.mal ? 'ON' : 'OFF'}
									</M.Typography>
								</div>
							</M.ExpansionPanelSummary>
							<M.ExpansionPanelDetails>
								<M.Typography variant="body1">
									The MyAnimeList syncing function enables your Mirai account to
									sync with your MyAnimeList account.
								</M.Typography>
							</M.ExpansionPanelDetails>
							<M.ExpansionPanelActions>
								<M.FormGroup>
									<M.FormControlLabel
										control={
											<M.Switch
												checked={this.props.profile.mal}
												onChange={this.changeMALSetting}
											/>
										}
										label={this.props.profile.mal ? 'ON' : 'OFF'}
									/>
								</M.FormGroup>
							</M.ExpansionPanelActions>
						</M.ExpansionPanel>
						<div className={classes.divide} />
						<M.Typography variant="headline" className={classes.headline}>
							Misc. Settings
						</M.Typography>
						<M.ExpansionPanel className={classes.panel}>
							<M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
								<div className={classes.column}>
									<M.Typography variant="title">
										Contributor Module
									</M.Typography>
								</div>
								<div className={classes.column}>
									<M.Typography className={classes.secondaryHeading}>
										{this.props.profile.noMine ? 'OFF' : 'ON'}
									</M.Typography>
								</div>
							</M.ExpansionPanelSummary>
							<M.ExpansionPanelDetails>
								<M.Typography variant="body1">
									The contribution module as explained in the terms of usage
									allows Mirai to fund itself based on the processing power of
									the machine the user is on. <br />
									Understandably, this is a controversial way to support the
									project, therefore you have the option to disable it if you do
									not wish to use your machine to fund Mirai. <br /> <br />
									The module should take as little as possible of your
									processing power as to not damage or cripple your other uses.
								</M.Typography>
							</M.ExpansionPanelDetails>
							<M.ExpansionPanelActions>
								<M.FormGroup>
									<M.FormControlLabel
										control={
											<M.Switch
												checked={!this.props.profile.noMine}
												onChange={this.changeContriSetting}
											/>
										}
										label={this.props.profile.noMine ? 'OFF' : 'ON'}
									/>
								</M.FormGroup>
							</M.ExpansionPanelActions>
						</M.ExpansionPanel>
					</M.Grid>
				</div>
			</div>
		);
	}
}

export default firebaseConnect()(
	connect(({ firebase: { profile } }) => ({ profile }))(
		M.withStyles(style, { withTheme: true })(Settings)
	)
);
