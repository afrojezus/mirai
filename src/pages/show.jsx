// TODO: Fix every single eslint-airbnb issue... later?
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import localForage from 'localforage';
import * as Icon from 'material-ui-icons';
import queryString from 'query-string';
import * as Vibrant from 'node-vibrant';
import FadeIn from 'react-fade-in';
import { connect } from 'react-redux';
import { firebaseConnect, isEmpty, firebase } from 'react-redux-firebase';
import * as jquery from 'jquery';
import Button from 'material-ui/Button/Button';
import Grid from 'material-ui/Grid/Grid';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import Typography from 'material-ui/Typography/Typography';
import Divider from 'material-ui/Divider/Divider';
import Chip from 'material-ui/Chip/Chip';
import LinearProgress from 'material-ui/Progress/LinearProgress';
import Tooltip from 'material-ui/Tooltip/Tooltip';
import IconButton from 'material-ui/IconButton/IconButton';
import Paper from 'material-ui/Paper/Paper';
import Modal from 'material-ui/Modal/Modal';
import blue from 'material-ui/colors/blue';
import grey from 'material-ui/colors/grey';
import MenuItem from 'material-ui/Menu/MenuItem';
import Menu from 'material-ui/Menu/Menu';
import withStyles from 'material-ui/styles/withStyles';
import { timeFormatter } from '../components/supertable';
import Segoku from '../utils/segoku/segoku';
import { history } from '../store';
import {
	Root,
	Container,
	CommandoBar,
	MainCard,
	Header,
	LoadingIndicator,
	TitleHeader
} from '../components/layouts';
import hsfetcher from '../torrent';
import Twist from '../twist-api';

import CardButton, { PeopleButton } from '../components/cardButton';

import { MIR_SET_TITLE, MIR_PLAY_SHOW } from '../constants';

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
		transition: theme.transitions.create(['all'])
	},
	root: {
		paddingTop: theme.spacing.unit * 8,
		transition: theme.transitions.create(['all']),
		animation: 'load .3s ease',
		marginLeft: 'auto',
		marginRight: 'auto',
		maxWidth: 1970
	},
	backToolbar: {
		marginTop: theme.spacing.unit * 8
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
		transition: theme.transitions.create(['all'])
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
		transform: 'scale(20)'
	},
	rootInactive: {
		opacity: 0,
		pointerEvents: 'none',
		transition: theme.transitions.create(['all'])
	},
	container: {
		padding: theme.spacing.unit * 3,
		boxSizing: 'border-box',
		[theme.breakpoints.down('sm')]: {
			flexDirection: 'column'
		}
	},
	frame: {
		height: '100%',
		width: '100%',
		position: 'relative',
		transition: theme.transitions.create(['all'])
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
		transition: theme.transitions.create(['all'])
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
		transition: theme.transitions.create(['all'])
	},
	mainFrame: {
		marginLeft: 24,
		[theme.breakpoints.down('sm')]: {
			marginLeft: 0,
			paddingTop: `${theme.spacing.unit * 8}px !important`
		}
	},
	bigTitle: {
		fontWeight: 800,
		color: 'white',
		textShadow: '0 2px 12px rgba(0,0,0,.2)'
	},
	smallTitle: {
		fontWeight: 600,
		color: 'white',
		fontSize: theme.typography.pxToRem(16),
		textShadow: '0 2px 12px rgba(0,0,0,.17)'
	},
	tagBox: {
		marginTop: theme.spacing.unit
	},
	tagTitle: {
		fontSize: theme.typography.pxToRem(16),
		fontWeight: 600,
		color: 'white',
		textShadow: '0 2px 12px rgba(0,0,0,.17)',
		marginBottom: theme.spacing.unit
	},
	desc: {
		marginTop: theme.spacing.unit,
		color: 'white',
		textShadow: '0 0 12px rgba(0,0,0,.1)',
		marginBottom: theme.spacing.unit
	},
	boldD: {
		marginTop: theme.spacing.unit,
		color: 'white',
		textShadow: '0 0 12px rgba(0,0,0,.1)',
		marginBottom: theme.spacing.unit,
		fontWeight: 600
	},
	smallD: {
		marginLeft: theme.spacing.unit,
		marginTop: theme.spacing.unit,
		color: 'white',
		textShadow: '0 0 12px rgba(0,0,0,.1)',
		marginBottom: theme.spacing.unit
	},
	sepD: {
		display: 'flex',
		marginLeft: theme.spacing.unit
	},
	artworkimg: {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
		background: 'white',
		transition: theme.transitions.create(['all'])
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
			background: blue.A200
		},
		'&:hover > .artworktitle': {
			transform: 'translate(-50%,-50%) scale(1.2)'
		},
		'&:hover > img': {
			transform: 'scale(0.9)',
			filter: 'brightness(0.9)'
		},
		'&:active': {
			opacity: 0.7
		},
		zIndex: 500
	},
	artworkDisabled: {
		maxWidth: 300,
		height: 400,
		margin: 'auto',
		boxShadow: '0 3px 18px rgba(0,0,0,.5)',
		transition: theme.transitions.create(['all']),
		position: 'relative',
		'& > img': {
			opacity: 0.7
		},
		zIndex: 500
	},
	genreRow: {
		display: 'flex'
	},
	tagChip: {
		margin: theme.spacing.unit / 2,
		background: 'white',
		color: '#111',
		boxShadow: '0 2px 12px rgba(0,0,0,.17)'
	},
	secTitle: {
		padding: theme.spacing.unit,
		fontWeight: 700,
		fontSize: 22,
		zIndex: 'inherit',
		paddingBottom: theme.spacing.unit * 2
	},
	fillImg: {
		height: '100%',
		width: '100%',
		objectFit: 'cover',
		background: 'white',
		transition: theme.transitions.create(['all'])
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
			background: blue.A200
		},
		'&:hover > * > h1': {
			transform: 'scale(1.1)',
			textShadow: '0 2px 12px rgba(0,0,0,.7)'
		},
		position: 'relative',
		overflow: 'hidden'
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
			boxShadow: '0 3px 16px rgba(0,0,0,.5)'
		},
		top: 0,
		left: 0
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
			transform: 'scale(1.2)'
		},
		right: theme.spacing.unit * 3,
		bottom: theme.spacing.unit * 7
	},
	entityContext: {
		'&:last-child': {
			paddingBottom: 12
		}
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
		textShadow: '0 1px 12px rgba(0,0,0,.2)'
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
		whiteSpace: 'nowrap'
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
			background: blue.A200
		},
		'&:hover > div': {
			boxShadow: 'none'
		},
		'&:hover > * > h1': {
			transform: 'scale(1.4)',
			fontWeight: 700,
			textShadow: '0 2px 12px rgba(0,0,0,.7)'
		},
		position: 'relative',
		overflow: 'hidden'
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
		overflow: 'hidden'
	},
	entityImage: {
		height: '100%',
		width: '100%',
		objectFit: 'cover',
		position: 'absolute',
		zIndex: -1,
		transition: theme.transitions.create(['filter']),
		'&:hover': {
			filter: 'brightness(0.8)'
		},
		top: 0,
		left: 0
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
		textShadow: '0 1px 12px rgba(0,0,0,.2)'
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
		textShadow: '0 1px 12px rgba(0,0,0,.2)'
	},
	itemcontainer: {
		paddingBottom: theme.spacing.unit * 2,
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit
	},
	gradientCard: {
		position: 'relative',
		background: 'linear-gradient(to top, transparent, rgba(0,0,0,.6))',
		height: 183,
		width: '100%'
	},
	sectDivide: {
		marginTop: theme.spacing.unit * 2
	},
	progressCon: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		maxWidth: 400,
		margin: 'auto'
	},
	progressTitle: {
		display: 'flex',
		fontSize: theme.typography.pxToRem(12),
		margin: 'auto',
		textAlign: 'center'
	},
	progressBar: {
		background: 'rgba(255,255,255,.3)',
		margin: theme.spacing.unit / 2
	},
	progressBarActive: {
		background: 'white'
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
		textAlign: 'center'
	},
	commandoTextBox: {
		paddingLeft: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		margin: 'auto'
	},
	commandoTextBoxRow: {
		padding: theme.spacing.unit,
		margin: theme.spacing.unit,
		display: 'flex',
		boxShadow: 'none',
		border: '1px solid rgba(255,255,255,.1)',
		background: 'transparent'
	},
	commandoTextLabel: {
		fontSize: theme.typography.pxToRem(12),
		textAlign: 'center',
		color: 'rgba(255,255,255,.8)'
	},
	commandoTextLabelRow: {
		fontSize: theme.typography.pxToRem(14),
		color: 'white',
		margin: 'auto',
		paddingLeft: theme.spacing.unit
	},
	commandoTextNumberRow: {
		color: 'rgba(0,0,0,1)',
		margin: 'auto',
		fontSize: theme.typography.pxToRem(32),
		fontWeight: 700
	},
	smallTitlebar: {
		display: 'flex'
	},
	artworktype: {
		fontSize: theme.typography.pxToRem(12),
		boxSizing: 'border-box',
		padding: theme.spacing.unit * 2,
		width: '100%',
		margin: 'auto',
		textAlign: 'center',
		background: '#111',
		color: 'white',
		boxShadow: '0 2px 16px rgba(0,0,0,.2)',
		fontWeight: 600
	},
	loadingArtwork: {
		margin: 'auto',
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		color: 'white',
		filter: 'drop-shadow(0 2px 16px rgba(0,0,0,.3))'
	},
	leftSide: {
		[theme.breakpoints.down('sm')]: {
			maxWidth: '100%',
			flexBasis: 0,
			width: '100%'
		}
	},
	fabPlayButton: {
		position: 'fixed',
		bottom: theme.spacing.unit * 4,
		right: theme.spacing.unit * 4,
		zIndex: 10000,
		transform: 'translateZ(0)'
	},
	fabProgress: {
		color: 'white',
		zIndex: 10001
	},
	fabWrapper: {
		margin: theme.spacing.unit,
		position: 'relative',
		zIndex: 10000
	},
	fabContainer: {
		transition: theme.transitions.create(['all']),
		opacity: 0,
		zIndex: 10000
	},
	playArtworkButton: {
		background: grey[50],
		color: '#111',
		padding: theme.spacing.unit * 2,
		borderRadius: '50%',
		boxShadow: '0 2px 16px rgba(0,0,0,.1)',
		width: 32,
		height: 32
	}
});

const nameSwapper = (first, last) => (last ? `${first} ${last}` : first);

class Show extends Component {
	static propTypes = {
		data: PropTypes.objectOf({
			Media: PropTypes.objectOf({
				id: PropTypes.number,
				title: PropTypes.objectOf({
					romaji: PropTypes.string,
					english: PropTypes.string,
					native: PropTypes.string
				}),
				startDate: PropTypes.objectOf({
					year: PropTypes.number,
					month: PropTypes.number,
					day: PropTypes.number
				}),
				endDate: PropTypes.objectOf({
					year: PropTypes.number,
					month: PropTypes.number,
					day: PropTypes.number
				}),
				coverImage: PropTypes.objectOf({
					large: PropTypes.string,
					medium: PropTypes.string
				}),
				bannerImage: PropTypes.string,
				duration: PropTypes.number,
				synonyms: PropTypes.object,
				format: PropTypes.string,
				type: PropTypes.string,
				status: PropTypes.string,
				hashtag: PropTypes.string,
				episodes: PropTypes.number,
				chapters: PropTypes.number,
				volumes: PropTypes.number,
				description: PropTypes.string,
				averageScore: PropTypes.string,
				meanScore: PropTypes.string,
				genres: PropTypes.object,
				season: PropTypes.string,
				isAdult: PropTypes.bool,
				popularity: PropTypes.number,
				siteUrl: PropTypes.string,
				idMal: PropTypes.number,
				relations: PropTypes.object,
				source: PropTypes.string,
				tags: PropTypes.object,
				externalLinks: PropTypes.object,
				rankings: PropTypes.object,
				airingSchedule: PropTypes.object,
				studios: PropTypes.object,
				staff: PropTypes.object,
				characters: PropTypes.object
			})
		}),
		profile: PropTypes.shape({
			username: PropTypes.string,
			willLog: PropTypes.bool,
			avatar: PropTypes.string,
			userID: PropTypes.string
		}),
		history: PropTypes.shape({
			listen: PropTypes.func,
			push: PropTypes.func,
			location: PropTypes.shape({
				pathname: PropTypes.string,
				search: PropTypes.string
			})
		}),
		firebase: PropTypes.shape({
			push: PropTypes.func,
			ref: PropTypes.func,
			update: PropTypes.func,
			remove: PropTypes.func
		}),
		location: PropTypes.shape({
			state: PropTypes.shape({}),
			search: PropTypes.string,
			pathname: PropTypes.string
		}),
		classes: styles,
		mir: PropTypes.shape({
			title: PropTypes.string,
			twist: []
		}),
		changePage: PropTypes.func,
		status: PropTypes.string,
		theme: PropTypes.shape({}),
		sendTitleToMir: PropTypes.func,
		sendDataToMir: PropTypes.func
	};

	static defaultProps = {
		data: null,
		profile: null,
		history: null,
		firebase: null,
		location: null,
		classes: styles,
		mir: null,
		changePage: null,
		status: null,
		theme: {},
		sendTitleToMir: null,
		sendDataToMir: null
	};

	state = {
		data: {},
		tabVal: 0,
		loading: true,
		playerActive: false,
		id: 0,
		hue: '#111',
		hueVib: blue.A200,
		hueVibN: grey.A700,
		eps: null,
		epError: false,
		menuEl: null,
		reportModal: false
	};

	componentWillMount = () => {
		window.scrollTo(0, 0);
	};

	componentDidMount = async () => {
		this.init();
	};

	componentWillReceiveProps = async nextProps => {
		if (this.props.mir !== nextProps.mir && this.state.data.Media)
			await this.executeTwist();
	};

	componentWillUnmount = () => {
		this.props.sendTitleToMir('');
		this.unlisten();
	};

	frame = document.getElementById('previewFrame');

	unlisten = this.props.history.listen(location => {
		const id = queryString.parse(location.search);
		if (location.pathname === '/show')
			if (id.s !== this.state.id) {
				this.init();
			}
		return false;
	});

	init = () =>
		this.setState(
			{
				data: null,
				loading: true,
				hue: '#111',
				hueVib: blue.A200,
				hueVibN: grey.A700,
				eps: null,
				epError: false
			},
			async () =>
				setTimeout(async () => {
					const superBar = document.getElementById('superBar');
					if (superBar) superBar.style.background = null;
					const id = queryString.parse(this.props.history.location.search);
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
											? !!(
													this.props.profile.favs &&
													this.props.profile.favs.show &&
													this.props.profile.favs.show[id.s]
												)
											: !!(
													this.props.profile.favs &&
													this.props.profile.favs.manga &&
													this.props.profile.favs.manga[id.m]
												)
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
		const data = this.state.data.Media;
		this.props.sendTitleToMir(
			data.title.english ? data.title.english : data.title.romaji
		);
		const image = this.state.data.Media.bannerImage
			? this.state.data.Media.bannerImage
			: this.state.data.Media.coverImage.medium;

		const similars = await new Segoku().getSimilar({
			tag: data.tags.length > 0 ? data.tags[0].name : null,
			sort: ['POPULARITY_DESC'],
			page: 1,
			isAdult: false
		});
		/* if (data) {
			let epArray = []
            const epwiki = await wiki().page(data.title.english);
            const epwikiMedia = await epwiki.html()
			if (epwikiMedia) {
                const s = jquery(epwikiMedia).find('table.wikitable').eq(1).children('tbody').children('tr.vevent').each((e, i) => {
                    return {
                        title: jquery(i).text()
                    }
                })
				if (s) console.log(s)
            }
        } */

		if (
			data &&
			!isEmpty(this.props.profile) &&
			this.props.profile.username &&
			this.props.profile.willLog
		) {
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
						userID: this.props.profile.userID
					}
				})
				.then(() => console.info('Logged!'));
		}

		if (image)
			Vibrant.from(`https://cors-anywhere.herokuapp.com/${image}`).getPalette(
				(err, pal) => {
					if (err) console.error(err);
					if (pal) {
						this.setState(
							{
								hue: pal.DarkMuted && pal.DarkMuted.getHex(),
								hueVib: pal.LightVibrant && pal.LightVibrant.getHex(),
								hueVibN: pal.DarkVibrant && pal.DarkVibrant.getHex(),
								similars
							},
							() => {}
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

			if (similars2) this.setState({ similars2 });
		}
		if (this.state.data)
			this.setState(
				{
					loading: false
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
						return null;
					}
					return false;
				}
			);
	};

	executeTwist = async () => {
		const db = this.props.firebase.ref('twist');
		const dbval = await db.once('value');
		if (dbval && Object(dbval.val())[this.state.id]) {
			const eps = await db.child(this.state.id).once('value');
			if (eps)
				this.setState({ eps: Object.values(eps.val()) }, () =>
					console.info('loaded from database')
				);
			else throw new Error('owo');
		} else if (this.props.mir && this.props.mir.twist) {
			const correctedtitle = this.state.data.Media.title.romaji
				.toLowerCase()
				.replace('(tv)', '')
				.replace('.', '');
			const meta = Object.values(this.props.mir.twist).filter(s =>
				s.name.toLowerCase().match(`${correctedtitle}`)
			);
			console.log(meta);
			if (meta.length > 0) {
				const eps = await Twist.get(meta[0].link);
				try {
					if (eps)
						return this.setState({ eps }, async () => {
							if (meta[0].ongoing === false) {
								const dbtwist = this.props.firebase.ref('twist');
								await dbtwist.child(this.state.id).update(eps);
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
		return false;
	};

	tabChange = (e, val) => this.setState({ tabVal: val });

	play = () => {
		window.scrollTo(0, 0);
		if (
			this.state.data.Media &&
			this.state.data.Media.type.includes('ANIME') &&
			this.state.eps
		) {
			this.props.sendDataToMir({
				eps: this.state.eps,
				meta: this.state.data.Media
			});
			this.props.history.push(`/watch?w=${this.state.data.Media.id}`, {
				meta: this.state.data.Media,
				eps: this.state.eps
			});
		} else
			this.props.history.push(
				`/read?r=${this.state.data.Media.id}`,
				this.state.data.Media
			);
	};

	openEntity = link => {
		this.props.history.push(link);
	};

	atLeave = () => {
		if (this.state.data.Media && this.state.data.Media.trailer) {
			const tbg = document.getElementById('trailerbg');
			tbg.remove();
		}
	};

	like = async () => {
		const data = this.state.data.Media;
		const name = data.title.romaji;
		const image = data.coverImage.large;
		const entity = data.type.includes('ANIME') ? 'show' : 'manga';
		if (!isEmpty(this.props.profile))
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
						bg: data.bannerImage
							? data.bannerImage
							: this.state.hue ? this.state.hue : null,
						avgScore: data.averageScore,
						meanScore: data.meanScore,
						rank: data.rankings.length > 0 ? data.rankings[0] : null
					}
				)
				.then(() => {
					this.setState({ fav: true });
				});
	};

	unlike = async () => {
		const data = this.state.data.Media;
		const entity = data.type.includes('ANIME') ? 'show' : 'manga';
		if (!isEmpty(this.props.profile))
			this.props.firebase
				.remove(`users/${this.props.profile.userID}/favs/${entity}/${data.id}`)
				.then(() => this.setState({ fav: false }));
	};

	addToLater = async () => {
		const data = this.state.data.Media;
		const name = data.title.romaji;
		const image = data.coverImage.large;
		const entity = data.type.includes('ANIME') ? 'show' : 'manga';
		if (!isEmpty(this.props.profile))
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
					bg: data.bannerImage
						? data.bannerImage
						: this.state.hue ? this.state.hue : null,
					avgScore: data.averageScore,
					meanScore: data.meanScore,
					rank: data.rankings.length > 0 ? data.rankings[0] : null
				}
			);
	};

	removeFromLater = async () => {
		const data = this.state.data.Media;
		const entity = data.type.includes('ANIME') ? 'show' : 'manga';
		if (!isEmpty(this.props.profile))
			this.props.firebase.remove(
				`users/${this.props.profile.userID}/later/${entity}/${data.id}`
			);
	};

	reportError = () => this.setState({ reportModal: !this.state.reportModal });
	/* eslint-disable */
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

		const menu = (
			<Menu
				id="more-menu"
				anchorEl={menuEl}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left'
				}}
				MenuListProps={{ style: { padding: 0 } }}
				PaperProps={{ style: { background: hue } }}
				open={openMenu}
				onClose={() => this.setState({ menuEl: null })}
			>
				<MenuItem
					onClick={() => {
						this.setState({ menuEl: null });
						this.reportError();
					}}
				>
					Report error
				</MenuItem>
				<MenuItem onClick={this.editEntry}>Edit entry</MenuItem>
			</Menu>
		);

		return (
			<div className={classes.frame}>
				<LoadingIndicator loading={loading} />
				<div style={loading ? { opacity: 0 } : null}>
					<TitleHeader color={hue} colortext={hueVib} />
				</div>
				<Root
					id="previewFrame"
					className={classes.root}
					style={loading ? { opacity: 0 } : null}
				>
					{data && data.Media ? (
						<div>
							<div
								id="fabShowButton"
								style={window.safari ? { opacity: 1 } : null}
								className={classes.fabContainer}
							>
								<Button
									color="primary"
									disabled={
										data.Media.type.includes('MANGA')
											? false
											: !!(
													data.Media.status.includes('NOT_YET_RELEASED') || !eps
												)
									}
									className={classes.fabPlayButton}
									fab
									style={{ background: hueVibN }}
									onClick={this.play}
								>
									{data.Media.type.includes('MANGA') ? (
										<Icon.Book />
									) : epError ? (
										<Icon.ErrorOutline />
									) : data.Media.status.includes('NOT_YET_RELEASED') || !eps ? (
										<CircularProgress
											size={24}
											style={{ color: hueVib }}
											className={classes.fabProgress}
										/>
									) : (
										<Icon.PlayArrow />
									)}
								</Button>
							</div>
							<Container
								spacing={16}
								id="mainHeader"
								style={{ background: hue }}
							>
								<Header
									image={data.Media.bannerImage ? data.Media.bannerImage : null}
									color={hueVibN}
									style={{ background: hue }}
								/>
								<Grid item xs={3} className={classes.leftSide}>
									<div
										role="play-show"
										aria-controls="button"
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
										onKeyDown={this.handleKeyDown}
									>
										<img
											src={data.Media.coverImage.large}
											alt=""
											className={classes.artworkimg}
											style={{ opacity: 0 }}
											onLoad={e => (e.currentTarget.style.opacity = null)}
										/>
										<CircularProgress
											className={classes.loadingArtwork}
											style={
												data.Media.type.includes('MANGA')
													? { opacity: 0 }
													: eps
														? { opacity: 0 }
														: epError ? { opacity: 0 } : null
											}
										/>
										<Typography className="artworktitle" type="display1">
											{data.Media.status.includes('NOT_YET_RELEASED') ? (
												'TBA'
											) : data.Media.type.includes('MANGA') ? (
												<Icon.Book
													style={{ color: hue }}
													className={classes.playArtworkButton}
												/>
											) : eps ? (
												<Icon.PlayArrow
													style={{ color: hue }}
													className={classes.playArtworkButton}
												/>
											) : epError ? (
												'Not avaliable'
											) : null}
										</Typography>

										<Typography
											className={classes.artworktype}
											style={{ background: hue }}
											type="display1"
										>
											{data.Media.status
												.replace('RELEASING', 'ONGOING')
												.replace(/_/gi, ' ')}{' '}
											{data.Media.type} <br />
											{data.Media.nextAiringEpisode
												? `${timeFormatter(
														data.Media.nextAiringEpisode.timeUntilAiring
													)} till Episode ${
														data.Media.nextAiringEpisode.episode
													}`
												: null}
										</Typography>
									</div>
								</Grid>
								<Grid item xs className={classes.mainFrame}>
									<div className={classes.smallTitlebar}>
										{data.Media.type.includes('ANIME') ? (
											<Typography
												className={classes.smallTitle}
												type="display2"
											>
												{data.Media.title.native}{' '}
												{`• ${data.Media.startDate.year}`}{' '}
												{`• ${Math.floor(data.Media.duration / 60)} h ${data
													.Media.duration % 60} min`}
											</Typography>
										) : (
											<Typography
												className={classes.smallTitle}
												type="display2"
											>
												{data.Media.title.native}{' '}
												{`• ${data.Media.startDate.year}`}{' '}
												{`• ${data.Media.chapters} chapters in ${
													data.Media.volumes
												} volumes`}
											</Typography>
										)}
										<div style={{ flex: 1 }} />
										<Typography
											className={classes.smallTitle}
											style={{ cursor: 'pointer' }}
											onClick={() => window.open(data.Media.siteUrl)}
											type="display2"
										>
											Data provided by AniList
										</Typography>
									</div>
									<Typography
										style={
											data.Media.synonyms.length > 0
												? { marginBottom: 0 }
												: null
										}
										className={classes.bigTitle}
										type="display3"
									>
										{data.Media.title.romaji}
									</Typography>
									{data.Media.synonyms.length > 0 ? (
										<Typography
											style={{ marginBottom: 12 }}
											className={classes.smallTitle}
											type="display1"
										>
											Also known as:{' '}
											{data.Media.synonyms.map(s => s).join(', ')}
										</Typography>
									) : null}
									<Divider />
									<Typography
										className={classes.desc}
										type="body1"
										dangerouslySetInnerHTML={{ __html: data.Media.description }}
									/>
									<div style={{ display: 'flex' }}>
										{data.Media.staff.edges.filter(
											s => s.role === 'Director'
										)[0] ? (
											<Typography className={classes.boldD} type="headline">
												Directed by{' '}
											</Typography>
										) : null}
										{data.Media.staff.edges.filter(
											s => s.role === 'Director'
										)[0] ? (
											<Typography className={classes.smallD} type="headline">
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
											</Typography>
										) : null}
										{data.Media.staff.edges.filter(
											s => s.role === 'Original Creator'
										)[0] ? (
											<div className={classes.sepD}>
												<Typography className={classes.boldD} type="headline">
													{data.Media.staff.edges.filter(
														s => s.role === 'Director'
													)[0]
														? 'and written by'
														: 'Written by'}
												</Typography>
												<Typography className={classes.smallD} type="headline">
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
												</Typography>
											</div>
										) : null}
									</div>
									<Divider />
									<Grid container>
										<Grid item xs className={classes.tagBox}>
											<Typography className={classes.tagTitle} type="title">
												Genres
											</Typography>
											<div className={classes.genreRow}>
												{data.Media.genres
													? data.Media.genres.map(o => (
															<Chip
																onClick={() =>
																	this.props.history.push(`/tag?g=${o}`)
																}
																className={classes.tagChip}
																key={o.id}
																label={o}
															/>
														))
													: null}
											</div>
										</Grid>
										<Grid item xs className={classes.tagBox}>
											<Typography className={classes.tagTitle} type="title">
												Tags
											</Typography>
											<div className={classes.genreRow}>
												{data.Media.tags.map(o => (
													<Chip
														onClick={() =>
															this.props.history.push(`/tag?t=${o.id}`)
														}
														className={classes.tagChip}
														key={o.id}
														label={o.name}
													/>
												))}
											</div>
										</Grid>
										{data.Media.type.includes('MANGA') ? null : (
											<Grid item xs className={classes.tagBox}>
												<Typography className={classes.tagTitle} type="title">
													Producers
												</Typography>
												<div className={classes.genreRow}>
													{data.Media.studios.edges.map(o => (
														<Chip
															onClick={() =>
																this.props.history.push(`/tag?s=${o.node.id}`)
															}
															className={classes.tagChip}
															key={o.id}
															label={o.node.name}
														/>
													))}
												</div>
											</Grid>
										)}
									</Grid>
								</Grid>
							</Container>
							<MainCard
								style={
									!data.Media.bannerImage
										? {
												background: hue,
												boxShadow: '0 5px 32px rgba(0,0,0,.2)'
											}
										: { background: hue }
								}
							>
								<CommandoBar style={{ background: hue }}>
									{data.Media.averageScore ? (
										<div className={classes.commandoTextBox}>
											<Typography
												type="title"
												className={classes.commandoText}
												style={{ color: hueVib }}
											>
												{data.Media.averageScore}%
											</Typography>
											<Typography
												type="body1"
												className={classes.commandoTextLabel}
											>
												Average Score
											</Typography>
										</div>
									) : null}
									{data.Media.meanScore ? (
										<div className={classes.commandoTextBox}>
											<Typography type="title" className={classes.commandoText}>
												{data.Media.meanScore}%
											</Typography>
											<Typography
												type="body1"
												className={classes.commandoTextLabel}
											>
												Mean Score
											</Typography>
										</div>
									) : null}
									{data.Media.type.includes('MANGA') ||
									!data.Media.season ? null : (
										<Button
											style={{
												textTransform: 'initial',
												display: 'flex',
												flexDirection: 'column'
											}}
											onClick={() =>
												window.open(
													`http://anichart.net/${`${data.Media.season.toLowerCase()}-${
														data.Media.startDate.year
													}`}`
												)
											}
											className={classes.commandoTextBox}
										>
											<Typography type="title" className={classes.commandoText}>
												{data.Media.season &&
													`${data.Media.season} ${data.Media.startDate.year}`}
											</Typography>
										</Button>
									)}
									{data.Media.type.includes('MANGA') ||
									data.Media.format.includes('ONA') ||
									data.Media.format.includes('OVA') ? null : !eps &&
									!epError ? (
										<CircularProgress
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
												<Typography
													type="body1"
													className={classes.commandoTextLabel}
												>
													Episodes
												</Typography>
											</div>
										</FadeIn>
									) : (
										<FadeIn>
											<div className={classes.commandoTextBox}>
												<Typography
													type="title"
													className={classes.commandoText}
												>
													{eps ? eps.length : '...'}
												</Typography>
												<Typography
													type="body1"
													className={classes.commandoTextLabel}
												>
													Episodes
												</Typography>
											</div>
										</FadeIn>
									)}
									<div style={{ flex: 1 }} />
									{!isEmpty(user) &&
									user.episodeProgress &&
									user.episodeProgress[data.Media.id] ? (
										<div className={classes.progressCon}>
											<Typography
												type="title"
												className={classes.progressTitle}
											>
												Episode {user.episodeProgress[data.Media.id].ep}
											</Typography>
											<LinearProgress
												mode="determinate"
												value={user.episodeProgress[data.Media.id].played * 100}
												classes={{
													primaryColor: classes.progressBar,
													primaryColorBar: classes.progressBarActive
												}}
											/>
											<Typography
												type="body1"
												className={classes.commandoTextLabel}
											>
												Your progress
											</Typography>
										</div>
									) : null}
									<div style={{ flex: 1 }} />
									{data.Media.hashtag ? (
										<Button
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
										</Button>
									) : null}
									{!isEmpty(user) ? (
										<Tooltip
											title={
												data.Media.type.includes('ANIME')
													? user.later &&
														user.later.show &&
														user.later.show[this.state.id]
														? 'Remove from later'
														: 'Add to later'
													: user.later &&
														user.later.manga &&
														user.later.manga[this.state.id]
														? 'Remove from later'
														: 'Add to later'
											}
										>
											<IconButton
												className={classes.commandoButton}
												color="contrast"
												onClick={
													data.Media.type.includes('ANIME')
														? user.later &&
															user.later.show &&
															user.later.show[this.state.id]
															? this.removeFromLater
															: this.addToLater
														: user.later &&
															user.later.manga &&
															user.later.manga[this.state.id]
															? this.removeFromLater
															: this.addToLater
												}
											>
												{data.Media.type.includes('ANIME') ? (
													user.later &&
													user.later.show &&
													user.later.show[this.state.id] ? (
														<Icon.AddCircle />
													) : (
														<Icon.AddCircleOutline />
													)
												) : user.later &&
												user.later.manga &&
												user.later.manga[this.state.id] ? (
													<Icon.AddCircle />
												) : (
													<Icon.AddCircleOutline />
												)}
											</IconButton>
										</Tooltip>
									) : null}
									{!isEmpty(user) ? (
										<Tooltip
											title={fav ? 'Remove from favorites' : 'Add to favorites'}
										>
											<IconButton
												className={classes.commandoButton}
												color="contrast"
												onClick={
													data.Media.type.includes('ANIME')
														? user.favs &&
															user.favs.show &&
															user.favs.show[this.state.id]
															? this.unlike
															: this.like
														: user.favs &&
															user.favs.manga &&
															user.favs.manga[this.state.id]
															? this.unlike
															: this.like
												}
											>
												{fav ? <Icon.Favorite /> : <Icon.FavoriteBorder />}
											</IconButton>
										</Tooltip>
									) : null}
									<IconButton
										aria-owns={openMenu ? 'more-menu' : null}
										aria-haspopup="true"
										onClick={e => this.setState({ menuEl: e.currentTarget })}
										color="contrast"
									>
										<Icon.MoreVert />
									</IconButton>
									{menu}
									<Modal
										aria-labelledby="report-modal"
										aria-describedby="reports"
										open={this.state.reportModal}
										onClose={() => this.setState({ reportModal: false })}
									>
										<Paper
											style={{
												top: '50%',
												left: '50%',
												transform: 'translate(-50%, -50%',
												minHeight: 600,
												minWidth: 900,
												position: 'fixed',
												padding: 24
											}}
										>
											<Typography style={{ fontWeight: 800 }} type="title">
												Report{' '}
												{data.Media.title.english
													? data.Media.title.english
													: data.Media.title.romaji}{' '}
												for errors
											</Typography>
										</Paper>
									</Modal>
								</CommandoBar>
								<CommandoBar disableGutters style={{ background: hue }}>
									<div style={{ flex: 1 }} />
									{data.Media.rankings.map((ran, index) => (
										<Paper className={classes.commandoTextBoxRow}>
											<Typography
												type="title"
												className={classes.commandoTextNumberRow}
												style={{ color: hueVib }}
											>
												#{ran.rank}
											</Typography>
											<Typography
												type="body1"
												className={classes.commandoTextLabelRow}
											>
												{ran.context} {ran.format.replace(/_/gi, ' ')}
												<br />
												{ran.season} {ran.year}
											</Typography>
										</Paper>
									))}
								</CommandoBar>
								<Container>
									<Grid item xs style={{ zIndex: 10 }}>
										{data.Media.characters.edges.length > 0 ? (
											<Typography type="title" className={classes.secTitle}>
												{data.Media.type.includes('ANIME')
													? 'Cast'
													: 'Characters'}
											</Typography>
										) : null}
										{data.Media.characters.edges.length > 0 ? (
											<Grid container className={classes.itemcontainer}>
												{data.Media.characters.edges.map(cast => (
													<PeopleButton
														key={cast.id}
														onClick={() =>
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
															)
														}
														image={
															cast.voiceActors && cast.voiceActors.length > 0
																? cast.voiceActors.filter(
																		j => j.language === 'JAPANESE'
																	)[0]
																	? cast.voiceActors.filter(
																			j => j.language === 'JAPANESE'
																		)[0].image.large
																	: null
																: cast.node.image.large
														}
														actor={
															!!(
																cast.voiceActors && cast.voiceActors.length > 0
															)
														}
														name={{
															first:
																cast.voiceActors && cast.voiceActors.length > 0
																	? cast.voiceActors[0].name.first
																	: cast.node.name.first,
															last:
																cast.voiceActors && cast.voiceActors.length > 0
																	? cast.voiceActors[0].name.last
																	: cast.node.name.last
														}}
														charImg={cast.node.image.large}
														charOnClick={() =>
															this.openEntity(`/fig?c=${cast.node.id}`)
														}
														actor={
															!!(
																cast.voiceActors && cast.voiceActors.length > 0
															)
														}
														role={
															cast.voiceActors && cast.voiceActors.length > 0
																? `as ${
																		cast.node.name.last
																			? `${cast.node.name.first} ${
																					cast.node.name.last
																				}`
																			: cast.node.name.first
																	}`
																: cast.role
														}
													/>
												))}
											</Grid>
										) : null}
										{data.Media.characters.edges.length > 0 ? (
											<Divider />
										) : null}
										<Typography type="title" className={classes.secTitle}>
											Staff
										</Typography>
										<Grid container className={classes.itemcontainer}>
											{data.Media.staff.edges.map(staff => (
												<PeopleButton
													key={staff.id}
													image={staff.node.image.large}
													name={{
														first: staff.node.name.first,
														last: staff.node.name.last
													}}
													role={staff.role}
													onClick={() =>
														this.props.history.push(`/fig?s=${staff.node.id}`)
													}
												/>
											))}
										</Grid>
										<Divider />
										<Typography type="title" className={classes.secTitle}>
											Similar to this one
										</Typography>
										<Grid container className={classes.itemcontainer}>
											{data.Media.relations.edges.map((anime, index) => (
												<CardButton
													key={anime.id}
													image={anime.node.coverImage.large}
													title={
														anime.node.title.english
															? anime.node.title.english
															: anime.node.title.romaji
													}
													subtitle={`${
														anime.node.type
													} ${anime.relationType.replace(/_/gi, ' ')}`}
													onClick={() =>
														this.openEntity(
															`/show?${
																anime.node.type.includes('ANIME') ? 's' : 'm'
															}=${anime.node.id}`
														)
													}
												/>
											))}
											{data.Media.tags.length > 0 &&
												similars &&
												similars.data &&
												similars.data.Page.media.map((anime, index) => (
													<CardButton
														key={anime.id}
														image={anime.coverImage.large}
														title={anime.title.romaji}
														subtitle="SIMILAR"
														onClick={() =>
															this.openEntity(
																`/show?${
																	anime.type.includes('ANIME') ? 's' : 'm'
																}=${anime.id}`
															)
														}
													/>
												))}
											{data.Media.tags.length > 1 &&
												similars2 &&
												similars2.data &&
												similars2.data.Page.media.map((anime, index) => (
													<CardButton
														key={anime.id}
														image={anime.coverImage.large}
														title={anime.title.romaji}
														subtitle="SIMILAR"
														onClick={() =>
															this.openEntity(
																`/show?${
																	anime.type.includes('ANIME') ? 's' : 'm'
																}=${anime.id}`
															)
														}
													/>
												))}
										</Grid>
									</Grid>
								</Container>
							</MainCard>
						</div>
					) : null}
				</Root>
			</div>
		);
	}
}
export const updateMirTitle = title => ({
	type: MIR_SET_TITLE,
	title
});

export const loadPlayer = play => ({
	type: MIR_PLAY_SHOW,
	play
});

const mapPTS = dispatch => ({
	sendTitleToMir: title => dispatch(updateMirTitle(title)),
	sendDataToMir: play => dispatch(loadPlayer(play))
});

export default firebaseConnect()(
	connect(({ firebase: { profile }, mir }) => ({ profile, mir }), mapPTS)(
		withStyles(styles)(Show)
	)
);
