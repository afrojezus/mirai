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
import { firebaseConnect, isEmpty } from 'react-redux-firebase';
import hsfetcher from '../torrent';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import Button from 'material-ui/Button/Button';
import IconButton from 'material-ui/IconButton/IconButton';
import Typography from 'material-ui/Typography/Typography';
import Divider from 'material-ui/Divider/Divider';
import Card from 'material-ui/Card/Card';
import CardContent from 'material-ui/Card/CardContent';
import LinearProgress from 'material-ui/Progress/LinearProgress';
import CardActions from 'material-ui/Card/CardActions';
import Menu from 'material-ui/Menu/Menu';
import CardHeader from 'material-ui/Card/CardHeader';
import grey from 'material-ui/colors/grey';
import MenuItem from 'material-ui/Menu/MenuItem';
import Tooltip from 'material-ui/Tooltip/Tooltip';
import FormGroup from 'material-ui/Form/FormGroup';
import FormControlLabel from 'material-ui/Form/FormControlLabel';
import Switch from 'material-ui/Switch/Switch';
import TextField from 'material-ui/TextField/TextField'
import withStyles from 'material-ui/styles/withStyles';
import blue from "material-ui/colors/blue";
import { getState, loadEp, loadFile } from "../utils/mirfetch";

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
		background: window.safari ? 'rgba(0,0,0,.2)' : grey[800],
		boxShadow: '0 2px 32px rgba(0,0,0,.3)',
		transition: theme.transitions.create(['all']),
		backdropFilter: 'blur(10px)'
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
		backgroundColor: grey[900],
	},
	progressBgOver: {
		backgroundColor: 'transparent',
	},
	progressBar: {
		transition: 'none',
	},
	progressBarLoaded: {
		transition: 'none',
		backgroundColor: grey[700],
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
		color: blue.A200,
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
	menuPaper: {
		outline: 'none'
	}
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
		torrent: false,
		quality: 480,
		torrentFile: null,
		quaEl: null
	};

	player = HTMLMediaElement;

	componentWillMount = async () => {
		const playerVolume = await localForage.getItem('player-settings-volume');
		const playerUseTorrent = await localForage.getItem('player-setting-torrent');

		if (playerVolume) this.setState({ volume: playerVolume });
		else return;

        /*if (playerUseTorrent) this.setState({ torrent: playerUseTorrent });
        else return;*/
	}

	getState = async () => {
		const id = queryString.parse(this.props.history.location.search);
		try {
			if (this.state.torrent) {
				if (this.props.history.location.state) {
					console.info('Nyaa mode, found location state.');
					this.setState({ status: 'Setting up...' });
					this.getTorrent(this.props.history.location.state)
				} else {
					console.info('Nyaa mode, location state not found. Requesting metadata...');
					this.setState({ status: 'Fetching...' });
					const { data } = await new Segoku().getSingle({ id: id.w });
					if (data)
						this.getTorrent({ meta: data.Media });
					else this.componentDidMount();
				}
			}
			else {
				if (this.props.history.location.state) {
					console.info('Location state found! No need for refetching.');
					this.setState({ status: 'Setting up...' });
					this.getSource(this.props.history.location.state);
				} else {
					console.info('Location state not found! Refetching...');
					this.setState({ status: 'Fetching...' });
					const { data } = await new Segoku().getSingle({ id: id.w });
					if (data)
						this.getSource({ meta: data.Media });
				}
			}
		} catch (error) {
			console.error(error);
			this.setState({
				error: true,
				status: 'Error 1: Failed to fetch metadata',
			});
		}
	};

	getTorrent = (data) => this.setState({
		title: data.meta.title.english
			? data.meta.title.english
			: data.meta.title.romaji,
		showId: data.meta.id,
		showArtwork: data.meta.coverImage.large,
		showDesc: data.meta.description,
		showHeaders: data.meta.bannerImage
			? data.meta.bannerImage
			: data.meta.coverImage.large,
	}, async () => {
		const list = await hsfetcher.getList(data.meta.title.romaji);
		try {
			if (list) {
				let eps = [];
				list.filter(e => e.quality === this.state.quality).reverse().forEach((s, i) => {
					return eps.push({
						name: s.title,
						link: s.torrent,
						ep: i + 1,
						provider: 'Nyaa'
					})
				});
				this.setState({ eps, status: 'Initiating client...' }, async () => this.loadEp(this.state.eps[0], null))
			} else return new Error('fuck');
		} catch (error) {
			console.error(error)
		}
	});

	componentWillReceiveProps = async (nextProps) => {
		if (this.props !== nextProps) {
			this.getState();
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
		const meta = Object.values(this.props.mir.twist).filter(s =>
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
								!isEmpty(this.props.profile) &&
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
									!isEmpty(this.props.profile) &&
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
				if (document.getElementById('player'))
					document.getElementById('player').style.opacity = 1;
				if (this.state.menuEl) {
					this.closeMenu();
				}
				if (this.state.torrent) {
					hsfetcher.getSource(ep.link, (torrent, file) => {
						file.getBlobURL(function (err, url) {
							if (err) throw err;
							if (url)
								this.setState({ torrentFile: torrent, source: url, ep: ep.ep, resume: resume ? resume : null }, () => this.playPause())
						})
					})
				}
				else {
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
			}
		);

	closeMenu = () => this.setState({ menuEl: null });

	onProgress = state => {
		let play = this.state.played;
		if (!this.state.seeking)
			this.setState(state, async () => {
				this.setState({
					videoQuality: this.player.getInternalPlayer().videoHeight,
				});
				switch (this.player.getInternalPlayer().networkState) {
					case 0:
						console.log('EMPTY');
						this.setState({ buffering: true });
						break;
					case 1:
						console.log('IDLE');
						this.setState({ buffering: false });
						break;
					case 2:
						console.log('LOADING');
						this.setState({ buffering: false });
					case 3:
						console.log('NO_SOURCE');
						if (play !== state.played)
							this.setState(({ buffering: true }));
						break;
				}

				if (this.state.resume) {
					let resume = this.state.resume;
					this.setState({ resume: null, buffering: true }, () => {
						this.player.seekTo(resume);
						if (resume === this.state.played)
							this.setState({ buffering: false })
					});
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
		this.setState({ buffering: true, status: 'Buffering...' }, () => { });
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
		if (!isEmpty(this.props.profile) && this.state.loaded > 0) {
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

		if (this.state.torrent && this.state.torrentFile) hsfetcher.destroyClient(this.state.torrentFile);
	};

	handleEnded = () => {
		this.reveal();
		if (!isEmpty(this.props.profile) && this.state.loaded > 0) {
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

		if (document.getElementById('player'))
			document.getElementById('player').style.opacity = .2;

		if (this.state.eps.length < this.state.ep) {
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

	changeQuality = (int) => {
		switch (int) {
			case 1080:
				if (this.state.torrentFile)
					hsfetcher.destroyClient(this.state.torrentFile);
				this.setState({
					source: null, playing: false, quality: 1080, quaEl: null,
					buffering: true,
					status: 'Downloading...',
					loaded: 0,
					played: 0,
					videoQuality: null,
				}, () => this.getState());
			case 720:
				if (this.state.torrentFile)
					hsfetcher.destroyClient(this.state.torrentFile);
				this.setState({
					source: null, playing: false, quality: 720, quaEl: null,
					buffering: true,
					status: 'Downloading...',
					loaded: 0,
					played: 0,
					videoQuality: null,
				}, () => this.getState());
			case 480:
				if (this.state.torrentFile)
					hsfetcher.destroyClient(this.state.torrentFile);
				this.setState({
					source: null, playing: false, quality: 480, quaEl: null,
					buffering: true,
					status: 'Downloading...',
					loaded: 0,
					played: 0,
					videoQuality: null,
				}, () => this.getState())
		}
	};


	switchMode = () => this.setState({ torrent: !this.state.torrent }, async () => {
		let torrent = this.state.torrent;
		if (torrent) {
			await localForage.setItem('player-setting-torrent', true);
			if (this.state.torrentFile)
				hsfetcher.destroyClient(this.state.torrentFile);
			this.setState({
				source: null, playing: false,
				buffering: true,
				status: 'Downloading...',
				loaded: 0,
				played: 0,
				videoQuality: null,
			}, () => this.getState())
		} else {
			await localForage.setItem('player-setting-torrent', false);
			if (this.state.torrentFile)
				hsfetcher.destroyClient(this.state.torrentFile);
			this.setState({
				playing: false,
				source: null,
				buffering: true,
				status: 'Loading...',
				loaded: 0,
				played: 0,
				videoQuality: null,
			}, () => this.getState())
		}
	});

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
			torrent,
			quaEl,
			quality
		} = this.state;
		const menu = Boolean(menuEl);
		const volumeMenu = Boolean(volEl);
		const qualityMenu = Boolean(quaEl);
		return (
			<div
				id="frame"
				className={classes.root}
				onMouseLeave={played === 1 ? null : this.hide}
				onMouseMove={this.reveal}
				onTouchMove={this.reveal}
			>
				<CircularProgress
					className={classes.loading}
					style={!buffering ? { opacity: 0 } : null}
				/>
				<Toolbar id="backbutton" className={classes.backToolbar}>
					<IconButton
						style={{
							marginLeft: -12,
							marginRight: 20,
						}}
						onClick={() => this.props.history.goBack()}
					>
						<Icon.ArrowBack />
					</IconButton>
					{!playing && !source ? (
						<Typography type="title">{title}</Typography>
					) : null}
				</Toolbar>
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
								<Typography type="display2" className={classes.showInfoTitle}>
									{title}
								</Typography>
								<Divider />
								<Typography
									type="body1"
									className={classes.showInfoDesc}
									dangerouslySetInnerHTML={{ __html: showDesc }}
								/>
							</div>
						</div>
					</FadeIn>
				) : null}
				<Card id="controls" className={classes.controlpanel}>
					<CardContent className={classes.indicator}>
						<LinearProgress
							classes={{
								root: classes.progress,
								primaryColor: classes.progressBgOver,
								primaryColorBar: classes.progressBar,
							}}
							mode={'determinate'}
							value={played * 100}
							valueBuffer={loaded * 100}
						/>
						<LinearProgress
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
					</CardContent>
					<CardActions>

						<IconButton disabled={loaded === 0 || !source ? (
							true
						) : false} onClick={this.playPause}>
							{playing ? (
								<Icon.Pause />

							) : played === 1 ? (
								<Icon.Replay />
							) : (
										<Icon.PlayArrow />
									)}
						</IconButton>
						<Typography
							type="title"
							className={!source ? classes.left : null}
						>
							{status}
						</Typography>
						<div style={{ flex: 1 }} />
						{willLoadNextEp ? (
							<div className={classes.nextWrapper}>
								<Button
									onClick={this.skipToNextEp}
									className={classes.nextButton}
								>
									Loading next episode in 5 seconds...
								</Button>
							</div>
						) : null}
						<IconButton
							disabled={torrent ? false : true}
							aria-owns={qualityMenu ? 'quality-menu' : null}
							aria-haspopup="true"
							onClick={e => this.setState({ quaEl: e.currentTarget })}
							color="contrast"
						>
							{torrent ? quality === 480 ? <Typography type="title" className={classes.qualityTitle}>480p</Typography> :
								quality === 720 ? <Typography type="title" className={classes.qualityTitle}>720p</Typography> :
									quality === 1080 ? <Typography type="title" className={classes.qualityTitle}>1080p</Typography> : null : <Typography type="title" style={torrent ? null : { opacity: '.2' }} className={classes.qualityTitle}>
									{videoQuality ? videoQuality + 'p' : 'HD'}
								</Typography>}
						</IconButton>
						<Typography type="body1" className={classes.duration}>
							<Duration seconds={duration * played} />
						</Typography>
						<Menu
							id="quality-menu"
							anchorEl={quaEl}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							transformOrigin={{
								vertical: 'center',
								horizontal: 'right',
							}}
							open={qualityMenu}
							classes={{
								paper: classes.menuPaper
							}}
							onClose={() => this.setState({ quaEl: null })}
							PaperProps={{
								style: {
									width: 300,
									padding: 0,
									outline: 'none',
									background: grey[800],
								},
							}}
							MenuListProps={{
								style: {
									padding: 0,
									outline: 'none',
								},
							}}
						>
							<Card style={{ background: grey[800] }}>
								<CardHeader
									style={{ background: grey[900] }}
									title="Quality"
								/>
								<Divider />
								<CardContent className={classes.epListCont}>
									<MenuItem
										onClick={() => this.changeQuality(1080)}
										selected={quality === 1080}
										className={classes.epListItem}
									>
										1080p
                                            <div style={{ flex: 1 }} />
										{quality === 1080 ? <Icon.PlayArrow /> : null}
									</MenuItem>
									<MenuItem
										onClick={() => this.changeQuality(720)}
										selected={quality === 720}
										className={classes.epListItem}
									>
										720p
                                        <div style={{ flex: 1 }} />
										{quality === 720 ? <Icon.PlayArrow /> : null}
									</MenuItem>
									<MenuItem
										onClick={() => this.changeQuality(480)}
										selected={quality === 480}
										className={classes.epListItem}
									>
										480p
                                        <div style={{ flex: 1 }} />
										{quality === 480 ? <Icon.PlayArrow /> : null}
									</MenuItem>
								</CardContent>
							</Card>
						</Menu>
						<IconButton
							aria-owns={volumeMenu ? 'volume-menu' : null}
							aria-haspopup="true"
							onClick={e => this.setState({ volEl: e.currentTarget })}
							color="contrast"
						>
							{volume > 0 ? <Icon.VolumeUp /> : <Icon.VolumeOff />}
						</IconButton>
						<Menu
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
									background: grey[800],
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
						</Menu>
						<IconButton
							disabled={
								loaded === 0
									? eps.length > 0
										? eps.length < ep ? true : false
										: true
									: false
							}
							onClick={this.skipToNextEp}
						>
							<Icon.SkipNext />
						</IconButton>
						<IconButton
							disabled={loaded === 0 ? true : false}
							onClick={this.skip30Sec}
						>
							<Icon.Forward30 />
						</IconButton>
						<IconButton onClick={this.handleFullscreen}>
							{fullscreen ? <Icon.FullscreenExit /> : <Icon.Fullscreen />}
						</IconButton>
						<div>
							<IconButton
								disabled={eps.length > 0 ? false : true}
								aria-owns={menu ? 'ep-menu' : null}
								aria-haspopup="true"
								onClick={e => this.setState({ menuEl: e.currentTarget })}
								color="contrast"
							>
								<Icon.ViewList />
							</IconButton>
							<Menu
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
								classes={{
									paper: classes.menuPaper
								}}
								onClose={this.closeMenu}
								PaperProps={{
									style: {
										width: 300,
										padding: 0,
										outline: 'none',
										background: grey[800],
									},
								}}
								MenuListProps={{
									style: {
										padding: 0,
										outline: 'none',
									},
								}}
							>
								<Card style={{ background: grey[800] }}>
									<CardHeader
										style={{ background: grey[900] }}
										title="Episodes"
									/>
									<Divider />
									<CardContent className={classes.epListCont}>
										{eps &&
											eps.map((e, i) => (
												<MenuItem
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
												</MenuItem>
											))}
									</CardContent>
								</Card>
							</Menu>
						</div>
						<Tooltip PopperProps={{ PaperProps: { style: { fontSize: 16 } } }} title='Switch between Twist mode (recommended) or Nyaa mode (highly experimental)'>
							<FormGroup>
								<FormControlLabel
									disabled
									control={
										<Switch
											checked={torrent}
											onChange={this.switchMode}
										/>
									}
									label={torrent ? "Nyaa" : "Twist"}
								/>
							</FormGroup>
						</Tooltip>
					</CardActions>
				</Card>
			</div>
		);
	}
}

export default firebaseConnect()(
	connect(({ firebase: { profile }, mir }) => ({ profile, mir }))(
		withStyles(style)(Watch)
	)
);
