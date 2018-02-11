/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import * as Icon from 'material-ui-icons';
import Dotdotdot from 'react-dotdotdot';
import Slider from 'react-slick';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import GridList from 'material-ui/GridList/GridList';
import GridListTile from 'material-ui/GridList/GridListTile';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import moment from 'moment';
import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography/Typography';
import FadeIn from 'react-fade-in';
import Button from 'material-ui/Button/Button';

const style = theme => ({
	bigCard: {
		display: 'flex',
		'& > div': {
			width: '100%',
			boxShadow: '0 2px 18px rgba(0,0,0,.4)',
			background: 'rgba(255,255,255,0)',
			boxSizing: 'border-box',
			transition: theme.transitions.create(['all']),
			position: 'relative',
			overflow: 'hidden',
			cursor: 'default',
			'&:hover': {
				background: `rgba(0,55,230,.3)`,
			},
			'&:hover > div:nth-of-type(2) > img': {
				zIndex: 200,
				margin: theme.spacing.unit * 2,
			},
			margin: 'auto',
		},
		overflowX: 'hidden',
		animation: 'loadIn .5s ease',
	},
	bigCardStill: {
		display: 'flex',
		'& > div': {
			width: '100%',
			boxShadow: '0 2px 18px rgba(0,0,0,.4)',
			background: 'rgba(255,255,255,0)',
			boxSizing: 'border-box',
			transition: theme.transitions.create(['all']),
			position: 'relative',
			overflow: 'hidden',
			cursor: 'default',
			margin: 'auto',
		},
		overflowX: 'hidden',
	},
	bigCardIcon: {
		background: 'white',
		zIndex: 4,
		width: 182,
		boxShadow: '0 3px 24px rgba(0,0,0,.6)',
		objectFit: 'cover',
		marginRight: theme.spacing.unit * 2,
		transition: theme.transitions.create(['all']),
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
		background: 'rgba(0,0,0,.7)',
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
		margin: 'auto',
		height: '100%',
	},
	bigCardRowFlex: {
		display: 'flex',
		zIndex: 3,
		width: '100%',
		margin: 'auto',
		height: '100%',
	},
	bigCardTitle: {
		zIndex: 3,
		color: 'white',
		fontWeight: 700,
		fontSize: 32,
		textShadow: '0 3px 20px rgba(0,0,0,.87)',
		userSelect: 'none',
		cursor: 'default',
	},
	bigCardText: {
		display: 'flex',
		flexDirection: 'column',
		margin: 'auto 0',
		userSelect: 'none',
		cursor: 'default',
	},
	bigCardTextFlex: {
		display: 'flex',
		flexDirection: 'column',
		margin: 'auto',
		width: '100%',
		userSelect: 'none',
		cursor: 'default',
		marginLeft: theme.spacing.unit * 3,
		zIndex: 3,
	},
	bigCardSmallTitle: {
		zIndex: 3,
		color: 'white',
		fontWeight: 400,
		marginTop: theme.spacing.unit,
		lineHeight: 1,
		fontSize: 18,
		textShadow: '0 3px 20px rgba(0,0,0,.7)',
		userSelect: 'none',
		cursor: 'default',
	},
	bigCardVerySmallTitle: {
		zIndex: 3,
		color: 'white',
		fontWeight: 700,
		fontSize: 14,
		textShadow: '0 3px 20px rgba(0,0,0,.7)',
		marginBottom: theme.spacing.unit,
		textTransform: 'uppercase',
		userSelect: 'none',
		cursor: 'default',
	},
	bigCardVerySmallTitleFlex: {
		zIndex: 3,
		color: 'white',
		fontWeight: 700,
		fontSize: 14,
		margin: 'auto',
		textShadow: '0 3px 20px rgba(0,0,0,.7)',
		marginBottom: theme.spacing.unit,
		textTransform: 'uppercase',
		userSelect: 'none',
		cursor: 'default',
	},
	dotdot: {
		overflow: 'initial !important',
	},
	list: {
		flexFlow: 'row nowrap',
		width: '100%',
		margin: 0,
		paddingTop: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 2,
		transform: 'translateZ(0)',
		'&:webkit-scrollbar': {
			display: 'none',
		},
	},
	listContainer: {
		width: '100%',
		position: 'relative',
		'&:hover > button': {
			opacity: 1,
		},
	},
	bakA: {
		position: 'absolute',
		left: '0',
		top: 'calc(50% + 8px)',
		transform: 'translate(-50%,-50%)',
		zIndex: '5',
		opacity: 0,
		transition: theme.transitions.create(['all']),
		background: 'white',
	},
	forA: {
		position: 'absolute',
		right: '0',
		top: 'calc(50% + 8px)',
		transform: 'translate(25%,-50%)',
		zIndex: '5',
		opacity: 0,
		transition: theme.transitions.create(['all']),
		background: 'white',
	},
	bigCardSmallIcon: {
		width: 32,
		height: 32,
		objectFit: 'cover',
		borderRadius: '50%',
		margin: 'auto',
	},
});

export const timeFormatter = time => {
	const secNum = parseInt(time, 10); // don't forget the second param
	let hours = Math.floor(secNum / 3600);
	let minutes = Math.floor((secNum - hours * 3600) / 60);
	let seconds = secNum - hours * 3600 - minutes * 60;
	let days = Math.floor(secNum / (3600 * 24));

	if (hours < 10) {
		hours = `0${hours}`;
	}
	if (hours === '00') {
		hours = null;
	}
	if (minutes < 10) {
		minutes = `0${minutes}`;
	}
	if (seconds < 10) {
		seconds = `0${seconds}`;
	}
	if (days === 0) {
		days = null;
	}

	return `${(days ? days + (days > 1 ? ' days ' : ' day ') : '') +
		(hours ? `${hours} hr ` : '') +
		minutes} min`;
};

export const timeFormatToReadable = time => new Date(time).toDateString();

export const timeFormatToReadableTime = time =>
	new Date(time).toLocaleTimeString();

const nullarray = [{ i: 0 }, { i: 1 }, { i: 2 }];

const SuperTable = class extends React.Component {
	static defaultProps = {
		limit: 18,
		loading: false,
		data: [],
	};

	constructor(props) {
		super(props);
		this.state = {};
	}

	goBack = e => {};

	goFor = e => {};

	shouldComponentUpdate = nextProps => {
		if (this.props.data !== nextProps.data) {
			return true;
		}
		return false;
	};

	render() {
		const { classes, theme, loading, data, ...props } = this.props;
		const backArrow = (
			<Button onClick={this.goBack} className={classes.bakA} variant="fab">
				<Icon.ArrowBack />
			</Button>
		);
		const forwardArrow = (
			<Button onClick={this.goFor} className={classes.forA} variant="fab">
				<Icon.ArrowForward />
			</Button>
		);
		if (loading) {
			return (
				<div className={classes.listContainer}>
					<GridList
						id="nulllist"
						className={classes.list}
						cols={[theme.breakpoint.up('md')] ? 3 : 2}
						cellHeight={300}
					>
						{nullarray.map(o => (
							<GridListTile className={classes.bigCardStill} key={o.i}>
								<div className={classes.bigCardImage} />
								<div className={classes.bigCardRow}>
									<CircularProgress
										style={{
											color: 'white',
											position: 'absolute',
											top: '50%',
											left: '50%',
											transform: 'translate(-50%,-50%)',
										}}
									/>
								</div>
							</GridListTile>
						))}
					</GridList>
				</div>
			);
		}
		if (props.typeof === 'later') {
			return (
				<div className={classes.listContainer}>
					{backArrow}
					{forwardArrow}
					<GridList
						id={props.type.includes('m') ? 'mangalaterlist' : 'animelaterlist'}
						className={classes.list}
						cols={[theme.breakpoint.up('md')] ? 3 : 2}
						cellHeight={300}
					>
						{data.splice(0, props.limit).map(anime => (
							<GridListTile
								className={classes.bigCard}
								key={anime.id}
								onClick={() =>
									props.changePage(`/show?${props.type}=${anime.id}`)
								}
							>
								<div
									className={classes.bigCardImage}
									style={
										anime.bg
											? anime.bg.startsWith('#')
												? { background: anime.bg }
												: null
											: null
									}
								>
									{anime.bg && !anime.bg.startsWith('#') ? (
										<img
											src={
												anime.bg
													? anime.bg.startsWith('#') ? '' : anime.bg
													: ''
											}
											alt=""
											className={classes.bigCardImageImg}
										/>
									) : null}
								</div>
								<div className={classes.bigCardRow}>
									<img
										src={anime.image}
										alt=""
										className={classes.bigCardIcon}
									/>
									<div className={classes.bigCardText}>
										<Typography
											variant="display2"
											className={classes.bigCardVerySmallTitle}
										>
											{anime.avgScore
												? `Score ${anime.avgScore}%`
												: `Score ${anime.meanScore}%`}{' '}
											{anime.rank
												? `• #${`${anime.rank.rank} ${anime.rank.context} ${
														anime.rank.format
													}`}`
												: null}
										</Typography>
										<Dotdotdot clamp={2} className={classes.dotdot}>
											<Typography
												variant="display2"
												className={classes.bigCardTitle}
											>
												{anime.name}
											</Typography>
											<Typography
												variant="display2"
												className={classes.bigCardSmallTitle}
											>
												Added {moment(anime.date).from(Date.now())}
											</Typography>
										</Dotdotdot>
									</div>
								</div>
							</GridListTile>
						))}
					</GridList>
				</div>
			);
		} else if (props.typeof === 'ranking') {
			return (
				<div className={classes.listContainer}>
					{backArrow}
					{forwardArrow}
					<GridList
						id={props.type.includes('c') ? 'collectionlist' : 'rankinglist'}
						className={classes.list}
						cols={[theme.breakpoint.up('md')] ? 3 : 2}
						cellHeight={300}
					>
						{data.splice(0, props.limit).map(collection => (
							<GridListTile
								className={classes.bigCard}
								key={collection.id}
								onClick={() =>
									props.changePage(`/rankings?${props.type}=${collection.id}`)
								}
							>
								<div className={classes.bigCardImage}>
									<img
										src={collection.bg}
										alt=""
										className={classes.bigCardImageImg}
									/>
								</div>
								<div className={classes.bigCardRow}>
									<img
										src={collection.image}
										alt=""
										className={classes.bigCardIcon}
									/>
									<div className={classes.bigCardText}>
										<Typography
											variant="display2"
											className={classes.bigCardVerySmallTitle}
										>
											<span role="img" aria-label="emoji">
												{collection.emoji}
											</span>
											{collection.category}
										</Typography>
										<Dotdotdot clamp={2} className={classes.dotdot}>
											<Typography
												variant="display2"
												className={classes.bigCardTitle}
											>
												{collection.name}
											</Typography>
										</Dotdotdot>
										<Dotdotdot clamp={3}>
											<Typography
												variant="display2"
												className={classes.bigCardSmallTitle}
											>
												{collection.desc}
											</Typography>
										</Dotdotdot>
									</div>
								</div>
							</GridListTile>
						))}
					</GridList>
				</div>
			);
		} else if (props.typeof === 'progress') {
			return (
				<div className={classes.listContainer}>
					{backArrow}
					{forwardArrow}
					<GridList
						id="progresslist"
						className={classes.list}
						cols={[theme.breakpoint.up('md')] ? 3 : 2}
						cellHeight={300}
					>
						{data.splice(0, props.limit).map((anime, index) => (
							<GridListTile
								className={classes.bigCard}
								key={index}
								onClick={() =>
									props.changePage(
										`/show?${props.type}=${
											props.typeof === 'progress'
												? anime.anime ? anime.anime.meta.i : anime.showId
												: anime.id
										}`
									)
								}
							>
								<div className={classes.bigCardImage}>
									<img
										src={
											props.typeof === 'ongoing'
												? anime.bannerImage
													? anime.bannerImage
													: anime.coverImage.large
												: props.typeof === 'ranking'
													? anime.bg
													: props.typeof === 'progress'
														? anime.anime
															? anime.anime.meta.a
															: anime.showHeaders
																? anime.showHeaders
																: anime.showArtwork
														: props.typeof === 'favs' ? anime.image : null
										}
										alt=""
										className={classes.bigCardImageImg}
									/>
								</div>
								<div className={classes.bigCardRow}>
									<img
										src={
											props.typeof === 'ongoing'
												? anime.coverImage.large
												: props.typeof === 'ranking'
													? anime.bg
													: props.typeof === 'progress'
														? anime.anime
															? anime.anime.meta.a
															: anime.showArtwork
														: props.typeof === 'favs' ? anime.image : null
										}
										alt=""
										className={classes.bigCardIcon}
									/>
									<div className={classes.bigCardText}>
										<Typography
											variant="display2"
											className={classes.bigCardVerySmallTitle}
										>
											{props.typeof === 'ranking' ? (
												<span role="img" aria-label="emoji">
													{anime.emoji}
												</span>
											) : null}
											{props.typeof === 'ongoing'
												? props.type.includes('m')
													? null
													: `${timeFormatter(
															anime.nextAiringEpisode.timeUntilAiring
														)} till Episode ${anime.nextAiringEpisode.episode}`
												: props.typeof === 'ranking'
													? anime.category
													: props.typeof === 'progress'
														? anime.ep ? `EPISODE ${anime.ep}` : null
														: null}
										</Typography>
										<Dotdotdot clamp={2} className={classes.dotdot}>
											<Typography
												variant="display2"
												className={classes.bigCardTitle}
											>
												{props.typeof === 'ongoing'
													? anime.title.romaji
													: props.typeof === 'ranking'
														? anime.name
														: props.typeof === 'progress'
															? anime.anime ? anime.anime.meta.r : anime.title
															: props.typeof === 'favs' ? anime.name : null}
											</Typography>
										</Dotdotdot>
										<Dotdotdot clamp={3}>
											<Typography
												variant="display2"
												className={classes.bigCardSmallTitle}
												dangerouslySetInnerHTML={
													props.typeof === 'ongoing'
														? {
																__html: anime.description,
															}
														: props.typeof === 'ranking'
															? {
																	__html: anime.desc,
																}
															: null
												}
											>
												{props.typeof === 'progress'
													? `Last watched ${moment(anime.recentlyWatched).from(
															Date.now()
														)}`
													: null}
											</Typography>
										</Dotdotdot>
									</div>
								</div>
							</GridListTile>
						))}
					</GridList>
				</div>
			);
		} else if (props.typeof === 'ongoing') {
			return (
				<div className={classes.listContainer}>
					{backArrow}
					{forwardArrow}
					<GridList
						id={
							props.type.includes('m') ? 'mangaongoinglist' : 'animeongoinglist'
						}
						className={classes.list}
						cols={[theme.breakpoint.up('md')] ? 3 : 2}
						cellHeight={300}
					>
						{data.splice(0, props.limit).map(anime => (
							<GridListTile
								className={classes.bigCard}
								key={anime.id}
								onClick={() =>
									props.changePage(
										`/show?${props.type}=${
											props.typeof === 'progress'
												? anime.anime ? anime.anime.meta.i : anime.showId
												: anime.id
										}`
									)
								}
							>
								<div className={classes.bigCardImage}>
									<img
										src={
											props.typeof === 'ongoing'
												? anime.bannerImage
													? anime.bannerImage
													: anime.coverImage.large
												: props.typeof === 'ranking'
													? anime.bg
													: props.typeof === 'progress'
														? anime.anime
															? anime.anime.meta.a
															: anime.showHeaders
																? anime.showHeaders
																: anime.showArtwork
														: props.typeof === 'favs' ? anime.image : null
										}
										alt=""
										className={classes.bigCardImageImg}
									/>
								</div>
								<div className={classes.bigCardRow}>
									<img
										src={
											props.typeof === 'ongoing'
												? anime.coverImage.large
												: props.typeof === 'ranking'
													? anime.bg
													: props.typeof === 'progress'
														? anime.anime
															? anime.anime.meta.a
															: anime.showArtwork
														: props.typeof === 'favs' ? anime.image : null
										}
										alt=""
										className={classes.bigCardIcon}
									/>
									<div className={classes.bigCardText}>
										<Typography
											variant="display2"
											className={classes.bigCardVerySmallTitle}
										>
											{anime.averageScore
												? `Score ${anime.averageScore}% •`
												: null}{' '}
											{anime.rankings
												? `#${`${anime.rankings[0].rank} ${
														anime.rankings[0].context
													} ${anime.rankings[0].format} ${
														anime.rankings[0].allTime
															? ''
															: `${
																	anime.rankings[0].season
																		? anime.rankings[0].season
																		: ''
																} ${anime.rankings[0].year}`
													}`}`
												: null}
										</Typography>
										<Dotdotdot clamp={2} className={classes.dotdot}>
											<Typography
												variant="display2"
												className={classes.bigCardTitle}
											>
												{props.typeof === 'ongoing'
													? anime.title.romaji
													: props.typeof === 'ranking'
														? anime.name
														: props.typeof === 'progress'
															? anime.anime ? anime.anime.meta.r : anime.title
															: props.typeof === 'favs' ? anime.name : null}
											</Typography>
										</Dotdotdot>
										<Dotdotdot clamp={3}>
											<Typography
												variant="display2"
												className={classes.bigCardSmallTitle}
											>
												{props.typeof === 'ongoing'
													? props.type.includes('m')
														? null
														: `${timeFormatter(
																anime.nextAiringEpisode.timeUntilAiring
															)} till Episode ${
																anime.nextAiringEpisode.episode
															}`
													: props.typeof === 'ranking'
														? anime.category
														: props.typeof === 'progress'
															? anime.ep ? `EPISODE ${anime.ep}` : null
															: null}
											</Typography>
										</Dotdotdot>
									</div>
								</div>
							</GridListTile>
						))}
					</GridList>
				</div>
			);
		} else if (props.typeof === 'feeds') {
			return (
				<div className={classes.listContainer}>
					{backArrow}
					{forwardArrow}
					<GridList
						id={'feedlist'}
						className={classes.list}
						cols={[theme.breakpoint.up('md')] ? 3 : 2}
						cellHeight={300}
					>
						{data.splice(0, props.limit).map(feed => (
							<GridListTile
								className={classes.bigCard}
								key={feed.id}
								onClick={() =>
									props.changePage(`/feeds?${props.type}=${feed.id}`)
								}
							>
								<div className={classes.bigCardImage} />
								<div className={classes.bigCardRowFlex}>
									<div className={classes.bigCardTextFlex}>
										<div style={{ display: 'flex' }}>
											<img
												src={feed.user && feed.user.image}
												alt=""
												className={classes.bigCardSmallIcon}
											/>
											<Typography
												variant="display2"
												className={classes.bigCardVerySmallTitleFlex}
											>
												{feed.user && feed.user.name} •{' '}
												{moment(feed.date).from(Date.now())}
											</Typography>
											<div style={{ flex: 1 }} />
										</div>
										<Dotdotdot clamp={2} className={classes.dotdot}>
											<Typography
												variant="display2"
												className={classes.bigCardTitle}
											>
												{feed.name}
											</Typography>
										</Dotdotdot>
									</div>
								</div>
							</GridListTile>
						))}
					</GridList>
				</div>
			);
		}
		return null;
	}
};

const mapDispatchToProps = dispatch => ({
	changePage: page => dispatch(push(page)),
});

export default connect(({ routing }) => ({ routing }), mapDispatchToProps)(
	withStyles(style, { withTheme: true })(SuperTable)
);
