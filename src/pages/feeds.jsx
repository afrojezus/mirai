import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import Typography from 'material-ui/Typography/Typography';
import blue from 'material-ui/colors/blue';
import grey from 'material-ui/colors/grey';
import SwipeableViews from 'react-swipeable-views';
import Tab from 'material-ui/Tabs/Tab';
import Tabs from 'material-ui/Tabs/Tabs';
import queryString from 'query-string';
import moment from 'moment';
import checklang from '../checklang';
import strings from '../strings.json';
import Grid from 'material-ui/Grid/Grid';
import SuperTable from '../components/supertable';
import {
	Root,
	CommandoBarTop,
	Container,
	LoadingIndicator,
	TitleHeader,
	Header,
	Column,
	ItemContainer,
	SectionSubTitle,
	SectionTitle,
} from '../components/layouts';
import Avatar from 'material-ui/Avatar/Avatar';
import SuperComment from '../components/supercomment';
import Hidden from 'material-ui/Hidden/Hidden';

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
});

class Feeds extends Component {
	state = {
		index: 0,
		feed: null,
		publicFeeds: null,
		friendFeeds: null,
		lang: strings.enus,
		id: 0,
	};

	componentWillMount = () => {
		checklang(this);
	};

	componentDidMount = () => {
		this.props.firebase
			.database()
			.ref('/social')
			.child('public_feed')
			.on('value', allVal => this.setState({ publicFeeds: allVal.val() }));
		if (this.props.history.location.search) {
			const id = queryString.parse(this.props.history.location.search);
			return this.props.firebase
				.database()
				.ref('/social')
				.child('public_feed')
				.child(id.f)
				.on('value', val =>
					this.setState({
						feed: val.val(),
						index: 3,
						id: val.val().id,
						loading: false,
					})
				);
		}
		return null;
	};

	componentWillUnmount = () => {
		this.unlisten();
	};

	unlisten = this.props.history.listen((location, action) => {
		const id = queryString.parse(location.search);
		if (id.f !== this.state.id && id.f !== undefined)
			return this.props.firebase
				.database()
				.ref('/social')
				.child('public_feed')
				.child(id.f)
				.on('value', val =>
					this.setState({
						feed: val.val(),
						index: 3,
						id: val.val().id,
						loading: false,
					})
				);
		return false;
	});

	render() {
		const { classes } = this.props;
		const { index, feed, publicFeeds, lang } = this.state;
		return (
			<div>
				<TitleHeader color={grey.A700} />
				<Header color={grey[900]} />
				<CommandoBarTop title="Feeds">
					<Hidden smDown>
						<div style={{ flex: 1 }} />
					</Hidden>
					<Tabs
						value={this.state.index}
						onChange={(e, val) => this.setState({ index: val })}
						indicatorClassName={classes.tabLine}
						centered
						fullWidth
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
							label="Updates"
							classes={{
								root: classes.tab,
								label:
									this.state.index === 1
										? classes.tabLabelActive
										: classes.tabLabel,
							}}
						/>
						<Tab
							label="Friends"
							classes={{
								root: classes.tab,
								label:
									this.state.index === 2
										? classes.tabLabelActive
										: classes.tabLabel,
							}}
						/>
					</Tabs>
					<Hidden smDown>
						<div style={{ flex: 1 }} />
					</Hidden>
				</CommandoBarTop>
				<Root hasTab>
					<SwipeableViews
						index={index}
						onChangeIndex={index => this.setState({ index })}
					>
						<Container>
							<Column>
								<Typography variant="display3" className={classes.feedTitle}>
									What's up?
								</Typography>
								<ItemContainer spacing={0}>
									<SectionTitle title={lang.home.updates} />
									<Container spacing={16}>
										{publicFeeds ? (
											<SuperTable
												data={Object.values(publicFeeds).sort(
													(a, b) => b.date - a.date
												)}
												typeof="feeds"
												type="f"
											/>
										) : null}
									</Container>
								</ItemContainer>
								<ItemContainer spacing={0}>
									<SectionTitle title={'Popular feeds'} />
									<Container spacing={16} />
								</ItemContainer>
							</Column>
						</Container>
						<Container>
							<Column>
								<Typography variant="display3" className={classes.feedTitle}>
									Mirai Updates
								</Typography>
							</Column>
						</Container>
						<Container>
							<Column>
								<Typography variant="display3" className={classes.feedTitle}>
									What's up with your friends?
								</Typography>
							</Column>
						</Container>
						<Container>
							{feed && (
								<Column>
									<Typography variant="display3" className={classes.feedTitle}>
										{feed.name}
									</Typography>
									<div className={classes.infoBox}>
										<Avatar src={feed.user.image} style={{ marginRight: 16 }} />
										<Column>
											<Typography variant="title">{feed.user.name}</Typography>
											<Typography variant="body1">
												{moment(feed.date).from(Date.now())}
											</Typography>
										</Column>
									</div>
									<Typography variant="body1" className={classes.feedContext}>
										{feed.context}
									</Typography>
									<SuperComment
										article={{
											url: window.location.href,
											identifier: feed.id,
											title: feed.name,
										}}
									/>
								</Column>
							)}
						</Container>
					</SwipeableViews>
				</Root>
			</div>
		);
	}
}

export default firebaseConnect()(
	connect(({ firebase: { profile } }) => ({ profile }))(
		withStyles(style)(Feeds)
	)
);
