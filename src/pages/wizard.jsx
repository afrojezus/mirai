// TODO: Fix every single eslint-airbnb issue
import React, { Component } from 'react';
import localForage from 'localforage';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { blue } from 'material-ui/colors'
import { firebaseConnect, firebase } from 'react-redux-firebase';

import { TitleHeader, Header, Root, Container } from '../components/layouts';
import Typography from 'material-ui/Typography/Typography';
import Divider from 'material-ui/Divider/Divider';
import Button from 'material-ui/Button/Button';
import * as Icon from 'material-ui-icons';
import Avatar from 'material-ui/Avatar/Avatar';
import TextField from 'material-ui/TextField/TextField';

const styles = theme => ({
	column: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
	},
	fabDone: {
		position: 'fixed',
		bottom: theme.spacing.unit * 3,
		right: theme.spacing.unit * 3,
	},
	dropzone: {
		height: 256,
		width: 256,
		position: 'relative',
		borderRadius: '50%',
		margin: 'auto',
		'&:hover': {
			background: 'rgba(255,255,255,.3)',
		},
		zIndex: 1000,
		border: '2px solid white',
	},
	ava: {
		height: '100%',
		width: '100%',
		position: 'absolute',
		top: 0,
		left: 0,
		objectFit: 'cover',
	},
});

class Wizard extends Component {
	state = {
		data: {},
		user: '',
		ava: null,
		avaLoading: false,
	};
	componentDidMount = () => {};

	handleAva = accept =>
		accept.forEach(file => this.setState({ ava: file }, () => {}));

	changeAva = async () => {
		const ava = this.props.firebase
			.storage()
			.ref('userData')
			.child('avatar')
			.child(this.state.ava.name)
			.put(this.state.ava);

		return ava.on(
			'state_changed',
			() => {},
			error => console.error(error),
			() => {
				// console.log(ava);
				return this.props.firebase
					.updateProfile({
						avatar: ava.snapshot.downloadURL,
					})
					.then(() => {
						console.info('Avatar updated.');
						return this.setState({ avaLoading: false, ava: null });
					});
			}
		);
	};

	changeUsername = async () =>
		this.props.firebase
			.updateProfile({
				username: this.state.user,
			})
			.then(() => {});

	continue = () => {
		if (this.state.ava && this.state.user) {
			return this.changeAva().then(() =>
				this.changeUsername().then(() =>
					this.props.history.push('/', { firstTime: true })
				)
			);
		} else if (this.state.ava && !this.state.user) {
			return this.changeAva().then(() =>
				this.props.history.push('/', { firstTime: true })
			);
		} else if (this.state.user && !this.state.ava) {
			return this.changeUsername().then(() =>
				this.props.history.push('/', { firstTime: true })
			);
		} else {
			return this.props.history.push('/', { firstTime: true });
		}
	};

	render() {
		const { classes, theme } = this.props;
		return (
			<div>
				<Header color="#0f20aa" />
				<TitleHeader
					title="Welcome to the Mirai Preview Program"
					subtitle="Wizard"
					color={blue.A200}
				/>
				<Root>
					<Container hasHeader>
						<div className={classes.column}>
							<Typography
								variant="title"
								style={{ marginBottom: theme.spacing.unit * 2 }}
							>
								Before you get started
							</Typography>
							<Typography variant="body1">
								Check with the terms of usage on the left side of the app. Mirai
								is currently in a work-in-progress phase and a lot of changes is
								expected to occur; feedback is greatly appreciated.<br />
								Once that's done, you are ready to dive in. You may want to
								change your username and avatar beforehand as well, those
								options are listen below.<br />
								<br />If you need any help or got more questions, a FAQ is added
								in the Help section of the app, which is also avaliable on the
								left side of the app.
							</Typography>
							<Divider style={{ margin: '16px 0' }} />
							<Typography
								variant="title"
								style={{ marginBottom: theme.spacing.unit * 2 }}
							>
								Pick an username
							</Typography>
							<Typography variant="body1">It can be anything!</Typography>
							<TextField
								value={this.state.user}
								onChange={e => this.setState({ user: e.target.value })}
								placeholder={this.props.profile.username}
								helperText="Change your username to something quite
							rememberable... this is your display name afterall!"
								fullWidth
								margin="normal"
							/>
							<Divider style={{ margin: '16px 0' }} />
							<Typography
								variant="title"
								style={{ marginBottom: theme.spacing.unit * 2 }}
							>
								Pick an avatar
							</Typography>
							<Typography variant="body1" style={{ marginBottom: 16 }}>
								Pick a suitable avatar to go along with your username, remember,
								this is what people are going to recognize you by!
							</Typography>
							<Dropzone
								className={classes.dropzone}
								multiple={false}
								onDrop={this.handleAva}
							>
								<Avatar
									classes={{ img: classes.avaImg }}
									className={classes.ava}
									src={this.state.ava ? this.state.ava.preview : null}
								/>
							</Dropzone>
						</div>
					</Container>
				</Root>
				<Button
					onClick={this.continue}
					className={classes.fabDone}
					color="primary"
					variant="fab"
				>
					<Icon.Check />
				</Button>
			</div>
		);
	}
}

export default firebaseConnect()(
	connect(({ firebase: { auth, profile } }) => ({ auth, profile }))(
		withStyles(styles, { withTheme: true })(Wizard)
	)
);
