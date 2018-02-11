// TODO: Fix every single eslint-airbnb issue
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import Typography from 'material-ui/Typography/Typography';
import orange from 'material-ui/colors/orange';
import Supertable from '../components/supertable';
import SwipeableViews from 'react-swipeable-views';
import queryString from 'query-string';
import Tab from 'material-ui/Tabs/Tab';
import Tabs from 'material-ui/Tabs/Tabs';
import CardButton from '../components/cardButton';
import SuperComment from '../components/supercomment';
import {
	Root,
	CommandoBar,
	Container,
	LoadingIndicator,
	TitleHeader,
	Header,
	CommandoBarTop,
	Column,
} from '../components/layouts';

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

class Rankings extends Component {
	state = {
		loading: true,
		index: 0,
		collection: null,
	};

	componentDidMount = () => {
		if (this.props.history.location.search) {
			const id = queryString.parse(this.props.history.location.search);
			return this.props.firebase
				.database()
				.ref('/rankings')
				.child('collections')
				.child(id.c)
				.on('value', val =>
					this.setState({ collection: val.val(), index: 3, loading: false })
				);
		}
	};

	render() {
		const { classes } = this.props;
		const { index, collection } = this.state;
		return (
			<div>
				<LoadingIndicator loading={this.state.loading} />
				<TitleHeader color={orange.A400} />
				<Header color={orange[800]} image={collection ? collection.bg : null} />
				<CommandoBarTop title="Rankings">
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
							label="Collections"
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
									What's ranked on top?
								</Typography>
							</Column>
						</Container>
						<Container>
							<Column>
								<Typography variant="display3" className={classes.feedTitle}>
									Collections
								</Typography>
							</Column>
						</Container>
						<Container>
							<Column>
								<Typography variant="display3" className={classes.feedTitle}>
									Recommended by friends
								</Typography>
							</Column>
						</Container>
						<Container>
							{collection && (
								<Column>
									<Typography variant="display3" className={classes.feedTitle}>
										{collection.name}
									</Typography>
									<div className={classes.infoBox}>
										<Column>
											<Typography variant="title">
												{collection.category}
											</Typography>
											<Typography variant="body1">{collection.desc}</Typography>
										</Column>
									</div>
									<Container>
										{Object.values(collection.data).map((anime, index) => (
											<CardButton
												key={index}
												onClick={() =>
													this.props.history.push(`/show?s=${anime.id}`)
												}
												image={anime.image}
												title={anime.title}
											/>
										))}
									</Container>
									<Typography variant="title" style={{ margin: '16px 0' }}>
										What do you think of this collection?
									</Typography>
									<SuperComment
										article={{
											url: window.location.href,
											identifier: collection.id,
											title: collection.title,
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
		withStyles(style)(Rankings)
	)
);
