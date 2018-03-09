import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import { firebaseConnect, isEmpty } from 'react-redux-firebase';
import Typography from 'material-ui/Typography/Typography';
import blue from 'material-ui/colors/blue';
import SwipeableViews from 'react-swipeable-views';
import Tab from 'material-ui/Tabs/Tab';
import Tabs from 'material-ui/Tabs/Tabs';
import queryString from 'query-string';
import moment from 'moment';
import strings from '../strings.json';
import Hidden from 'material-ui/Hidden/Hidden';
import {
	Root,
	CommandoBarTop,
	Container,
	LoadingIndicator,
	TitleHeader,
	Header,
	Column,
	SectionTitle,
	ItemContainer,
} from '../components/layouts';
import SuperTable from '../components/supertable';
import Avatar from 'material-ui/Avatar/Avatar';
import SuperComment from '../components/supercomment';
import checklang from '../checklang';
import Card, { CardContent } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import { Feed } from '../components/feed';
import { scrollFix } from './../utils/scrollFix';
import CardButton from '../components/cardButton';

const style = theme => ({
	tabLabel: {
		opacity: 0.5,
		fontSize: 16,
		color: 'white',
		textTransform: 'initial',
	},
	tabLabelActive: {
		fontWeight: 700,
		fontSize: 16,
		opacity: 1,
		color: 'white',
		textTransform: 'initial',
	},
	tabLine: {
		filter: 'drop-shadow(0 1px 12px rgba(0,0,255,.2))',
		height: 2,
		background: 'white',
	},
	tab: {
		height: 64,
	},
	feedTitle: {
		fontWeight: 800,
		textShadow: '0 2px 24px rgba(0,0,0,.07)',
		marginBottom: theme.spacing.unit * 3,
		zIndex: 20,
		color: 'white',
	},
	infoBox: {
		display: 'flex',
		marginBottom: theme.spacing.unit * 2,
	},
	feedContext: {
		fontSize: theme.typography.pxToRem(16),
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
	divider: {
		marginTop: theme.spacing.unit,
		marginBottom: theme.spacing.unit,
	},
});

class History extends Component {
	state = {
		index: 0,
		lang: strings.enus,
	};

	componentWillMount = () => {
		checklang(this);
		scrollFix();
		this.getColors();
	};

	componentDidMount = () => {};

	getColors = () => {
		const hue = localStorage.getItem("user-hue");
		if (hue) {
		  let hues = JSON.parse(hue);
		  return this.setState({
			hue: hues.hue,
			hueVib: hues.hueVib,
			hueVibN: hues.hueVibN
		  });
		} else {
		  return null;
		}
	  };

	render() {
		const { classes, profile } = this.props;
		const { index, lang, hue } = this.state;
		const user = isEmpty(profile) ? null : profile;
		return (
			<div>
				<TitleHeader color={hue ? hue : '#000'} />
				<Header color={hue ? hue : '#111'} />
				<CommandoBarTop title="History">
					<Hidden smDown>
						<div
							className={classes.commandoTextBox}
							style={{ marginRight: 16, marginLeft: 16 }}
						>
							<Typography variant={'title'} className={classes.commandoText}>
								History
							</Typography>
						</div>
					</Hidden>
					<Tabs
						value={this.state.index}
						onChange={(e, val) => this.setState({ index: val })}
						indicatorClassName={classes.tabLine}
					>
						<Tab
							label="Overview"
							classes={{
								root: classes.tab,
								label:
									this.state.index === 0
										? classes.tabLabelActive
										: classes.tabLabel,
							}}
						/>
						<Tab
							label="Anime log"
							classes={{
								root: classes.tab,
								label:
									this.state.index === 1
										? classes.tabLabelActive
										: classes.tabLabel,
							}}
						/>
						<Tab
							label="Manga log"
							classes={{
								root: classes.tab,
								label:
									this.state.index === 2
										? classes.tabLabelActive
										: classes.tabLabel,
							}}
						/>
						<Tab
							label="User log"
							classes={{
								root: classes.tab,
								label:
									this.state.index === 3
										? classes.tabLabelActive
										: classes.tabLabel,
							}}
						/>
					</Tabs>
					<div style={{ flex: 1 }} />
				</CommandoBarTop>
				<Root hasTab>
					<SwipeableViews
						index={index}
						onChangeIndex={index => this.setState({ index })}
					>
						<Container>
							<Column>
								<Typography variant="display3" className={classes.feedTitle}>
									Overview
								</Typography>
								{user && user.episodeProgress ? (
									<div>
										<ItemContainer
											noMargin
											style={{
												flexDirection: 'row',
												display: 'flex',
											}}
										>
											<SectionTitle title={lang.home.animehistoryTitle} />
											<div style={{ flex: 1 }} />
											<Typography variant="title" className={classes.headline}>
												{Object.values(user.episodeProgress).length}{' '}
												{lang.home.animehistoryEstimate}
											</Typography>
										</ItemContainer>
										<Container spacing={16}>
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
										</Container>
									</div>
								) : (
									<Typography
										variant="title"
										style={{ color: 'rgba(255,255,255, .5)' }}
									>
										No history of anime being seen found
									</Typography>
								)}
								<Divider className={classes.divider} />
								{user && user.chapterProgress ? (
									<div>
										<ItemContainer
											noMargin
											style={{
												flexDirection: 'row',
												display: 'flex',
											}}
										>
											<SectionTitle title={lang.home.animehistoryTitle} />
											<div style={{ flex: 1 }} />
											<Typography variant="title" className={classes.headline}>
												{Object.values(user.episodeProgress).length}{' '}
												{lang.home.animehistoryEstimate}
											</Typography>
										</ItemContainer>
										<Container spacing={16}>
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
										</Container>
									</div>
								) : (
									<Typography
										variant="title"
										style={{ color: 'rgba(255,255,255, .5)' }}
									>
										No history of manga being read found
									</Typography>
								)}
								<Divider className={classes.divider} />
								{user && user.feed ? (
									<div>
										<ItemContainer
											topPad
											noMargin
											style={{
												flexDirection: 'row',
												display: 'flex',
											}}
										>
											<SectionTitle title="Activity" />
											<div style={{ flex: 1 }} />
											<Typography variant="title" className={classes.headline}>
												{Object.values(user.feed).length} instances of activity
												found
											</Typography>
										</ItemContainer>
										<ItemContainer>
										<Column>
											{Object.values(user.feed)
												.sort((a, b) => b.date - a.date)
												.map((feed, index) => (
													<Feed
                  key={index}
                  ftitle={feed.user.username}
                  context={feed.activity}
                  date={feed.date}
                  avatar={feed.user.avatar}
                  id={feed.id}
                  image={feed.coverImg}
                  user={{avatar: feed.user.avatar, id: feed.user.userID, username: feed.user.username}}
                  activity
                  noActions />
												))}
												</Column>
										</ItemContainer>
									</div>
								) : (
									<Typography
										variant="title"
										style={{ color: 'rgba(255,255,255, .5)' }}
									>
										{user && !user.willLog
											? 'Logging is disabled'
											: 'No activites found'}
									</Typography>
								)}
							</Column>
						</Container>
						<Container>
							<Column>
								<Typography variant="display3" className={classes.feedTitle}>
									Anime log
								</Typography>
								<ItemContainer>
									{!isEmpty(user) && user.episodeProgress ? (
										Object.values(user.episodeProgress)
											.filter(s => s.recentlyWatched)
											.sort((a, b) => b.recentlyWatched - a.recentlyWatched)
											.map(show => (
												<CardButton
													key={show.showId}
													onClick={() =>
														this.props.history.push(`/show?s=${show.showId}`)
													}
													title={show.title}
													image={show.showArtwork}
													subtitle={
														show.ep
															? `Episode ${show.ep} | ${moment(
																	show.recentlyWatched
																).from(Date.now())}`
															: null
													}
												/>
											))
									) : (
										<Typography
											variant="title"
											style={{ color: 'rgba(255,255,255, .5)' }}
										>
											No history of anime being seen found
										</Typography>
									)}
								</ItemContainer>
							</Column>
						</Container>
						<Container>
							<Column>
								<Typography variant="display3" className={classes.feedTitle}>
									Manga log
								</Typography>
								<ItemContainer>
									{!isEmpty(user) && user.chapterProgress ? (
										Object.values(user.chapterProgress)
											.filter(s => s.recentlyRead)
											.sort((a, b) => b.recentlyRead - a.recentlyRead)
											.map(show => (
												<CardButton
													key={show.showId}
													onClick={() =>
														this.props.history.push(`/show?m=${show.showId}`)
													}
													title={show.title}
													image={show.showArtwork}
													subtitle={
														show.ep
															? `Chapter ${show.ch} | ${moment(
																	show.recentlyRead
																).from(Date.now())}`
															: null
													}
												/>
											))
									) : (
										<Typography
											variant="title"
											style={{ color: 'rgba(255,255,255, .5)' }}
										>
											No history of manga being read found
										</Typography>
									)}
								</ItemContainer>
							</Column>
						</Container>
						<Container>
							<Column>
								<Typography variant="display3" className={classes.feedTitle}>
									User log
								</Typography>
								<ItemContainer>
									{user && user.feed ? (
										Object.values(user.feed)
											.sort((a, b) => b.date - a.date)
											.map((act, index) => (
												<Feed
													title={'Activity'}
													avatar={act.coverImg}
													context={act.type}
													noActions
													id={index}
													text={act.activity}
													date={act.date}
													key={index}
													style={{
														width: 450,
														flexBasis: 'initial',
													}}
												/>
											))
									) : (
										<Typography
											variant="title"
											style={{ color: 'rgba(255,255,255, .5)' }}
										>
											{user && !user.willLog
												? 'Logging is disabled'
												: 'No activites found'}
										</Typography>
									)}
								</ItemContainer>
							</Column>
						</Container>
					</SwipeableViews>
				</Root>
			</div>
		);
	}
}

export default firebaseConnect()(
	connect(({ firebase: { profile } }) => ({ profile }))(
		withStyles(style)(History)
	)
);
