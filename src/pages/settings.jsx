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
import { TitleHeader, Header, Column, Row } from '../components/layouts';
import { history } from '../store';

import strings from '../strings.json';
import { scrollFix } from './../utils/scrollFix';

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
		maxWidth: 1600,
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
		width: 480,
		position: 'relative',
		margin: 'auto',
		border: '2px solid white',
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
		langCode: 'en-us',
		lang: strings.enus,
		langVal: '',
	};

	componentWillMount = () => {
		scrollFix();
		const lang = localStorage.getItem('language');
		switch (lang) {
			case 'en-us':
				this.setState({ lang: strings.enus, langCode: 'en-us' });
				break;

			case 'nb-no':
				this.setState({ lang: strings.nbno, langCode: 'nb-no' });
				break;

			case 'jp':
				this.setState({ lang: strings.jp, langCode: 'jp' });
				break;

			default:
				break;
		}
	};

	componentDidMount = () =>
		setTimeout(() => this.setState({ loading: false }), 300);

	changeLangVal = event => {
		this.setState({
			langVal: event.target.value,
			langCode: event.target.value,
		});
	};

	changeLang = value =>
		this.setState({ langCode: value, langVal: null }, () =>
			localStorage.setItem('language', this.state.langCode)
		);

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
		const { loading, langCode, lang, langVal } = this.state;
		const user = this.props.profile;
		if (!user) return null;
		return (
			<div>
				<TitleHeader title={lang.settings.settings} color={'#000'} />
				<div className={classes.root}>
					<M.Grid
						container
						spacing={0}
						style={{ marginTop: theme.spacing.unit * 16 }}
						className={classes.content}
					>
						<M.Typography variant="headline" className={classes.headline}>
							{lang.settings.aesthetics}
						</M.Typography>
						<M.ExpansionPanel className={classes.panel}>
							<M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
								<div className={classes.column}>
									<M.Typography variant="title">
										{lang.settings.language}
									</M.Typography>
								</div>
								<div className={classes.column}>
									<M.Typography variant="body1">{langCode}</M.Typography>
								</div>
							</M.ExpansionPanelSummary>
							<M.ExpansionPanelDetails>
								<Column>
									<M.Typography variant="body1">
										{lang.settings.languageDesc}
									</M.Typography>
									<form>
										<M.FormControl>
											<M.Select value={langCode} onChange={this.changeLangVal}>
												<M.MenuItem value="en-us">English</M.MenuItem>
												<M.MenuItem value="nb-no">Norsk Bokmål</M.MenuItem>
											</M.Select>
										</M.FormControl>
									</form>
								</Column>
							</M.ExpansionPanelDetails>
							<M.ExpansionPanelActions>
								{langVal ? (
									<M.Button
										onClick={() =>
											this.setState({
												langCode: localStorage.getItem('language'),
												langVal: null,
											})
										}
									>
										{lang.settings.cancel}
									</M.Button>
								) : null}
								{langVal ? (
									<M.Button
										onClick={() => this.changeLang(langVal)}
										color="primary"
									>
										{lang.settings.accept}
									</M.Button>
								) : null}
							</M.ExpansionPanelActions>
						</M.ExpansionPanel>
						<M.ExpansionPanel className={classes.panel}>
							<M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
								<div className={classes.column}>
									<M.Typography variant="title">
										{lang.settings.avatar}
									</M.Typography>
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
							<Column>
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
								</Column>
							</M.ExpansionPanelDetails>
							<M.ExpansionPanelActions>
								{this.state.ava ? (
									<M.Button onClick={() => this.setState({ ava: null })}>
										{lang.settings.cancel}
									</M.Button>
								) : null}
								{this.state.ava ? (
									<M.Button onClick={this.changeAva} color="primary">
										{this.state.avaLoading ? <M.CircularProgress /> : null}
										{lang.settings.avaaccept}
									</M.Button>
								) : null}
							</M.ExpansionPanelActions>
						</M.ExpansionPanel>
						<M.ExpansionPanel className={classes.panel}>
							<M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
								<div className={classes.column}>
									<M.Typography variant="title">
										{lang.settings.bg}
									</M.Typography>
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
									{lang.settings.bgdesc}
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
										{lang.settings.cancel}
									</M.Button>
								) : null}
								{this.state.bg ? (
									<M.Button onClick={this.changeBg} color="primary">
										{this.state.bgLoading ? <M.CircularProgress /> : null}
										{lang.settings.bgaccept}
									</M.Button>
								) : null}
							</M.ExpansionPanelActions>
						</M.ExpansionPanel>
						<M.ExpansionPanel className={classes.panel}>
							<M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
								<div className={classes.column}>
									<M.Typography variant="title">
										{lang.settings.nickname}
									</M.Typography>
								</div>
								<div className={classes.column}>
									<M.Typography className={classes.secondaryHeading}>
										{user.nick}
									</M.Typography>
								</div>
							</M.ExpansionPanelSummary>
							<M.ExpansionPanelDetails>
							<Column>
							<M.Typography variant='body1'>{lang.settings.nickdesc}</M.Typography>
								<M.TextField
									value={this.state.nick}
									onChange={e => this.setState({ nick: e.target.value })}
									helperText={lang.settings.nickplaceholder}
									fullWidth
									margin="normal"
								/>
								</Column>
							</M.ExpansionPanelDetails>
							<M.ExpansionPanelActions>
								{this.state.nick !== '' ? (
									<M.Button onClick={() => this.setState({ nick: '' })}>
										{lang.settings.cancel}
									</M.Button>
								) : null}
								{this.state.nick !== '' ? (
									<M.Button onClick={this.changeNick} color="primary">
										{lang.settings.nickaccept}
									</M.Button>
								) : null}
							</M.ExpansionPanelActions>
						</M.ExpansionPanel>
						<M.ExpansionPanel className={classes.panel}>
							<M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
								<div className={classes.column}>
									<M.Typography variant="title">
										{lang.settings.username}
									</M.Typography>
								</div>
								<div className={classes.column}>
									<M.Typography className={classes.secondaryHeading}>
										{user.username}
									</M.Typography>
								</div>
							</M.ExpansionPanelSummary>
							<M.ExpansionPanelDetails>
							<Column>
							<M.Typography variant='body1'>{lang.settings.userdesc}</M.Typography>
								<M.TextField
									value={this.state.user}
									onChange={e => this.setState({ user: e.target.value })}
									helperText={lang.settings.usernameplaceholder}
									fullWidth
									margin="normal"
								/>
								</Column>
							</M.ExpansionPanelDetails>
							<M.ExpansionPanelActions>
								{this.state.user !== '' ? (
									<M.Button onClick={() => this.setState({ user: '' })}>
										{lang.settings.cancel}
									</M.Button>
								) : null}
								{this.state.user !== '' ? (
									<M.Button onClick={this.changeUsername} color="primary">
										{lang.settings.useraccept}
									</M.Button>
								) : null}
							</M.ExpansionPanelActions>
						</M.ExpansionPanel>
						<M.ExpansionPanel className={classes.panel}>
							<M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
								<div className={classes.column}>
									<M.Typography variant="title">
										{lang.settings.motto}
									</M.Typography>
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
									helperText={lang.settings.mottoplaceholder}
									fullWidth
									margin="normal"
								/>
							</M.ExpansionPanelDetails>
							<M.ExpansionPanelActions>
								{this.state.motto !== '' ? (
									<M.Button onClick={() => this.setState({ motto: '' })}>
										{lang.settings.cancel}
									</M.Button>
								) : null}
								{this.state.motto !== '' ? (
									<M.Button onClick={this.changeMotto} color="primary">
										{lang.settings.mottoaccept}
									</M.Button>
								) : null}
							</M.ExpansionPanelActions>
						</M.ExpansionPanel>
						<div className={classes.divide} />
						<M.Typography variant="headline" className={classes.headline}>
							{lang.settings.account}
						</M.Typography>
						<M.ExpansionPanel className={classes.panel}>
							<M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
								<div className={classes.column}>
									<M.Typography variant="title">
										{lang.settings.logging}
									</M.Typography>
								</div>
								<div className={classes.column}>
									<M.Typography className={classes.secondaryHeading}>
										{this.props.profile.willLog
											? lang.settings.on
											: lang.settings.off}
									</M.Typography>
								</div>
							</M.ExpansionPanelSummary>
							<M.ExpansionPanelDetails>
							<Column>
							<Row>
								<M.Typography variant="body1">
									{lang.settings.loggingdelete}
								</M.Typography>
								<M.Button onClick={this.deleteLogg} color="primary">
									{lang.settings.yes}
								</M.Button>
								</Row>
								<M.Typography variant="body1">
									{lang.settings.loggingallow}
								</M.Typography>
								<M.FormGroup>
									<M.FormControlLabel
										control={
											<M.Switch
												checked={this.props.profile.willLog}
												onChange={this.changeLogSetting}
											/>
										}
										label={
											this.props.profile.willLog
												? lang.settings.on
												: lang.settings.off
										}
									/>
								</M.FormGroup>
								</Column>
							</M.ExpansionPanelDetails>
						</M.ExpansionPanel>
						<div className={classes.divide} />
						<M.Typography variant="headline" className={classes.headline}>
							{lang.settings.sync}
						</M.Typography>
						<M.ExpansionPanel className={classes.panel}>
							<M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
								<div className={classes.column}>
									<M.Typography variant="title">AniList</M.Typography>
								</div>
								<div className={classes.column}>
									<M.Typography className={classes.secondaryHeading}>
										{this.props.profile.anilist
											? lang.settings.on
											: lang.settings.off}
									</M.Typography>
								</div>
							</M.ExpansionPanelSummary>
							<M.ExpansionPanelDetails>
								<M.Typography variant="body1">
									{lang.settings.anilistdesc}
								</M.Typography>
							</M.ExpansionPanelDetails>
							<M.ExpansionPanelActions>
								<M.FormGroup>
									<M.FormControlLabel
										control={
											<M.Switch
												disabled
												checked={this.props.profile.anilist}
												onChange={this.changeAnilistSetting}
											/>
										}
										label={
											this.props.profile.anilist
												? lang.settings.on
												: lang.settings.off
										}
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
										{this.props.profile.mal
											? lang.settings.on
											: lang.settings.off}
									</M.Typography>
								</div>
							</M.ExpansionPanelSummary>
							<M.ExpansionPanelDetails>
								<M.Typography variant="body1">
									{lang.settings.maldesc}
								</M.Typography>
							</M.ExpansionPanelDetails>
							<M.ExpansionPanelActions>
								<M.FormGroup>
									<M.FormControlLabel
										control={
											<M.Switch
												disabled
												checked={this.props.profile.mal}
												onChange={this.changeMALSetting}
											/>
										}
										label={
											this.props.profile.mal
												? lang.settings.on
												: lang.settings.off
										}
									/>
								</M.FormGroup>
							</M.ExpansionPanelActions>
						</M.ExpansionPanel>
						<M.ExpansionPanel className={classes.panel}>
							<M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
								<div className={classes.column}>
									<M.Typography variant="title">Discord</M.Typography>
								</div>
								<div className={classes.column}>
									<M.Typography className={classes.secondaryHeading}>
										{this.props.profile.discord
											? lang.settings.on
											: lang.settings.off}
									</M.Typography>
								</div>
							</M.ExpansionPanelSummary>
							<M.ExpansionPanelDetails>
								<M.Typography variant="body1">
									{lang.settings.discorddesc}
								</M.Typography>
							</M.ExpansionPanelDetails>
							<M.ExpansionPanelActions>
								<M.FormGroup>
									<M.FormControlLabel
										control={
											<M.Switch
												disabled
												checked={this.props.profile.discord}
												onChange={this.changeDiscordSetting}
											/>
										}
										label={
											this.props.profile.discord
												? lang.settings.on
												: lang.settings.off
										}
									/>
								</M.FormGroup>
							</M.ExpansionPanelActions>
						</M.ExpansionPanel>
						<div className={classes.divide} />
						<M.Typography variant="headline" className={classes.headline}>
							{lang.settings.misc}
						</M.Typography>
						<M.ExpansionPanel className={classes.panel}>
							<M.ExpansionPanelSummary expandIcon={<Icon.ExpandMore />}>
								<div className={classes.column}>
									<M.Typography variant="title">
										{lang.settings.contribmodule}
									</M.Typography>
								</div>
								<div className={classes.column}>
									<M.Typography className={classes.secondaryHeading}>
										{this.props.profile.noMine
											? lang.settings.off
											: lang.settings.on}
									</M.Typography>
								</div>
							</M.ExpansionPanelSummary>
							<M.ExpansionPanelDetails>
								<M.Typography
									variant="body1"
									dangerouslySetInnerHTML={{
										__html: lang.settings.contribdesc,
									}}
								/>
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
										label={
											this.props.profile.noMine
												? lang.settings.off
												: lang.settings.on
										}
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
