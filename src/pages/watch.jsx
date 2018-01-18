import React, { Component } from 'react';
import * as M from 'material-ui';
import * as Icon from 'material-ui-icons';
import { Database } from '../utils/firebase';
import Aqua3 from '../assets/aqua3.gif';
import Duration from '../components/yuplayer/Duration';
import ReactPlayer from 'react-player';
import Twist from '../twist-api';
import Segoku from '../utils/segoku/segoku';
import localForage from 'localforage';
import queryString from 'query-string';
import corrector from '../utils/bigfuck';
import FadeIn from 'react-fade-in';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

const style = theme => ({
	root: {
		height: '100vh',
		width: '100%',
		position: 'relative',
		top: 0,
		left: 0,
		overflow: 'hidden',
	},
	player: {
		height: '100%',
		width: '100%',
		position: 'absolute',
		top: 0,
		left: 0,
		background: 'black',
		transition: theme.transitions.create(['all']),
	},
	controlpanel: {
		position: 'fixed',
		bottom: theme.spacing.unit * 6,
		width: 'calc(100% - 128px)',
		marginLeft: 64,
		marginRight: 64,
		background: M.colors.grey[800],
		boxShadow: '0 2px 32px rgba(0,0,0,.3)',
		transition: theme.transitions.create(['all']),
	},
	backToolbar: {
		zIndex: 10,
		transition: theme.transitions.create(['all']),
	},
	indicator: {
		flexDirection: 'row',
		padding: 0,
		display: 'flex',
		position: 'relative',
	},
	progress: {
		flex: 1,
	},
	progressLoaded: {
		zIndex: -1,
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
	},
	progressBg: {
		backgroundColor: M.colors.grey[900],
	},
	progressBgOver: {
		backgroundColor: 'transparent',
	},
	progressBar: {
		transition: 'none',
	},
	progressBarLoaded: {
		transition: 'none',
		backgroundColor: M.colors.grey[700],
	},
	duration: {
		padding: theme.spacing.unit,
		fontFamily: 'SF Mono',
	},
	left: {
		padding: theme.spacing.unit,
	},
	epListCont: {
		maxHeight: 300,
		overflowY: 'scroll',
		padding: 0,
	},
	epListItem: {},
	volumeSlider: {
		paddingLeft: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		outline: 'none',
	},
	progressInput: {
		background: 'transparent',
		position: 'absolute',
		margin: '-5px 0',
		width: '100%',
		'-webkit-appearance': 'none',
		outline: 'none',
		transition: theme.transitions.create(['all']),
		opacity: 0,
		'&:hover': {
			opacity: 1,
		},
	},
	loading: {
		height: '100%',
		width: '100%',
		zIndex: 1000,
		position: 'fixed',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%,-50%)',
		padding: 0,
		margin: 'auto',
		transition: theme.transitions.create(['all']),
	},
	showInfo: {
		margin: 'auto',
		width: '100%',
		padding: theme.spacing.unit * 8,
		display: 'flex',
		zIndex: 500,
		boxSizing: 'border-box',
	},
	showInfoColumn: {
		display: 'flex',
		flexDirection: 'column',
		margin: 8,
	},
	showInfoTitle: {
		fontWeight: 700,
		padding: theme.spacing.unit,
		paddingLeft: 0,
		color: 'white',
	},
	showInfoDesc: {
		paddingTop: theme.spacing.unit * 2,
		fontSize: 16,
	},
	showInfoArtwork: {
		width: 300,
		objectFit: 'cover',
		boxShadow: '0 2px 16px rgba(0,0,0,.2)',
	},
	nextButton: {},
	nextButtonWrapper: {
		margin: theme.spacing.unit,
		position: 'relative',
	},
	nextButtonProgress: {
		color: M.colors.blue.A200,
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12,
	},
	qualityTitle: {
		border: '2px solid white',
		borderRadius: 2,
		padding: theme.spacing.unit / 2,
		boxSizing: 'border-box',
		fontSize: 14,
		fontWeight: 500,
	},
});

class Watch extends Component {
	state = {
		playing: false,
		buffering: true,
		source: '',
		duration: 0,
		volume: 0.5,
		status: '',
		title: '',
		fullscreen: false,
		played: 0,
		loaded: 0,
		seeking: false,
		menu: false,
		rate: null,
		ep: 0,
		eps: [],
		error: false,
		menuEl: null,
		showId: 0,
		recentlyWatched: Date.now(),
		volEl: null,
		counter: 5,
	};

	player = HTMLMediaElement;

	componentWillMount = async () => {
		const playerVolume = await localForage.getItem('player-settings-volume');

		if (playerVolume) this.setState({ volume: playerVolume });
		else return;
	};

	componentDidMount = async () => {
		const id = queryString.parse(this.props.history.location.search);
		try {
			if (this.props.history.location.state) {
				console.info('Location state found! No need for refetching.');
				this.setState({ status: 'Setting up...' });
				if (this.props.mir && this.props.mir.twist)
					this.getSource(this.props.history.location.state);
			} else {
				console.info('Location state not found! Refetching...');
				this.setState({ status: 'Fetching...' });
				const { data } = await new Segoku().getSingle({ id: id.w });
				if (data && this.props.mir && this.props.mir.twist)
					this.getSource({ meta: data.Media });
				else this.componentDidMount();
			}
		} catch (error) {
			console.error(error);
			this.setState({
				error: true,
				status: 'Error 1: Failed to fetch metadata',
			});
		}
	};

	getSource = async data => {
		this.setState({
			title: data.meta.title.english
				? data.meta.title.english
				: data.meta.title.romaji,
			showId: data.meta.id,
			showArtwork: data.meta.coverImage.large,
			showDesc: data.meta.description,
			showHeaders: data.meta.bannerImage
				? data.meta.bannerImage
				: data.meta.coverImage.large,
		});
		let correctedtitle = data.meta.title.romaji.toLowerCase();
		const meta = this.props.mir.twist.filter(s =>
			s.name.toLowerCase().match(`${correctedtitle}`)
		);
		try {
			if (data.eps) {
				console.log(data.eps);
				console.info('Episodes found from cache!');
				this.setState({ eps: data.eps, status: 'Loading...' }, async () => {
					localForage
						.getItem('player-state')
						.then(a => {
							if (a.showId === this.state.showId) {
								console.info('Metadata found.');
								this.loadEp(this.state.eps[a.ep - 1], a.played);
							} else throw new Error('');
						})
						.catch(async a => {
							if (
								this.props.profile &&
								this.props.profile.episodeProgress[this.state.showId]
							) {
								console.info('No metadata found locally, attempting remote.');
								this.loadEp(
									this.state.eps[
										this.props.profile.episodeProgress[this.state.showId].ep - 1
									],
									this.props.profile.episodeProgress[this.state.showId].played
								);
							} else {
								console.info(
									'No metadata found locally and remotely, starting new session.'
								);
								this.loadEp(this.state.eps[0], null);
							}
						});
				});
			} else if (meta && meta[0].link) {
				console.info('Episodes not found from cache! Scratching...');
				const eps = await Twist.get(meta[0].link);
				if (eps) {
					console.log(eps);

					this.setState({ eps, status: 'Loading...' }, async () => {
						localForage
							.getItem('player-state')
							.then(a => {
								if (a.showId === this.state.showId) {
									console.info('Metadata found.');
									this.loadEp(this.state.eps[a.ep - 1], a.played);
								} else throw new Error('');
							})
							.catch(async a => {
								if (
									this.props.profile &&
									this.props.profile.episodeProgress[this.state.showId]
								) {
									console.info('No metadata found locally, attempting remote.');
									this.loadEp(
										this.state.eps[
											this.props.profile.episodeProgress[this.state.showId].ep -
												1
										],
										this.props.profile.episodeProgress[this.state.showId].played
									);
								} else {
									console.info(
										'No metadata found locally and remotely, starting new session.'
									);
									this.loadEp(this.state.eps[0], null);
								}
							});
					});
				}
			} else {
				throw new Error('Failed to load videodata.');
			}
		} catch (error) {
			console.error(error);
			this.setState({
				error: true,
				status: 'Error 2: Failed to load videodata.',
			});
		}
	};

	loadEp = (ep, resume) =>
		this.setState(
			{
				playing: false,
				source: null,
				buffering: true,
				status: 'Loading...',
				loaded: 0,
				played: 0,
				videoQuality: null,
			},
			async () => {
				if (this.state.menuEl) {
					this.closeMenu();
				}
				const source = await Twist.getSource(ep.link);
				try {
					if (source) {
						this.setState(
							{ source, ep: ep.ep, resume: resume ? resume : null },
							() => {
								this.playPause();
							}
						);
					}
				} catch (error) {
					console.error(error);
					this.setState({ error: true, status: 'Error' });
				}
			}
		);

	closeMenu = () => this.setState({ menuEl: null });

	onProgress = state => {
		const seekableEnd = this.player
			.getInternalPlayer()
			.seekable.end(this.player.getInternalPlayer().seekable.length - 1);

		if (!seekableEnd) this.setState({ buffering: true });
		else this.setState({ buffering: false });

		if (!this.state.seeking)
			this.setState(state, async () => {
				this.setState({
					videoQuality: this.player.getInternalPlayer().videoHeight,
				});

				if (this.state.resume) {
					let resume = this.state.resume;
					this.setState({ resume: null }, () => this.player.seekTo(resume));
				}
				if (!this.state.menuEl && !this.state.volEl)
					await localForage.setItem('player-state', this.state);
			});
	};

	playPause = resume => {
		this.setState({ playing: !this.state.playing });
		if (this.timer && this.timer !== undefined) clearInterval(this.timer);
	};

	/*stop = () => {
        this.setState({ source: null, playing: false });
      };*/

	setVolume = e => {
		this.setState({ volume: parseFloat(e.target.value) }, async () => {
			await localForage.setItem('player-settings-volume', this.state.volume);
		});
	};

	mute = e => {
		let prevVol = this.state.volume;
		if (this.state.volume > 0) {
			this.setState({ volume: 0 });
		} else {
			this.setState({ volume: prevVol });
		}
	};

	setPlaybackRate = e => {
		this.setState({ playbackRate: parseFloat(e.target.value) });
	};

	onSeekMouseDown = e => {
		this.setState({ seeking: true });
	};

	onSeekChange = e => {
		this.setState({ played: parseFloat(e.target.value) });
	};

	onSeekMouseUp = e => {
		this.setState({ seeking: false, buffering: true });
		this.player.seekTo(parseFloat(e.target.value));
	};

	skip30Sec = () => {
		this.player.seekTo(this.state.played + 18 / 1000, null);
	};

	skipToNextEp = () => {
		let nextEp = this.state.ep;
		this.loadEp(this.state.eps[nextEp++], null);
		if (this.state.willLoadNextEp) this.setState({ willLoadNextEp: false });
	};

	onBuffer = () => {
		this.setState({ buffering: true, status: 'Buffering...' }, () => {});
	};

	inactivityTimeout;

	mouseResetDelay = () => {
		clearTimeout(this.inactivityTimeout);
		this.inactivityTimeout = setTimeout(() => {
			this.hide();
		}, 4000);
	};

	reveal = event => {
		let back = document.getElementById('backbutton');
		let controls = document.getElementById('controls');
		let player = document.getElementById('player');
		if (back && controls && player) {
			back.style.opacity = 1;
			controls.style.opacity = 1;
			player.style.cursor = 'initial';
			this.mouseResetDelay();
		}
	};

	hide = () => {
		let back = document.getElementById('backbutton');
		let controls = document.getElementById('controls');
		let player = document.getElementById('player');
		if (
			back &&
			controls &&
			player &&
			this.state.loaded > 0 &&
			this.state.played < 1
		) {
			player.style.cursor = 'none';
			back.style.opacity = 0;
			controls.style.opacity = 0;
		}
	};

	handleFullscreen = e =>
		this.setState({ fullscreen: !this.state.fullscreen }, () => {
			var docElm = document.documentElement;
			if (this.state.fullscreen) {
				if (docElm.requestFullscreen) {
					docElm.requestFullscreen();
				} else if (docElm.mozRequestFullScreen) {
					docElm.mozRequestFullScreen();
				} else if (docElm.webkitRequestFullScreen) {
					docElm.webkitRequestFullScreen();
				} else if (docElm.msRequestFullscreen) {
					docElm.msRequestFullscreen();
				}
			} else if (!this.state.fullscreen) {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			}
		});

	componentWillUnmount = async () => {
		if (this.props.profile && this.state.loaded > 0) {
			const episodePro = this.props.firebase
				.database()
				.ref('users')
				.child(`${this.props.profile.userID}`)
				.child('episodeProgress');
			localForage.getItem('player-state').then(async a => {
				if (a && a.showId) {
					episodePro.child(`${a.showId}`).update(a);
					return true;
				}
			});
		}
	};

	handleEnded = () => {
		this.reveal();
		if (this.props.profile && this.state.loaded > 0) {
			const episodePro = this.props.firebase
				.database()
				.ref('users')
				.child(`${this.props.profile.userID}`)
				.child('episodeProgress');
			localForage.getItem('player-state').then(async a => {
				if (a && a.showId) {
					episodePro.child(`${a.showId}`).update(a);
					return true;
				}
			});
		}

		if (this.state.eps.length > 1) {
			this.setState({ willLoadNextEp: true }, () => {
				this.timer = setTimeout(
					() =>
						this.setState({ willLoadNextEp: false }, () => this.skipToNextEp()),
					5000
				);
			});
		}
	};

	timer = undefined;

	render() {
		const { classes } = this.props;
		const {
			playing,
			buffering,
			source,
			duration,
			played,
			loaded,
			volume,
			rate,
			seeking,
			fullscreen,
			status,
			title,
			menuEl,
			eps,
			ep,
			showArtwork,
			showHeaders,
			showDesc,
			volEl,
			willLoadNextEp,
			counter,
			videoQuality,
		} = this.state;
		const menu = Boolean(menuEl);
		const volumeMenu = Boolean(volEl);
		return (
			<div
				id="frame"
				className={classes.root}
				onMouseLeave={played === 1 ? null : this.hide}
				onMouseMove={this.reveal}
				onTouchMove={this.reveal}
			>
				<M.CircularProgress
					className={classes.loading}
					style={!buffering ? { opacity: 0 } : null}
				/>
				<M.Toolbar id="backbutton" className={classes.backToolbar}>
					<M.IconButton
						style={{
							marginLeft: -12,
							marginRight: 20,
						}}
						onClick={() => this.props.history.goBack()}
					>
						<Icon.ArrowBack />
					</M.IconButton>
					{!playing && !source ? (
						<M.Typography type="title">{title}</M.Typography>
					) : null}
				</M.Toolbar>
				<ReactPlayer
					id="player"
					ref={player => {
						this.player = player;
					}}
					url={source}
					volume={volume}
					playing={playing}
					onProgress={this.onProgress}
					className={classes.player}
					width="100%"
					height="100%"
					onBuffer={this.onBuffer}
					onReady={() =>
						this.setState({ playing: true, buffering: false, status: title })
					}
					onPause={() => this.setState({ playing: false })}
					onEnded={this.handleEnded}
					onError={e => console.error(e)}
					onDuration={duration => this.setState({ duration })}
					style={played === 1 ? { filter: 'brightness(.2)' } : null}
				/>
				{played === 1 ? (
					<FadeIn>
						<div className={classes.showInfo}>
							<div className={classes.showInfoColumn}>
								<img
									src={showArtwork}
									alt=""
									className={classes.showInfoArtwork}
									style={{ opacity: 0 }}
									onLoad={e => (e.currentTarget.style.opacity = null)}
								/>
							</div>
							<div className={classes.showInfoColumn} style={{ flex: 1 }}>
								<M.Typography type="display2" className={classes.showInfoTitle}>
									{title}
								</M.Typography>
								<M.Divider />
								<M.Typography
									type="body1"
									className={classes.showInfoDesc}
									dangerouslySetInnerHTML={{ __html: showDesc }}
								/>
							</div>
						</div>
					</FadeIn>
				) : null}
				<M.Card id="controls" className={classes.controlpanel}>
					<M.CardContent className={classes.indicator}>
						<M.LinearProgress
							classes={{
								root: classes.progress,
								primaryColor: classes.progressBgOver,
								primaryColorBar: classes.progressBar,
							}}
							mode={buffering ? 'buffer' : 'determinate'}
							value={played * 100}
							valueBuffer={loaded * 100}
						/>
						<M.LinearProgress
							classes={{
								root: classes.progressLoaded,
								primaryColor: classes.progressBg,
								primaryColorBar: classes.progressBarLoaded,
							}}
							mode={'determinate'}
							value={loaded * 100}
						/>
						<input
							className={classes.progressInput}
							type="range"
							step="any"
							max={0.999}
							min={0}
							value={played}
							onMouseDown={this.onSeekMouseDown}
							onChange={this.onSeekChange}
							onMouseUp={this.onSeekMouseUp}
						/>
					</M.CardContent>
					<M.CardActions>
						{source ? (
							<M.IconButton onClick={this.playPause}>
								{playing ? (
									loaded === 0 || buffering ? (
										<M.CircularProgress />
									) : (
										<Icon.Pause />
									)
								) : played === 1 ? (
									<Icon.Replay />
								) : (
									<Icon.PlayArrow />
								)}
							</M.IconButton>
						) : null}
						<M.Typography
							type="title"
							className={!source ? classes.left : null}
						>
							{status}
						</M.Typography>
						{videoQuality ? (
							<M.Typography type="title" className={classes.qualityTitle}>
								{videoQuality}p
							</M.Typography>
						) : null}
						<div style={{ flex: 1 }} />
						{willLoadNextEp ? (
							<div className={classes.nextWrapper}>
								<M.Button
									onClick={this.skipToNextEp}
									className={classes.nextButton}
								>
									Loading next episode in 5 seconds...
								</M.Button>
							</div>
						) : null}
						<M.Typography type="body1" className={classes.duration}>
							<Duration seconds={duration * played} />
						</M.Typography>
						<M.IconButton
							aria-owns={volumeMenu ? 'volume-menu' : null}
							aria-haspopup="true"
							onClick={e => this.setState({ volEl: e.currentTarget })}
							color="contrast"
						>
							{volume > 0 ? <Icon.VolumeUp /> : <Icon.VolumeOff />}
						</M.IconButton>
						<M.Menu
							id="volume-menu"
							anchorEl={volEl}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							transformOrigin={{
								vertical: 'bottom',
								horizontal: 'right',
							}}
							open={volumeMenu}
							onClose={() => this.setState({ volEl: null })}
							PaperProps={{
								style: {
									outline: 'none',
									background: M.colors.grey[800],
								},
							}}
							MenuListProps={{
								style: {
									padding: 8,
									outline: 'none',
								},
							}}
						>
							<input
								step="any"
								type="range"
								className={classes.volumeSlider}
								max={1}
								min={0}
								value={volume}
								onChange={this.setVolume}
							/>
						</M.Menu>
						<M.IconButton
							disabled={
								loaded === 0
									? eps.length > 0
										? eps.length < 1 || eps.length - 1 === ep ? true : false
										: true
									: false
							}
							onClick={this.skipToNextEp}
						>
							<Icon.SkipNext />
						</M.IconButton>
						<M.IconButton
							disabled={loaded === 0 ? true : false}
							onClick={this.skip30Sec}
						>
							<Icon.Forward30 />
						</M.IconButton>
						<M.IconButton onClick={this.handleFullscreen}>
							{fullscreen ? <Icon.FullscreenExit /> : <Icon.Fullscreen />}
						</M.IconButton>
						<div>
							<M.IconButton
								disabled={eps.length > 0 ? false : true}
								aria-owns={menu ? 'ep-menu' : null}
								aria-haspopup="true"
								onClick={e => this.setState({ menuEl: e.currentTarget })}
								color="contrast"
							>
								<Icon.ViewList />
							</M.IconButton>
							<M.Menu
								id="ep-menu"
								anchorEl={menuEl}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								transformOrigin={{
									vertical: 'center',
									horizontal: 'right',
								}}
								open={menu}
								onClose={this.closeMenu}
								PaperProps={{
									style: {
										width: 300,
										padding: 0,
										outline: 'none',
										background: M.colors.grey[800],
									},
								}}
								MenuListProps={{
									style: {
										padding: 0,
										outline: 'none',
									},
								}}
							>
								<M.Card style={{ background: M.colors.grey[800] }}>
									<M.CardHeader
										style={{ background: M.colors.grey[900] }}
										title="Episodes"
									/>
									<M.Divider />
									<M.CardContent className={classes.epListCont}>
										{eps &&
											eps.map((e, i) => (
												<M.MenuItem
													onClick={() => {
														this.setState({ ep: e.ep }, async () =>
															this.loadEp(e, null)
														);
													}}
													key={i}
													selected={e.ep === ep}
													className={classes.epListItem}
												>
													Episode {e.ep}
													<div style={{ flex: 1 }} />
													{e.ep === ep ? <Icon.PlayArrow /> : null}
												</M.MenuItem>
											))}
									</M.CardContent>
								</M.Card>
							</M.Menu>
						</div>
					</M.CardActions>
				</M.Card>
			</div>
		);
	}
}

export default firebaseConnect()(
	connect(({ firebase: { profile }, mir }) => ({ profile, mir }))(
		M.withStyles(style)(Watch)
	)
);
