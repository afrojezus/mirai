// TODO: Fix every single eslint-airbnb issue
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import localForage from 'localforage';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import MenuItem from 'material-ui/Menu/MenuItem';
import Card, {
	CardContent,
	CardMedia,
	CardHeader,
	CardActions,
} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Dotdotdot from 'react-dotdotdot';

import PlusOneIcon from 'material-ui-icons/PlusOne';
import Button from 'material-ui/Button';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import ShareIcon from 'material-ui-icons/Share';
import { Menu } from 'material-ui';
import ArrowForward from 'material-ui-icons/ArrowForward';
import ArrowBack from 'material-ui-icons/ArrowBack';

import { firebaseConnect, isEmpty, firebase } from 'react-redux-firebase';

import { blue, grey } from 'material-ui/colors';

import Snackbar from 'material-ui/Snackbar';
import CloseIcon from 'material-ui-icons/Close';

import CircularProgress from 'material-ui/Progress/CircularProgress';

import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Vibrant from 'node-vibrant';

import CardButton from '../components/cardButton';
import {
	Container,
	Root,
	Header,
	LoadingIndicator,
	TitleHeader,
} from '../components/layouts';
import SuperTable from '../components/supertable';

import Segoku from '../utils/segoku/segoku';

import Twist from '../twist-api';
import miraiIcon from '../assets/mirai-icon.png';
import { history } from '../store';

const styles = theme => ({
	root: {
		paddingTop: theme.spacing.unit * 8,
	},
	container: {
		marginLeft: 'auto',
		marginRight: 'auto',
		padding: 24,
		maxWidth: 1600,
		paddingLeft: 'env(safe-area-inset-left)',
		paddingRight: 'env(safe-area-inset-right)',
	},
	itemContainer: {
		margin: theme.spacing.unit,
	},
	bgImage: {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		opacity: 0.1,
		height: '100vh',
		objectFit: 'cover',
		width: '100%',
		zIndex: -1,
		transition: theme.transitions.create(['all']),
	},
	topHeader: {
		width: '100%',
		maxHeight: 520,
		position: 'relative',
		margin: 'auto',
		transition: theme.transitions.create(['all']),
	},
	topHeaderBig: {
		width: '100%',
		maxHeight: 520,
		position: 'relative',
		margin: 'auto',
		transition: theme.transitions.create(['all']),
		background: 'black',
		paddingTop: theme.spacing.unit * 12,
	},
	cardBg: {
		objectFit: 'cover',
		height: '100%',
		width: '100%',
		position: 'absolute',
		textIndent: -999,
		top: 0,
		left: 0,
		zIndex: 0,
	},
	cardContent: {
		textAlign: 'center',
		height: '100%',
		zIndex: 2,
		display: 'flex',
		background: grey[800],
	},
	divide: {
		width: '100%',
		marginTop: 24,
		marginBottom: 24,
	},
	spacer: {
		flex: 1,
	},
	headline: {
		margin: 'auto',
	},
	headlineTitle: {
		marginBottom: 24,
		fontSize: 48,
		fontWeight: 800,
	},
	fullWidth: {
		width: '100%',
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
			background: blue.A200,
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
	likeCount: {},
	cardColor: {},
	snackBar: {
		position: 'fixed',
		marginTop: 64,
	},
	avatar: {
		marginLeft: -theme.spacing.unit * 4,
		height: 82,
		width: 82,
		boxShadow: '0 3px 16px rgba(0,0,0,.5)',
	},
	frame: {
		transition: theme.transitions.create(['all']),
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
	bigCard: {
		margin: theme.spacing.unit * 3,
		padding: theme.spacing.unit * 2,
		display: 'flex',
		boxShadow: '0 2px 18px rgba(0,0,0,.4)',
		background: 'rgba(255,255,255,0)',
		height: '100%',
		minHeight: '300px !important',
		width: '100%',
		boxSizing: 'border-box',
		transition: theme.transitions.create(['all']),
		'&:last-child': {
			marginRight: theme.spacing.unit * 9,
		},
		'&:first-child': {
			marginLeft: theme.spacing.unit * 9,
		},
		position: 'relative',
		'&:hover': {
			background: `rgba(0,55,230,.3)`,
		},
		'&:hover > div:nth-of-type(2) > img': {
			zIndex: 200,
			boxShadow: `0 2px 14px rgba(0,55,230,.3)`,
			borderColor: blue.A200,
		},
	},
	bigCardIcon: {
		background: 'white',
		zIndex: 4,
		width: 156,
		height: 228,
		boxShadow: '0 3px 24px rgba(0,0,0,.6)',
		objectFit: 'cover',
		marginRight: theme.spacing.unit * 2,
		transition: theme.transitions.create(['all']),
		border: '8px solid transparent',
		'&:hover': {
			filter: 'brightness(0.8)',
		},
	},
	bigCardImage: {
		position: 'absolute',
		height: '100%',
		width: '100%',
		objectFit: 'cover',
		top: 0,
		left: 0,
		display: 'inline-block',
		background: 'linear-gradient(to top, rgba(0,0,0,.7), transparent)',
	},
	bigCardImageImg: {
		position: 'relative',
		height: '100%',
		width: '100%',
		objectFit: 'cover',
		top: 0,
		left: 0,
		zIndex: -1,
		display: 'block',
	},
	bigCardRow: {
		display: 'flex',
		zIndex: 3,
		position: 'absolute',
		width: '100%',
		bottom: -theme.spacing.unit * 2,
		left: -theme.spacing.unit * 2,
	},
	bigCardTitle: {
		zIndex: 3,
		color: 'white',
		fontWeight: 700,
		fontSize: 32,
		textShadow: '0 3px 20px rgba(0,0,0,.87)',
	},
	bigCardText: {
		display: 'flex',
		flexDirection: 'column',
		margin: 'auto 0',
	},
	bigCardSmallTitle: {
		zIndex: 3,
		color: 'white',
		fontWeight: 400,
		marginTop: theme.spacing.unit,
		lineHeight: 1,
		fontSize: 18,
		textShadow: '0 3px 20px rgba(0,0,0,.7)',
	},
	bigCardVerySmallTitle: {
		zIndex: 3,
		color: 'white',
		fontWeight: 700,
		fontSize: 14,
		textShadow: '0 3px 20px rgba(0,0,0,.7)',
		marginBottom: theme.spacing.unit,
		textTransform: 'uppercase',
	},
});

class Home extends Component {
	state = {
		feeds: null,
		anchorEl: null,
		es: false,
		loading: true,
		ongoing: null,
		rankingMentionable: null,
		hue: '#111',
		hueVib: '#111',
		hueVibN: '#111',
	};

	componentWillMount = () => {};

	componentDidMount = async () => {
		this.feedsObserve();
		this.rankingsObserve();
		this.getColors()
			.then(() => this.fetchOngoing())
			.then(() => this.setState({ loading: false }))
			.catch(error => console.error(error));
		return null;
	};
	componentWillUnmount = () => {};

	getColors = async () => {
		const hues = await localForage.getItem('user-hue');
		if (!isEmpty(this.props.profile) && this.props.profile.headers && !hues)
			Vibrant.from(
				`https://cors-anywhere.herokuapp.com/${this.props.profile.headers}`
			).getPalette((err, pal) => {
				if (pal) {
					return this.setState(
						{
							hue: pal.DarkMuted && pal.DarkMuted.getHex(),
							hueVib: pal.LightVibrant && pal.LightVibrant.getHex(),
							hueVibN: pal.DarkVibrant && pal.DarkVibrant.getHex(),
						},
						async () => {
							await localForage.setItem('user-hue', {
								hue: this.state.hue,
								vib: this.state.hueVib,
								vibn: this.state.hueVibN,
							});
						}
					);
				}
				return null;
			});
		else if (!hues) {
			return this.setState({
				hue: '#002656',
				hueVib: '#1ba0e1',
				hueVibN: '#000b17',
			});
		} else
			return this.setState({
				hue: hues.hue,
				hueVib: hues.vib,
				hueVibN: hues.vibn,
			});
		return null;
	};

	fetchOngoing = async () => {
		const ongoing = await new Segoku().get({
			page: 1,
			isAdult: false,
			sort: ['POPULARITY_DESC'],
			status: 'RELEASING',
		});

		const ongoingM = await new Segoku().getM({
			page: 1,
			isAdult: false,
			sort: ['POPULARITY_DESC'],
			status: 'RELEASING',
		});

		try {
			if (ongoing && ongoingM)
				return this.setState({
					ongoing,
					ongoingM,
				});
		} catch (error) {
			console.error(error);
		}
		return null;
	};

	rankingsObserve = () =>
		this.props.firebase
			.ref('rankings')
			.child('collections')
			.on('value', mentionables =>
				this.setState({
					rankingMentionable: Object.values(mentionables.val()),
				})
			);

	feedsObserve = () =>
		this.props.firebase
			.ref('social')
			.child('public_feed')
			.on('value', feed => this.setState({ feeds: Object.values(feed.val()) }));

	openEntity = link => this.props.changePage(link);

	easterEggOne = () => this.setState({ es: !this.state.es });
	render() {
		const { classes, status } = this.props;
		const {
			feeds,
			anchorEl,
			es,
			loading,
			ongoing,
			ongoingM,
			rankingMentionable,
			hue,
			hueVib,
			hueVibN,
		} = this.state;

		const user = this.props.profile;

		const openFeed = Boolean(anchorEl);
		return (
			<div>
				<LoadingIndicator loading={loading} />
				{!isEmpty(user) && user.headers ? (
					<Header image={user.headers} color={hueVibN} />
				) : null}
				<div className={classes.frame}>
					{/* <div className={classes.topHeaderBig}>
            <Grid container spacing={16} className={classes.container}>
              <Grid item xs className={classes.itemContainer}>
                <Typography type="title" className={classes.headlineTitle}>
                  {user && user.username
                    ? "Welcome to the Mirai Preview Program, " + user.username
                    : "What once started with Y now starts with M."}
                </Typography>
              </Grid>
            </Grid>
          </div> */}
					<TitleHeader
						color={hue}
						title={
							!isEmpty(this.props.profile)
								? `Welcome back, ${this.props.profile.username}.`
								: 'Mirai. Gateway to the future.'
						}
						subtitle="Mirai Preview"
					/>
					<Root>
						<Container hasHeader spacing={16}>
							<div style={{ width: '100%' }}>
								<Grid item xs className={classes.itemContainer}>
									<Typography variant="title" className={classes.headline}>
										Updates
									</Typography>
									<Grid container spacing={16}>
										{feeds ? (
											<SuperTable data={feeds} typeof="feeds" type="f" />
										) : null}
									</Grid>
								</Grid>
							</div>
							<div style={{ width: '100%' }}>
								<Grid
									item
									xs
									className={classes.itemContainer}
									style={{
										flexDirection: 'row',
										display: 'flex',
									}}
								>
									<Typography variant="title" className={classes.headline}>
										Currently ongoing anime
									</Typography>
									<div style={{ flex: 1 }} />
									<Typography variant="title" className={classes.headline}>
										{this.props.mir && this.props.mir.twist
											? `${Object.values(this.props.mir.twist).filter(
													s => s.ongoing === true
												).length - 1} ongoing animes in database`
											: null}
									</Typography>
								</Grid>
								<Grid container className={classes.itemcontainer} spacing={0}>
									{ongoing &&
									ongoing.data &&
									this.props.mir &&
									this.props.mir.twist ? (
										<SuperTable
											data={ongoing.data.Page.media
												.filter(s => s.nextAiringEpisode)
												.filter(d =>
													this.props.mir.twist.filter(s =>
														s.name.match(d.title.romaji)
													)
												)
												.sort(
													(a, b) =>
														a.nextAiringEpisode.timeUntilAiring -
														b.nextAiringEpisode.timeUntilAiring
												)}
											type="s"
											typeof="ongoing"
											limit={12}
										/>
									) : (
										<SuperTable loading />
									)}
								</Grid>
							</div>
							<div style={{ width: '100%' }}>
								<Grid item xs className={classes.itemContainer}>
									<Typography variant="title" className={classes.headline}>
										Currently ongoing manga
									</Typography>
								</Grid>
								<Grid container className={classes.itemcontainer} spacing={0}>
									{ongoingM && ongoingM.data ? (
										<SuperTable
											data={ongoingM.data.Page.media}
											type="m"
											typeof="ongoing"
											limit={12}
										/>
									) : (
										<SuperTable loading />
									)}
								</Grid>
							</div>
							<div style={{ width: '100%' }}>
								<Grid
									item
									xs
									className={classes.itemContainer}
									style={{
										flexDirection: 'row',
										display: 'flex',
									}}
								>
									<Typography variant="title" className={classes.headline}>
										Collections
									</Typography>
									<div style={{ flex: 1 }} />
								</Grid>
								<Grid container className={classes.itemcontainer} spacing={0}>
									{rankingMentionable ? (
										<SuperTable
											data={Object.values(rankingMentionable)}
											type="c"
											typeof="ranking"
											limit={12}
										/>
									) : (
										<SuperTable loading />
									)}
								</Grid>
							</div>
							{!isEmpty(user) && user.episodeProgress ? (
								<div style={{ width: '100%' }}>
									<Grid
										item
										xs
										className={classes.itemContainer}
										style={{
											flexDirection: 'row',
											display: 'flex',
										}}
									>
										<Typography variant="title" className={classes.headline}>
											{"Animes you've watched previously"}
										</Typography>
										<div style={{ flex: 1 }} />
										<Typography variant="title" className={classes.headline}>
											{Object.values(user.episodeProgress).length} animes seen
										</Typography>
										<Button onClick={() => this.props.history.push('/history')}>
											History
										</Button>
									</Grid>
									<Grid container className={classes.itemcontainer} spacing={0}>
										{user.episodeProgress ? (
											<SuperTable
												data={Object.values(user.episodeProgress)
													.filter(s => s.recentlyWatched)
													.sort(
														(a, b) => b.recentlyWatched - a.recentlyWatched
													)}
												limit={24}
												type="s"
												typeof="progress"
											/>
										) : (
											<SuperTable loading />
										)}
									</Grid>
								</div>
							) : null}
							{!isEmpty(user) &&
							user.favs &&
							user.favs.show &&
							user.favs.show ? (
								<div style={{ width: '100%' }}>
									<Grid
										item
										xs
										className={classes.itemContainer}
										style={{
											marginBottom: 0,
											flexDirection: 'row',
											display: 'flex',
										}}
									>
										<Typography variant="title" className={classes.headline}>
											Your anime favorites
										</Typography>
										<div style={{ flex: 1 }} />
										<Typography variant="title" className={classes.headline}>
											{Object.values(user.favs.show).length} anime favourties
										</Typography>
									</Grid>
									<Grid
										container
										className={classes.itemcontainer}
										style={{ marginTop: 24 }}
									>
										{Object.values(user.favs.show)
											.sort((a, b) => a.name - b.name)
											.map(anime => (
												<CardButton
													key={anime.id}
													title={anime.name}
													image={anime.image}
													onClick={() =>
														this.props.history.push(`/show?s=${anime.id}`)
													}
												/>
											))}
									</Grid>
								</div>
							) : null}
						</Container>
					</Root>
				</div>
			</div>
		);
	}
}

export default firebaseConnect()(
	connect(({ firebase: { auth, profile }, mir }) => ({
		auth,
		profile,
		mir,
	}))(withStyles(styles)(Home))
);
