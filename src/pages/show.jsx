import React, { Component } from 'react';
import localForage from 'localforage';
import * as M from 'material-ui';
import * as Icon from 'material-ui-icons';
import queryString from 'query-string';
import Segoku from '../utils/segoku/segoku';
import * as Vibrant from 'node-vibrant';
import FadeIn from 'react-fade-in';

import Twist from '../twist-api';

import CardButton, { PeopleButton } from '../components/cardButton'

import { MIR_SET_TITLE } from '../constants';

import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { timeFormatter } from '../components/supertable';
import { Root, Container, CommandoBar, MainCard, Header, LoadingIndicator } from '../components/layouts';

const styles = theme => ({
	loading: {
		height: '100%',
		width: '100%',
		zIndex: 1200,
		position: 'fixed',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%,-50%)',
		padding: 0,
		margin: 'auto',
		color: 'white',
		transition: theme.transitions.create(['all']),
	},
	root: {
		paddingTop: theme.spacing.unit * 8,
		transition: theme.transitions.create(['all']),
		animation: 'load .3s ease',
		marginLeft: 'auto',
		marginRight: 'auto',
		maxWidth: 1600,
	},
	backToolbar: {
		marginTop: theme.spacing.unit * 8,
	},
	bigBar: {
		width: '100%',
		height: 'auto',
		boxShadow: '0 2px 24px rgba(0,0,0,.2)',
		background: '#111',
		marginTop: theme.spacing.unit * 8,
		position: 'relative',
		overflow: 'hidden',
		paddingBottom: theme.spacing.unit * 4,
		marginBottom: theme.spacing.unit * 8,
		transition: theme.transitions.create(['all']),
	},
	glassEffect: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		opacity: 0.4,
		height: '100vh',
		objectFit: 'cover',
		width: '100%',
		transform: 'scale(20)',
	},
	rootInactive: {
		opacity: 0,
		pointerEvents: 'none',
		transition: theme.transitions.create(['all']),
	},
	container: {
		padding: theme.spacing.unit * 3,
		boxSizing: 'border-box',
		[theme.breakpoints.down('sm')]: {
			flexDirection: 'column',
		},
	},
	frame: {
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
		opacity: 0.6,
		height: '100vh',
		objectFit: 'cover',
		width: '100%',
		zIndex: -1,
		overflow: 'hidden',
		filter: 'brightness(.3)',
		transition: theme.transitions.create(['all']),
	},
	grDImage: {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		opacity: 1,
		height: '100vh',
		width: '100%',
		zIndex: -1,
		overflow: 'hidden',
		transition: theme.transitions.create(['all']),
	},
	mainFrame: {
		marginLeft: 24,
		[theme.breakpoints.down('sm')]: {
			marginLeft: 0,
			paddingTop: `${theme.spacing.unit * 8}px !important`,
		},
	},
	bigTitle: {
		fontWeight: 700,
		color: 'white',
		textShadow: '0 2px 12px rgba(0,0,0,.2)',
	},
	smallTitle: {
		fontWeight: 600,
		color: 'white',
		fontSize: 16,
		textShadow: '0 2px 12px rgba(0,0,0,.17)',
	},
	tagBox: {
		marginTop: theme.spacing.unit,
	},
	tagTitle: {
		fontSize: 16,
		fontWeight: 600,
		color: 'white',
		textShadow: '0 2px 12px rgba(0,0,0,.17)',
		marginBottom: theme.spacing.unit,
	},
	desc: {
		marginTop: theme.spacing.unit,
		color: 'white',
		textShadow: '0 0 12px rgba(0,0,0,.1)',
		marginBottom: theme.spacing.unit,
	},
	boldD: {
		marginTop: theme.spacing.unit,
		color: 'white',
		textShadow: '0 0 12px rgba(0,0,0,.1)',
		marginBottom: theme.spacing.unit,
		fontWeight: 600,
	},
	smallD: {
		marginLeft: theme.spacing.unit,
		marginTop: theme.spacing.unit,
		color: 'white',
		textShadow: '0 0 12px rgba(0,0,0,.1)',
		marginBottom: theme.spacing.unit,
	},
	sepD: {
		display: 'flex',
		marginLeft: theme.spacing.unit,
	},
	artworkimg: {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
		background: 'white',
		transition: theme.transitions.create(['all']),
	},
	artwork: {
		maxWidth: 300,
		height: 400,
		margin: 'auto',
		boxShadow: '0 3px 18px rgba(0,0,0,.5)',
		transition: theme.transitions.create(['all']),
		position: 'relative',
		'&:hover': {
			overflow: 'initial',
			boxShadow: `0 2px 14px rgba(0,0,0,.3)`,
			background: M.colors.blue.A200,
		},
		'&:hover > .artworktitle': {
			transform: 'scale(1.2)',
		},
		'&:hover > img': {
			transform: 'scale(0.9)',
			filter: 'brightness(0.9)',
		},
		'&:active': {
			opacity: 0.7,
		},
		zIndex: 500,
	},
	artworkDisabled: {
		maxWidth: 300,
		height: 400,
		margin: 'auto',
		boxShadow: '0 3px 18px rgba(0,0,0,.5)',
		transition: theme.transitions.create(['all']),
		position: 'relative',
		'& > img': {
			opacity: 0.7,
		},
		zIndex: 500,
	},
	genreRow: {
		display: 'flex',
	},
	tagChip: {
		margin: theme.spacing.unit / 2,
		background: 'white',
		color: '#111',
		boxShadow: '0 2px 12px rgba(0,0,0,.17)',
	},
	secTitle: {
		padding: theme.spacing.unit,
		fontWeight: 700,
		fontSize: 22,
		zIndex: 'inherit',
		paddingBottom: theme.spacing.unit * 2,
	},
	fillImg: {
		height: '100%',
		width: '100%',
		objectFit: 'cover',
		background: 'white',
		transition: theme.transitions.create(['all']),
	},
	peopleCard: {
		height: 'auto',
		width: 183,
		flexGrow: 'initial',
		flexBasis: 'initial',
		margin: theme.spacing.unit / 2,
		transition: theme.transitions.create(['all']),
		'&:hover': {
			transform: 'scale(1.05)',
			overflow: 'initial',
			zIndex: 200,
			boxShadow: `0 2px 14px rgba(0,55,230,.3)`,
			background: M.colors.blue.A200,
		},
		'&:hover > * > h1': {
			transform: 'scale(1.1)',
			textShadow: '0 2px 12px rgba(0,0,0,.7)',
		},
		position: 'relative',
		overflow: 'hidden',
	},
	peopleImage: {
		height: 156,
		width: 156,
		margin: 'auto',
		zIndex: 1,
		borderRadius: '50%',
		boxShadow: '0 2px 12px rgba(0,0,0,.2)',
		transition: theme.transitions.create(['all']),
		'&:hover': {
			boxShadow: '0 3px 16px rgba(0,0,0,.5)',
		},
		top: 0,
		left: 0,
	},
	peopleCharImage: {
		height: 64,
		width: 64,
		margin: 'auto',
		zIndex: 2,
		position: 'absolute',
		borderRadius: '50%',
		boxShadow: '0 2px 12px rgba(0,0,0,.2)',
		transition: theme.transitions.create(['all']),
		'&:hover': {
			boxShadow: '0 3px 16px rgba(0,0,0,.5)',
			transform: 'scale(1.2)',
		},
		right: theme.spacing.unit * 3,
		bottom: theme.spacing.unit * 7,
	},
	entityContext: {
		'&:last-child': {
			paddingBottom: 12,
		},
	},
	peopleTitle: {
		fontSize: 14,
		fontWeight: 500,
		padding: theme.spacing.unit,
		paddingBottom: theme.spacing.unit / 2,
		transition: theme.transitions.create(['transform']),
		bottom: 0,
		zIndex: 5,
		margin: 'auto',
		textAlign: 'center',
		textShadow: '0 1px 12px rgba(0,0,0,.2)',
	},
	peopleSubTitle: {
		fontSize: 14,
		color: 'rgba(255,255,255,.7)',
		fontWeight: 600,
		margin: 'auto',
		transition: theme.transitions.create(['transform']),
		zIndex: 5,
		textShadow: '0 1px 12px rgba(0,0,0,.2)',
		textAlign: 'center',
		whiteSpace: 'nowrap',
	},
	entityCard: {
		height: 200,
		width: 183,
		flexGrow: 'initial',
		flexBasis: 'initial',
		margin: theme.spacing.unit / 2,
		transition: theme.transitions.create(['all']),
		'&:hover': {
			transform: 'scale(1.05)',
			overflow: 'initial',
			zIndex: 200,
			boxShadow: `0 2px 14px rgba(0,55,230,.3)`,
			background: M.colors.blue.A200,
		},
		'&:hover > div': {
			boxShadow: 'none',
		},
		'&:hover > * > h1': {
			transform: 'scale(1.4)',
			fontWeight: 700,
			textShadow: '0 2px 12px rgba(0,0,0,.7)',
		},
		position: 'relative',
		overflow: 'hidden',
	},
	entityCardDisabled: {
		height: 200,
		width: 183,
		flexGrow: 'initial',
		flexBasis: 'initial',
		margin: theme.spacing.unit / 2,
		transition: theme.transitions.create(['all']),
		filter: 'brightness(.8)',
		position: 'relative',
		overflow: 'hidden',
	},
	entityImage: {
		height: '100%',
		width: '100%',
		objectFit: 'cover',
		position: 'absolute',
		zIndex: -1,
		transition: theme.transitions.create(['filter']),
		'&:hover': {
			filter: 'brightness(0.8)',
		},
		top: 0,
		left: 0,
	},
	entityTitle: {
		fontSize: 14,
		fontWeight: 500,
		position: 'absolute',
		padding: theme.spacing.unit * 2,
		transition: theme.transitions.create(['transform']),
		bottom: 0,
		zIndex: 5,
		left: 0,
		textShadow: '0 1px 12px rgba(0,0,0,.2)',
	},
	entitySubTitle: {
		fontSize: 14,
		fontWeight: 600,
		position: 'absolute',
		padding: theme.spacing.unit * 2,
		transition: theme.transitions.create(['transform']),
		top: 0,
		left: 0,
		zIndex: 5,
		textShadow: '0 1px 12px rgba(0,0,0,.2)',
	},
	itemcontainer: {
		paddingBottom: theme.spacing.unit * 2,
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
	},
	gradientCard: {
		position: 'relative',
		background: 'linear-gradient(to top, transparent, rgba(0,0,0,.6))',
		height: 183,
		width: '100%',
	},
	sectDivide: {
		marginTop: theme.spacing.unit * 2,
	},
	progressCon: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		maxWidth: 400,
		margin: 'auto',
	},
	progressTitle: {
		display: 'flex',
		fontSize: 12,
		margin: 'auto',
		textAlign: 'center',
	},
	progressBar: {
		background: 'rgba(255,255,255,.3)',
		margin: theme.spacing.unit / 2,
	},
	progressBarActive: {
		background: 'white',
	},
	commandoBar: {
		width: '100%',
		display: 'inline-flex',
		boxSizing: 'border-box',
		background: '#222',
		borderBottom: `1px solid rgba(255,255,255,.1)`
	},
	commandoText: {
		margin: 'auto',
		textAlign: 'center',
	},
	commandoTextBox: {
		paddingLeft: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		margin: 'auto',
	},
	commandoTextLabel: {
		fontSize: 12,
		textAlign: 'center',
		color: 'rgba(255,255,255,.8)',
	},
	smallTitlebar: {
		display: 'flex',
	},
	artworktype: {
		fontSize: 12,
		boxSizing: 'border-box',
		padding: theme.spacing.unit * 2,
		width: '100%',
		margin: 'auto',
		textAlign: 'center',
		background: '#111',
		color: 'white',
		boxShadow: '0 2px 16px rgba(0,0,0,.2)',
		fontWeight: 600,
	},
	loadingArtwork: {
		margin: 'auto',
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		color: 'white',
		filter: 'drop-shadow(0 2px 16px rgba(0,0,0,.3))',
	},
	leftSide: {
		[theme.breakpoints.down('sm')]: {
			maxWidth: '100%',
			flexBasis: 0,
			width: '100%',
		},
	},
	fabPlayButton: {
		position: 'fixed',
		bottom: theme.spacing.unit * 4,
		right: theme.spacing.unit * 4,
		zIndex: 10000,
	},
	fabProgress: {
		color: 'white',
		zIndex: 10001,
	},
	fabWrapper: {
		margin: theme.spacing.unit,
		position: 'relative',
		zIndex: 10000,
	},
	fabContainer: {
		transition: theme.transitions.create(['all']),
		opacity: 0,
		zIndex: 10000,
	},
});

const nameSwapper = (first, last) => (last ? first + ' ' + last : first);

class Show extends Component {
	state = {
		data: {},
		tabVal: 0,
		loading: true,
		playerActive: false,
		id: 0,
		hue: '#111',
		hueVib: M.colors.blue.A200,
		hueVibN: M.colors.grey.A700,
		eps: null,
		epError: false,
		menuEl: null,
	};

	frame = document.getElementById('previewFrame');

	unlisten = this.props.history.listen((location, action) => {
		let id = queryString.parse(location.search);
		if (location.pathname === '/show')
			if (id.s !== this.state.id) {
				this.init();
			}
	});

	componentWillMount = () => {
		window.scrollTo(0, 0);
	};

	componentDidMount = async () => {
		this.init();
	};


    componentWillReceiveProps = async (nextProps) => {
		if (this.props.mir !== nextProps.mir && this.state.data.Media)
			await this.executeTwist();
    }


    init = () =>
		this.setState(
			{
				data: null,
				loading: true,
				hue: '#111',
				hueVib: M.colors.blue.A200,
				hueVibN: M.colors.grey.A700,
				eps: null,
				epError: false,
			},
			async () =>
				setTimeout(async () => {
					let superBar = document.getElementById('superBar');
					if (superBar) superBar.style.background = null;
					let id = queryString.parse(this.props.history.location.search);
					if (id) {
						const { data } = this.props.history.location.search.includes('?m=')
							? await new Segoku().getSingleManga({ id: id.m })
							: await new Segoku().getSingle({ id: id.s });
						try {
							if (data) {
								this.setState(
									{
										data,
										id: data.Media.id,
										fav: this.props.history.location.search.includes('?s=')
											? this.props.profile.favs &&
												this.props.profile.favs.show &&
												this.props.profile.favs.show.hasOwnProperty(id.s)
												? true
												: false
											: this.props.profile.favs &&
												this.props.profile.favs.manga &&
												this.props.profile.favs.manga.hasOwnProperty(id.m)
												? true
												: false,
									},
									() => this.pasta()
								);
							} else throw new Error('Metadata error');
						} catch (error) {
							this.setState({ error }, () =>
								setTimeout(() => this.setState({ error: '' }), 3000)
							);
						}
					}
				}, 300)
		);

	pasta = async () => {
		let data = this.state.data.Media;
		this.props.sendTitleToMir(
			data.title.english ? data.title.english : data.title.romaji
		);
		let image = this.state.data.Media.bannerImage
			? this.state.data.Media.bannerImage
			: this.state.data.Media.coverImage.medium;

		const similars = await new Segoku().getSimilar({
			tag: data.tags.length > 0 ? data.tags[0].name : null,
			sort: ['POPULARITY_DESC'],
			page: 1,
			isAdult: false
		});
		if (data && this.props.profile && this.props.profile.username && this.props.profile.willLog) {
			this.props.firebase
				.push(`users/${this.props.profile.userID}/feed`, {
					date: Date.now(),
					type: 'SHOW',
					activity: `Checked out ${
						data.title.english ? data.title.english : data.title.romaji
						}`,
					bgImg: data.bannerImage && data.bannerImage,
					coverImg: data.coverImage.large,
					user: {
						username: this.props.profile.username,
						avatar: this.props.profile.avatar,
						userID: this.props.profile.userID,
					},
				})
				.then(() => console.info('Logged!'));
		}

		if (image)
			Vibrant.from('https://cors-anywhere.herokuapp.com/' + image).getPalette(
				(err, pal) => {
					if (err) console.error(err);
					if (pal) {
						this.setState(
							{
								hue: pal.DarkMuted && pal.DarkMuted.getHex(),
								hueVib: pal.LightVibrant && pal.LightVibrant.getHex(),
								hueVibN: pal.DarkVibrant && pal.DarkVibrant.getHex(),
								similars,
							},
							() => { }
						);
					}
				}
			);
		if (similars) this.setState({ similars });
		if (data && data.tags.length > 1) {
			const similars2 = await new Segoku().getSimilar({
				tag: data.tags.length > 1 ? data.tags[1].name : null,
				sort: ['POPULARITY_DESC'],
				page: 1,
				isAdult: false
			});

			if (similars2) this.setState({ similars2 })
		}
		if (this.state.data)
			this.setState(
				{
					loading: false,
				},
				async () => {
					if (data.type.includes('MANGA'))
						this.setState({ eps: null, epError: false });
					else if (
						data.format.includes('OVA') ||
						data.format.includes('ONA') ||
						data.format.includes('SPIN_OFF')
					) {
						this.setState({ eps: null, epError: true });
					} else {
						return null
					}
				}
			);
	};

	executeTwist = async () => {
		let db = this.props.firebase.ref('twist');
		let dbval = await db.once('value');
		if (dbval && Object(dbval.val()).hasOwnProperty(this.state.id)) {
			let eps = await db.child(this.state.id).once('value')
			if (eps) this.setState({eps: Object.values(eps.val())}, () => console.info('loaded from database'))
			else
				throw new Error('owo')
		}
		else if (this.props.mir && this.props.mir.twist) {
			let correctedtitle = this.state.data.Media.title.romaji
				.toLowerCase()
				.replace('(tv)', '');
			const meta = this.props.mir.twist.filter(s =>
				s.name.toLowerCase().match(`${correctedtitle}`)
			);
			console.log(meta);
			if (meta.length > 0) {
				const eps = await Twist.get(meta[0].link);
				try {
					if (eps) return this.setState({ eps }, async () => {
						if (meta[0].ongoing === false) {
                            let db = this.props.firebase.ref('twist');
                            await db.child(this.state.id).update(eps);
                        }
					});
				} catch (error) {
					return this.setState({ epError: true });
				}
			} else {
				return this.setState({ epError: true });
			}
		} else {
			return this.setState({ epError: true });
		}
	};

	tabChange = (e, val) => this.setState({ tabVal: val });

	play = () => {
		window.scrollTo(0, 0);
		if (
			this.state.data.Media &&
			this.state.data.Media.type.includes('ANIME') &&
			this.state.eps
		)
			this.props.history.push('/watch?w=' + this.state.data.Media.id, {
				meta: this.state.data.Media,
				eps: this.state.eps,
			});
		else
			this.props.history.push(
				'/read?r=' + this.state.data.Media.id,
				this.state.data.Media
			);
	};

	componentWillUnmount = () => {
		this.props.sendTitleToMir('');
		this.unlisten();
	};

	openEntity = link => {
		this.props.history.push(link);
	};

	atLeave = () => {
		if (this.state.data.Media && this.state.data.Media.trailer) {
			let tbg = document.getElementById('trailerbg');
			tbg.remove();
		}
	};

	like = async () => {
		let data = this.state.data.Media;
		let name = data.title.english ? data.title.english : data.title.romaji;
		let image = data.coverImage.large;
		let entity = data.type.includes('ANIME') ? 'show' : 'manga';
		if (this.props.profile)
			this.props.firebase
				.update(
				`users/${this.props.profile.userID}/favs/${entity}/${data.id}`,
				{
					name,
					image,
					id: data.id,
					link:
						this.props.history.location.pathname +
						this.props.history.location.search,
				}
				)
				.then(() => {
					this.setState({ fav: true });
				});
	};

	unlike = async () => {
		let data = this.state.data.Media;
		let entity = data.type.includes('ANIME') ? 'show' : 'manga';
		if (this.props.profile)
			this.props.firebase
				.remove(`users/${this.props.profile.userID}/favs/${entity}/${data.id}`)
				.then(() => this.setState({ fav: false }));
	};

	addToLater = async () => {
		let data = this.state.data.Media;
		let name = data.title.english ? data.title.english : data.title.romaji;
		let image = data.coverImage.large;
		let entity = data.type.includes('ANIME') ? 'show' : 'manga';
		if (this.props.profile)
			this.props.firebase.update(
				`users/${this.props.profile.userID}/later/${entity}/${data.id}`,
				{
					name,
					image,
					id: data.id,
					link:
						this.props.history.location.pathname +
						this.props.history.location.search,
					date: Date.now(),
					bg: data.bannerImage ? data.bannerImage : null,
				}
			);
	};

	removeFromLater = async () => {
		let data = this.state.data.Media;
		let entity = data.type.includes('ANIME') ? 'show' : 'manga';
		if (this.props.profile)
			this.props.firebase.remove(
				`users/${this.props.profile.userID}/later/${entity}/${data.id}`
			);
	};

	render() {
		const { classes } = this.props;
		const {
			data,
			loading,
			playerActive,
			hue,
			hueVib,
			hueVibN,
			similars,
			fav,
			eps,
			epError,
			menuEl,
			similars2
		} = this.state;

		const openMenu = Boolean(menuEl);

		const user = this.props.profile;

		const Menu = (
			<M.Menu
				id="more-menu"
				anchorEl={menuEl}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
				MenuListProps={{ style: { padding: 0 } }}
				PaperProps={{ style: { background: hue } }}
				open={openMenu}
				onClose={() => this.setState({ menuEl: null })}
			>
				<M.MenuItem onClick={this.reportError}>Report error</M.MenuItem>
				<M.MenuItem onClick={this.editEntry}>Edit entry</M.MenuItem>
			</M.Menu>
		);

		return (
			<div className={classes.frame}>
				<LoadingIndicator
					loading={loading}
				/>
				<Root
					id="previewFrame"
					className={classes.root}
					style={loading ? { opacity: 0 } : null}
				>
					{data && data.Media ? (
						<div>
							<div id="fabShowButton" className={classes.fabContainer}>
								<M.Button
									color="primary"
									disabled={
										data.Media.type.includes('MANGA')
											? false
											: data.Media.status.includes('NOT_YET_RELEASED') || !eps
												? true
												: false
									}
									className={classes.fabPlayButton}
									fab
									style={{ background: hueVibN }}
									onClick={this.play}
								>
									{data.Media.type.includes('MANGA') ? (
										<Icon.PlayArrow />
									) : epError ? (
										<Icon.ErrorOutline />
									) : data.Media.status.includes('NOT_YET_RELEASED') || !eps ? (
										<M.CircularProgress
											size={24}
											style={{ color: hueVib }}
											className={classes.fabProgress}
										/>
									) : (
													<Icon.PlayArrow />
												)}
								</M.Button>
							</div>
							<Container spacing={16} id='mainHeader' special style={{ background: hue }}>
								<Header image={data.Media.bannerImage ? data.Media.bannerImage : null} color={hue} style={{ background: hue }} />
								<M.Grid item xs={3} className={classes.leftSide}>
									<div
										className={
											data.Media.type.includes('MANGA')
												? classes.artwork
												: data.Media.status.includes('NOT_YET_RELEASED') || !eps
													? classes.artworkDisabled
													: classes.artwork
										}
										style={{ background: hueVib }}
										onClick={
											data.Media.type.includes('MANGA')
												? this.play
												: data.Media.status.includes('NOT_YET_RELEASED') || !eps
													? null
													: this.play
										}
									>
										<img
											src={data.Media.coverImage.large}
											alt=""
											className={classes.artworkimg}
											style={{ opacity: 0 }}
											onLoad={e => (e.currentTarget.style.opacity = null)}
										/>
										<M.CircularProgress
											className={classes.loadingArtwork}
											style={
												data.Media.type.includes('MANGA')
													? { opacity: 0 }
													: eps
														? { opacity: 0 }
														: epError ? { opacity: 0 } : null
											}
										/>
										<M.Typography className="artworktitle" type="display1">
											{data.Media.status.includes('NOT_YET_RELEASED')
												? 'TBA'
												: data.Media.type.includes('MANGA')
													? 'Read'
													: eps
														? 'Play'
														: epError ? 'Not avaliable' : 'Loading'}
										</M.Typography>
										<M.Typography
											className={classes.artworktype}
											style={{ background: hue }}
											type="display1"
										>
											{data.Media.status
												.replace('RELEASING', 'ONGOING')
												.replace(/_/gi, ' ')}{' '}
											{data.Media.type} <br />
											{data.Media.nextAiringEpisode
												? timeFormatter(
													data.Media.nextAiringEpisode.timeUntilAiring
												) +
												' till Episode ' +
												data.Media.nextAiringEpisode.episode
												: null}
										</M.Typography>
									</div>
								</M.Grid>
								<M.Grid item xs className={classes.mainFrame}>
									<div className={classes.smallTitlebar}>
										{data.Media.type.includes('ANIME') ? (
											<M.Typography
												className={classes.smallTitle}
												type="display2"
											>
												{data.Media.title.native}{' '}
												{'• ' + data.Media.startDate.year}{' '}
												{'• ' +
													Math.floor(data.Media.duration / 60) +
													' h ' +
													data.Media.duration % 60 +
													' min'}
											</M.Typography>
										) : (
												<M.Typography
													className={classes.smallTitle}
													type="display2"
												>
													{data.Media.title.native}{' '}
													{'• ' + data.Media.startDate.year}{' '}
													{'• ' +
														data.Media.chapters +
														' chapters in ' +
														data.Media.volumes +
														' volumes'}
												</M.Typography>
											)}
										<div style={{ flex: 1 }} />
										<M.Typography
											className={classes.smallTitle}
											style={{ cursor: 'pointer' }}
											onClick={() => window.open(data.Media.siteUrl)}
											type="display2"
										>
											Data provided by AniList
										</M.Typography>
									</div>
									<M.Typography className={classes.bigTitle} type="display3">
										{data.Media.title.english
											? data.Media.title.english
											: data.Media.title.romaji}
									</M.Typography>

									<M.Divider />
									<M.Typography
										className={classes.desc}
										type="body1"
										dangerouslySetInnerHTML={{ __html: data.Media.description }}
									/>
									<div style={{ display: 'flex' }}>
										{data.Media.staff.edges.filter(
											s => s.role === 'Director'
										)[0] ? (
												<M.Typography className={classes.boldD} type="headline">
													Directed by{' '}
												</M.Typography>
											) : null}
										{data.Media.staff.edges.filter(
											s => s.role === 'Director'
										)[0] ? (
												<M.Typography className={classes.smallD} type="headline">
													{
														data.Media.staff.edges.filter(
															s => s.role === 'Director'
														)[0].node.name.first
													}{' '}
													{data.Media.staff.edges.filter(
														s => s.role === 'Director'
													)[0].node.name.last
														? data.Media.staff.edges.filter(
															s => s.role === 'Director'
														)[0].node.name.last
														: null}
												</M.Typography>
											) : null}
										{data.Media.staff.edges.filter(
											s => s.role === 'Original Creator'
										)[0] ? (
												<div className={classes.sepD}>
													<M.Typography className={classes.boldD} type="headline">
														{data.Media.staff.edges.filter(
															s => s.role === 'Director'
														)[0]
															? 'and written by'
															: 'Written by'}
													</M.Typography>
													<M.Typography
														className={classes.smallD}
														type="headline"
													>
														{
															data.Media.staff.edges.filter(
																s => s.role === 'Original Creator'
															)[0].node.name.first
														}{' '}
														{data.Media.staff.edges.filter(
															s => s.role === 'Original Creator'
														)[0].node.name.last
															? data.Media.staff.edges.filter(
																s => s.role === 'Original Creator'
															)[0].node.name.last
															: null}
													</M.Typography>
												</div>
											) : null}
									</div>
									<M.Divider />
									<M.Grid container>
										<M.Grid item xs className={classes.tagBox}>
											<M.Typography className={classes.tagTitle} type="title">
												Genres
											</M.Typography>
											<div className={classes.genreRow}>
												{data.Media.genres
													? data.Media.genres.map((o, i) => (
														<M.Chip
															onClick={() =>
																this.props.history.push(`/tag?g=${o}`)
															}
															className={classes.tagChip}
															key={i}
															label={o}
														/>
													))
													: null}
											</div>
										</M.Grid>
										<M.Grid item xs className={classes.tagBox}>
											<M.Typography className={classes.tagTitle} type="title">
												Tags
											</M.Typography>
											<div className={classes.genreRow}>
												{data.Media.tags.map((o, i) => (
													<M.Chip
														onClick={() =>
															this.props.history.push(`/tag?t=${o.id}`)
														}
														className={classes.tagChip}
														key={i}
														label={o.name}
													/>
												))}
											</div>
										</M.Grid>
										{data.Media.type.includes('MANGA') ? null : (
											<M.Grid item xs className={classes.tagBox}>
												<M.Typography className={classes.tagTitle} type="title">
													Studios
												</M.Typography>
												<div className={classes.genreRow}>
													{data.Media.studios.edges.map((o, i) => (
														<M.Chip
															onClick={() =>
																this.props.history.push(`/tag?s=${o.node.id}`)
															}
															className={classes.tagChip}
															key={i}
															label={o.node.name}
														/>
													))}
												</div>
											</M.Grid>
										)}
									</M.Grid>
								</M.Grid>
							</Container>
							<MainCard style={{ background: hue }}>
								<CommandoBar style={{ background: hue }}>
									{data.Media.averageScore ? (
										<div className={classes.commandoTextBox}>
											<M.Typography
												type="title"
												className={classes.commandoText}
												style={{ color: hueVib }}
											>
												{data.Media.averageScore}%
											</M.Typography>
											<M.Typography
												type="body1"
												className={classes.commandoTextLabel}
											>
												Average Score
											</M.Typography>
										</div>
									) : null}
									{data.Media.meanScore ? (
										<div className={classes.commandoTextBox}>
											<M.Typography
												type="title"
												className={classes.commandoText}
											>
												{data.Media.meanScore}%
											</M.Typography>
											<M.Typography
												type="body1"
												className={classes.commandoTextLabel}
											>
												Mean Score
											</M.Typography>
										</div>
									) : null}
									{data.Media.type.includes('MANGA') ||
										!data.Media.season ? null : (
											<M.Button
												style={{
													textTransform: 'initial',
													display: 'flex',
													flexDirection: 'column',
												}}
												onClick={() =>
													window.open(
														`http://anichart.net/${data.Media.season.toLowerCase() +
														'-' +
														data.Media.startDate.year}`
													)
												}
												className={classes.commandoTextBox}
											>
												<M.Typography
													type="title"
													className={classes.commandoText}
												>
													{data.Media.season &&
														data.Media.season + ' ' + data.Media.startDate.year}
												</M.Typography>
											</M.Button>
										)}
									{data.Media.type.includes('MANGA') ||
										data.Media.format.includes('ONA') ||
										data.Media.format.includes('OVA') ? null : !eps &&
											!epError ? (
												<M.CircularProgress
													style={{ color: hueVib }}
													className={classes.commandoTextBox}
												/>
											) : epError ? (
												<FadeIn>
													<div className={classes.commandoTextBox}>
														<div
															style={{ color: 'white', lineHeight: 0 }}
															className={classes.commandoText}
														>
															<Icon.ErrorOutline />
														</div>
														<M.Typography
															type="body1"
															className={classes.commandoTextLabel}
														>
															Episodes
												</M.Typography>
													</div>
												</FadeIn>
											) : (
													<FadeIn>
														<div className={classes.commandoTextBox}>
															<M.Typography
																type="title"
																className={classes.commandoText}
															>
																{eps ? eps.length : '...'}
															</M.Typography>
															<M.Typography
																type="body1"
																className={classes.commandoTextLabel}
															>
																Episodes
												</M.Typography>
														</div>
													</FadeIn>
												)}
									<div style={{ flex: 1 }} />
									{user &&
										user.episodeProgress &&
										user.episodeProgress.hasOwnProperty(data.Media.id) ? (
											<div className={classes.progressCon}>
												<M.Typography
													type="title"
													className={classes.progressTitle}
												>
													Episode {user.episodeProgress[data.Media.id].ep}
												</M.Typography>
												<M.LinearProgress
													mode="determinate"
													value={user.episodeProgress[data.Media.id].played * 100}
													classes={{
														primaryColor: classes.progressBar,
														primaryColorBar: classes.progressBarActive,
													}}
												/>
												<M.Typography
													type="body1"
													className={classes.commandoTextLabel}
												>
													Your progress
											</M.Typography>
											</div>
										) : null}
									<div style={{ flex: 1 }} />
									{data.Media.hashtag ? (
										<M.Button
											color="contrast"
											onClick={() =>
												window.open(
													`https://twitter.com/hashtag/${data.Media.hashtag.replace(
														'#',
														''
													)}`
												)
											}
										>
											<svg
												style={{ width: 28, height: 28, marginRight: 8 }}
												viewBox="0 0 24 24"
											>
												<path
													fill="#FFFFFF"
													d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"
												/>
											</svg>{' '}
											{data.Media.hashtag}
										</M.Button>
									) : null}
									{user ? (
										<M.Tooltip
											title={
												data.Media.type.includes('ANIME')
													? user.later &&
														user.later.show &&
														user.later.show.hasOwnProperty(this.state.id)
														? 'Remove from later'
														: 'Add to later'
													: user.later &&
														user.later.manga &&
														user.later.manga.hasOwnProperty(this.state.id)
														? 'Remove from later'
														: 'Add to later'
											}
										>
											<M.IconButton
												className={classes.commandoButton}
												color="contrast"
												onClick={
													data.Media.type.includes('ANIME')
														? user.later &&
															user.later.show &&
															user.later.show.hasOwnProperty(this.state.id)
															? this.removeFromLater
															: this.addToLater
														: user.later &&
															user.later.manga &&
															user.later.manga.hasOwnProperty(this.state.id)
															? this.removeFromLater
															: this.addToLater
												}
											>
												{data.Media.type.includes('ANIME') ? (
													user.later &&
														user.later.show &&
														user.later.show.hasOwnProperty(this.state.id) ? (
															<Icon.AddCircle />
														) : (
															<Icon.AddCircleOutline />
														)
												) : user.later &&
													user.later.manga &&
													user.later.manga.hasOwnProperty(this.state.id) ? (
															<Icon.AddCircle />
														) : (
															<Icon.AddCircleOutline />
														)}
											</M.IconButton>
										</M.Tooltip>
									) : null}
									{user ? (
										<M.Tooltip
											title={fav ? 'Remove from favorites' : 'Add to favorites'}
										>
											<M.IconButton
												className={classes.commandoButton}
												color="contrast"
												onClick={
													data.Media.type.includes('ANIME')
														? user.favs &&
															user.favs.show &&
															user.favs.show.hasOwnProperty(this.state.id)
															? this.unlike
															: this.like
														: user.favs &&
															user.favs.manga &&
															user.favs.manga.hasOwnProperty(this.state.id)
															? this.unlike
															: this.like
												}
											>
												{fav ? <Icon.Favorite /> : <Icon.FavoriteBorder />}
											</M.IconButton>
										</M.Tooltip>
									) : null}
									<M.IconButton
										aria-owns={openMenu ? 'more-menu' : null}
										aria-haspopup="true"
										onClick={e => this.setState({ menuEl: e.currentTarget })}
										color="contrast"
									>
										<Icon.MoreVert />
									</M.IconButton>
									{Menu}
								</CommandoBar>
								<Container>
									<M.Grid item xs style={{ zIndex: 10 }}>
                                        {data.Media.characters.edges.length > 0 ? (
                                            <M.Typography type="title" className={classes.secTitle}>
                                                {data.Media.type.includes('ANIME')
                                                    ? 'Cast'
                                                    : 'Characters'}
                                            </M.Typography>
                                        ) : null}
                                        {data.Media.characters.edges.length > 0 ? (
                                            <M.Grid container className={classes.itemcontainer}>
                                                {data.Media.characters.edges.map((cast, index) => (
                                                    <PeopleButton key={index} onClick={() =>
                                                        this.props.history.push(
                                                            `/fig?${
                                                                cast.voiceActors &&
                                                                cast.voiceActors.length > 0
                                                                    ? 's'
                                                                    : 'c'
                                                                }=${
                                                                cast.voiceActors &&
                                                                cast.voiceActors.length > 0
                                                                    ? cast.voiceActors.filter(
                                                                    j => j.language === 'JAPANESE'
                                                                    )[0].id
                                                                    : cast.node.id
                                                                }`
                                                        )} image={cast.voiceActors &&
                                                    cast.voiceActors.length > 0
                                                        ? cast.voiceActors.filter(
                                                            j => j.language === 'JAPANESE'
                                                        )[0]
                                                            ? cast.voiceActors.filter(
                                                                j => j.language === 'JAPANESE'
                                                            )[0].image.large
                                                            : null
                                                        : cast.node.image.large} actor={cast.voiceActors &&
                                                    cast.voiceActors.length > 0 ? true : false}
                                                                  name={{
                                                                      first: cast.voiceActors && cast.voiceActors.length > 0
                                                                          ? cast.voiceActors[0].name.first : cast.node.name.first
                                                                      , last: cast.voiceActors && cast.voiceActors.length > 0
                                                                          ? cast.voiceActors[0].name.last : cast.node.name.last
                                                                  }}
                                                                  charImg={cast.node.image.large}
                                                                  charOnClick={() => this.openEntity(`/fig?c=${cast.node.id}`)}
                                                                  actor={cast.voiceActors && cast.voiceActors.length > 0
                                                                      ? true : false}
                                                                  role={
                                                                      cast.voiceActors && cast.voiceActors.length > 0
                                                                          ? `as ${
                                                                              cast.node.name.last
                                                                                  ? cast.node.name.first +
                                                                                  ' ' +
                                                                                  cast.node.name.last
                                                                                  : cast.node.name.first
                                                                              }`
                                                                          : cast.role
                                                                  } />
                                                ))}
                                            </M.Grid>
                                        ) : null}
										{data.Media.characters.edges.length > 0 ? <M.Divider /> : null}
										<M.Typography type="title" className={classes.secTitle}>
											Staff
										</M.Typography>
										<M.Grid container className={classes.itemcontainer}>
											{data.Media.staff.edges.map((staff, index) => (
												<PeopleButton key={index} image={staff.node.image.large} name={{first: staff.node.name.first, last: staff.node.name.last}} role={staff.role} onClick={() => this.props.history.push(`/fig?s=${staff.node.id}`)} />
											))}
										</M.Grid>
                                        <M.Divider />
                                        <M.Typography type="title" className={classes.secTitle}>
                                            Similar to this one
                                        </M.Typography>
                                        <M.Grid container className={classes.itemcontainer}>
                                            {data.Media.relations.edges.map((anime, index) => (
                                                <CardButton key={index} image={anime.node.coverImage.large} title={anime.node.title.english
                                                    ? anime.node.title.english
                                                    : anime.node.title.romaji} subtitle={anime.node.type + ' ' +
                                                anime.relationType.replace(/_/gi, ' ')} onClick={() =>
                                                    this.openEntity(
                                                        `/show?${
                                                            anime.node.type.includes('ANIME') ? 's' : 'm'
                                                            }=${anime.node.id}`
                                                    )} />

                                            ))}
                                            {data.Media.tags.length > 0 &&
                                            similars &&
                                            similars.data &&
                                            similars.data.Page.media
                                                .map((anime, index) => (
                                                    <CardButton key={index} image={anime.coverImage.large} title={anime.title.english
                                                        ? anime.title.english
                                                        : anime.title.romaji} subtitle='SIMILAR' onClick={() =>
                                                        this.openEntity(
                                                            `/show?${
                                                                anime.type.includes('ANIME') ? 's' : 'm'
                                                                }=${anime.id}`
                                                        )} />

                                                ))}
                                            {data.Media.tags.length > 1 &&
                                            similars2 &&
                                            similars2.data &&
                                            similars2.data.Page.media
                                                .map((anime, index) => (
                                                    <CardButton key={index} image={anime.coverImage.large} title={anime.title.english
                                                        ? anime.title.english
                                                        : anime.title.romaji} subtitle='SIMILAR' onClick={() =>
                                                        this.openEntity(
                                                            `/show?${
                                                                anime.type.includes('ANIME') ? 's' : 'm'
                                                                }=${anime.id}`
                                                        )} />

                                                ))}
                                        </M.Grid>
									</M.Grid>
								</Container>
							</MainCard>
						</div>
					) : null}
				</Root>
			</div>
		);
	}
}

const mapPTS = dispatch => {
	return {
		sendTitleToMir: title => dispatch(updateMirTitle(title)),
	};
};

export const updateMirTitle = title => ({
	type: MIR_SET_TITLE,
	title,
});

export default firebaseConnect()(
	connect(({ firebase: { profile }, mir }) => ({ profile, mir }), mapPTS)(
		M.withStyles(styles)(Show)
	)
);
