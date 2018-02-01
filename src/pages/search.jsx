import React, { Component } from 'react';
import * as M from 'material-ui';
import * as Icon from 'material-ui-icons';
import Aqua4 from '../assets/Ripple.mp4';

import Segoku from '../utils/segoku/segoku';
import Twist from '../twist-api';

import corrector from '../utils/bigfuck';

import queryString from 'query-string'

import localForage from 'localforage';

import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import searchQuery, {
	searchStaffQuery,
	searchCharQuery,
	searchStudiosQuery,
} from '../utils/searchquery';
import { LoadingIndicator, TitleHeader, Header } from '../components/layouts';
import CardButton from "../components/cardButton";
import * as Vibrant from "node-vibrant/";

const style = theme => ({
	container: {
		marginLeft: 'auto',
		marginRight: 'auto',
		maxWidth: 1600,
		margin: 'auto',
	},
	root: {
		height: '100%',
		width: '100%',
		position: 'relative',
		transition: theme.transitions.create(['all']),
		marginLeft: 'auto',
		marginRight: 'auto',
		padding: 24,
		maxWidth: 1600,
		paddingLeft: 'env(safe-area-inset-left)',
		paddingRight: 'env(safe-area-inset-right)',
		boxSizing: 'border-box',
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
	},
	content: {
		marginTop: theme.spacing.unit * 8
	},
	header: {
		position: 'relative',
		margin: 'auto',
		paddingTop: theme.spacing.unit * 3,
	},
	title: {
		color: 'white',
		fontSize: 64,
		fontWeight: 700,
		textShadow: '0 3px 16px rgba(0,0,0,.4)',
		position: 'absolute',
		bottom: -theme.spacing.unit * 2,
		padding: theme.spacing.unit,
		textAlign: 'center',
		margin: 'auto',
		left: -theme.spacing.unit * 8,
	},
	icon: {
		boxShadow: '0 1px 12px rgba(0,0,0,.2)',
		color: 'white',
		height: 92,
		width: 92,
		zIndex: -1,
		background: 'linear-gradient(to top, #9900ff 0%, #ff00ff 70%)',
		borderRadius: '50%',
		padding: theme.spacing.unit * 2,
	},
	searchContainer: {
		flexGrow: 1,
		position: 'relative',
		width: 700,
	},
	suggestionsContainerOpen: {
		position: 'absolute',
		marginTop: theme.spacing.unit,
		marginBottom: theme.spacing.unit * 3,
		left: 0,
		right: 0,
	},
	suggestion: {
		display: 'block',
	},
	suggestionsList: {
		margin: 0,
		padding: 0,
		listStyleType: 'none',
	},
	textField: {
		width: '100%',
		padding: 0,
		'label + &': {
			marginTop: theme.spacing.unit * 3,
		},
	},
	input: {
		padding: theme.spacing.unit * 2,
		width: '100%',
		transition: theme.transitions.create(['all']),
		'&:focus': {
			boxShadow: '0 1pt 0.2rem rgba(0,0,0,.25)',
		},
		boxSizing: 'border-box',
	},
	searchBar: {
		marginTop: theme.spacing.unit * 8,
	},
	textInput: {
		borderRadius: 4,
		fontSize: 20,
		padding: theme.spacing.unit,
		textAlign: 'center',
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
	entityContext: {
		'&:last-child': {
			paddingBottom: 12,
		},
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
	secTitle: {
		padding: theme.spacing.unit,
		fontWeight: 700,
		fontSize: 22,
		zIndex: 'inherit',
		paddingBottom: theme.spacing.unit * 2,
	},
	secTitleSmall: {
		padding: theme.spacing.unit,
		fontSize: 16,
		zIndex: 'inherit',
		color: 'rgba(255,255,255,.5)',
		paddingBottom: theme.spacing.unit * 2,
	},
	fillImg: {
		height: '100%',
		width: '100%',
		objectFit: 'cover',
		background: 'white',
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
	loading: {
		height: '100%',
		width: '100%',
		zIndex: -5,
		position: 'fixed',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%,-50%)',
		padding: 0,
		margin: 'auto',
		transition: theme.transitions.create(['all']),
	},
	commandoBar: {
		width: '100%',
		padding: theme.spacing.unit,
		display: 'inline-flex',
		boxSizing: 'border-box',
		background: '#222',
		boxShadow: '0 3px 18px rgba(0,0,0,.1)',
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
		fontSize: 10,
		textAlign: 'center',
		color: 'rgba(255,255,255,.8)',
	},
	cox: {
		transition: theme.transitions.create(['all']),
	},
});

class Search extends Component {
	state = {
		searchVal: '',
		loading: true,
		data: [],
		users: null,
		hue: '#111',
		hueVib: '#0066ff',
		hueVibN: '#111'
	};

	componentDidMount = async () => {
		/*const prevSearch = await localForage.getItem('prevSearch');
		if (prevSearch)
			this.setState(prevSearch, () =>
				this.setState({ loading: false })
			);*/

		if (this.props.history.location.search) {
            let parsed = queryString.parse(this.props.history.location.search)
            this.setState({searchVal: parsed.q}, () => this.uwu())
        } else
			this.setState({ loading: false });
	};


    componentWillReceiveProps = (nextProps) => {
		if (nextProps.history.location.search) {
            let parsed = queryString.parse(nextProps.history.location.search)
            this.setState({searchVal: parsed.q}, () => this.uwu())
		}
    }


    uwu = () =>
		this.setState(
			{
				data: null,
				characters: null,
				staff: null,
				studios: null,
				users: null,
				loading: true,
			},
			async () => {
				const { data } = await new Segoku().customQuery(searchQuery, {
					search: this.state.searchVal,
					isAdult: false,
					page: 1,
				});

				const characters = await new Segoku().customQuery(searchCharQuery, {
					search: this.state.searchVal,
					page: 1,
				});

				const staff = await new Segoku().customQuery(searchStaffQuery, {
					search: this.state.searchVal,
					page: 1,
				});

				const studios = await new Segoku().customQuery(searchStudiosQuery, {
					search: this.state.searchVal,
					page: 1,
				});

				const users = await this.props.firebase
					.database()
					.ref('users')
					.once('value');

				if (
					data &&
					characters &&
					staff &&
					studios &&
					users &&
					this.props.mir &&
					this.props.mir.twist
				) {
					console.log(
						data.Page.media
							.filter(s => s.type === 'ANIME')
							.filter(s => s.title.romaji)
							.filter(d =>
								this.props.mir.twist.filter(s => s.name.match(d.title.romaji))
							)
					);
					this.setState({
						anime: data.Page.media
							.filter(s => s.type === 'ANIME')
							.filter(s => s.title.romaji),
						manga: data.Page.media.filter(s => s.type === 'MANGA'),
						characters: characters,
						staff: staff,
						studios: studios,
						users: Object.values(users.val())
							.filter(s => s.username)
							.filter(s =>
								s.username
									.toLowerCase()
									.match(`${this.state.searchVal.toLowerCase()}`)
							),
						loading: false,
					}, () => this.getColor());
				}
			}
		);


	getColor = () => {
		if (this.state.anime.length > 0)
		Vibrant.from('https://cors-anywhere.herokuapp.com/' + this.state.anime[0].coverImage.medium).getPalette(
            (err, pal) => {
                if (pal) {
                    this.setState(
                        {
                            hue: pal.DarkMuted.getHex(),
                            hueVib: pal.LightVibrant && pal.LightVibrant.getHex(),
                            hueVibN: pal.DarkVibrant && pal.DarkVibrant.getHex(),
                        }
                    );
                }
            }
        );
    }

	openEntity = link => {
		this.props.history.push(link);
	};

	handleChange = e => {
		this.setState({
			searchVal: e.target.value,
		});
	};

	handleSubmit = async e => {
		e.preventDefault();
		if (this.state.searchVal.length > 3) this.uwu();
	};

	componentWillUnmount = async () =>
		 typeof this.state.searchVal !== undefined && this.state.searchVal.length > 3 && this.state.searchVal !== ''
			? await localForage.setItem('prevSearch', this.state)
			: null;

	render() {
		const { classes, user, history, meta, twist } = this.props;
		const {
			searchVal,
			loading,
			anime,
			manga,
			characters,
			staff,
			studios,
			users,
			hue,
			hueVibN,
			hueVib
		} = this.state;
		return (
			<div>
				<LoadingIndicator
					loading={loading}
				/>
				<TitleHeader color={hue} colortext={hueVib} />
				<div className={classes.root}>

					<div className={classes.cox} style={loading ? { opacity: 0 } : null}>
						<Header color={hueVibN} />
						<M.Grid container spacing={0} className={classes.content}>
							{anime &&
								anime.length > 0 &&
								this.props.mir &&
								this.props.mir.twist ? (
									<M.Grid container className={classes.container}>
										<M.Typography type="title" className={classes.secTitle}>
											Anime
									</M.Typography>
										<M.Grid container className={classes.itemcontainer}>
											{anime
												? anime
													.filter(d =>
														this.props.mir.twist.filter(s =>
															s.name.match(d.title.romaji)
														)
													)
													.map((anime, index) => (
													    <CardButton key={index} title={anime.title.romaji} image={anime.coverImage.large} onClick={() =>
                                                            this.openEntity(`/show?s=${anime.id}`)
                                                        }/>

													))
												: null}
										</M.Grid>
									</M.Grid>
								) : null}
							{manga && manga.length > 0 ? (
								<M.Grid container className={classes.container}>
									<M.Typography type="title" className={classes.secTitle}>
										Manga
									</M.Typography>
									<M.Grid container className={classes.itemcontainer}>
										{manga
											? manga.map((anime, index) => (
												<M.Grid
													className={classes.entityCard}
													item
													xs
													key={index}
												>
													<M.Card
														style={{ background: 'transparent' }}
														onClick={() =>
															this.openEntity(`/show?m=${anime.id}`)
														}
													>
														<div className={classes.gradientCard}>
															<M.CardMedia
																className={classes.entityImage}
																image={anime.coverImage.large}
															/>
														</div>
														<M.Typography
															type="headline"
															className={classes.entityTitle}
														>
															{anime.title.romaji}
														</M.Typography>
														<M.Typography
															type="headline"
															className={classes.entitySubTitle}
														/>
													</M.Card>
												</M.Grid>
											))
											: null}
									</M.Grid>
								</M.Grid>
							) : null}
							{characters && characters.data.Page.characters.length > 0 ? (
								<M.Grid container className={classes.container}>
									<M.Typography type="title" className={classes.secTitle}>
										Characters
									</M.Typography>
									<M.Grid container className={classes.itemcontainer}>
										{characters
											? characters.data.Page.characters.map((anime, index) => (
												<M.Grid
													className={classes.peopleCard}
													item
													xs
													key={index}
												>
													<M.Card
														style={{
															background: 'transparent',
															boxShadow: 'none',
														}}
														onClick={() =>
															this.props.history.push(`/fig?c=${anime.id}`)
														}
													>
														<M.Avatar
															className={classes.peopleImage}
															classes={{ img: classes.fillImg }}
															src={anime.image.large}
														/>
														<M.Typography
															type="headline"
															className={classes.peopleTitle}
														>
															{anime.name.last
																? anime.name.first + ' ' + anime.name.last
																: anime.name.first}
														</M.Typography>
													</M.Card>
												</M.Grid>
											))
											: null}
									</M.Grid>
								</M.Grid>
							) : null}
							{staff && staff.data.Page.staff.length > 0 ? (
								<M.Grid container className={classes.container}>
									<M.Typography type="title" className={classes.secTitle}>
										Staff & Actors
									</M.Typography>
									<M.Grid container className={classes.itemcontainer}>
										{staff
											? staff.data.Page.staff.map((anime, index) => (
												<M.Grid
													className={classes.peopleCard}
													item
													xs
													key={index}
												>
													<M.Card
														style={{
															background: 'transparent',
															boxShadow: 'none',
														}}
														onClick={() =>
															this.props.history.push(`/fig?s=${anime.id}`)
														}
													>
														<M.Avatar
															className={classes.peopleImage}
															classes={{ img: classes.fillImg }}
															src={anime.image.large}
														/>
														<M.Typography
															type="headline"
															className={classes.peopleTitle}
														>
															{anime.name.last
																? anime.name.first + ' ' + anime.name.last
																: anime.name.first}
														</M.Typography>
													</M.Card>
												</M.Grid>
											))
											: null}
									</M.Grid>
								</M.Grid>
							) : null}
							{studios && studios.data.Page.studios.length > 0 ? (
								<M.Grid container className={classes.container}>
									<M.Typography type="title" className={classes.secTitle}>
										Studios
									</M.Typography>
									<M.Grid container className={classes.itemcontainer}>
										{studios
											? studios.data.Page.studios.map((anime, index) => (
												<M.Grid
													className={classes.entityCard}
													item
													xs
													key={index}
												>
													<M.Card
														style={{ background: 'transparent' }}
														onClick={() =>
															this.props.history.push(`/studio?s=${anime.id}`)
														}
													>
														<div className={classes.gradientCard} />
														<M.Typography
															type="headline"
															className={classes.entityTitle}
														>
															{anime.name}
														</M.Typography>
													</M.Card>
												</M.Grid>
											))
											: null}
									</M.Grid>
								</M.Grid>
							) : null}
							{users && users.length > 0 ? (
								<M.Grid container className={classes.container}>
									<M.Typography type="title" className={classes.secTitle}>
										Users
									</M.Typography>
									<M.Grid container className={classes.itemcontainer}>
										{users
											? users.map((user, index) => (
												<M.Grid
													className={classes.peopleCard}
													item
													xs
													key={index}
												>
													<M.Card
														style={{
															background: 'transparent',
															boxShadow: 'none',
														}}
														onClick={() =>
															this.props.history.push(
																`/user${
																this.props.profile
																	? user.userID ===
																		this.props.profile.userID
																		? ``
																		: `?u=${user.userID}`
																	: `?u=${user.userID}`
																}`
															)
														}
													>
														<M.Avatar
															className={classes.peopleImage}
															classes={{ img: classes.fillImg }}
															src={user.avatar}
														/>
														<M.Typography
															type="headline"
															className={classes.peopleTitle}
														>
															{user.username}
														</M.Typography>
													</M.Card>
												</M.Grid>
											))
											: null}
									</M.Grid>
								</M.Grid>
							) : null}
						</M.Grid>
					</div>
				</div>
			</div>
		);
	}
}

export default firebaseConnect()(
	connect(({ firebase: profile, mir }) => ({ profile, mir }))(
		M.withStyles(style)(Search)
	)
);
