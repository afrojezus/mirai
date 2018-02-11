// TODO: Fix every single eslint-airbnb issue
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import Typography from 'material-ui/Typography/Typography';
import green from 'material-ui/colors/green';
import SwipeableViews from 'react-swipeable-views';
import Tab from 'material-ui/Tabs/Tab';
import Tabs from 'material-ui/Tabs/Tabs';
import SuperTable from '../components/supertable';
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

class Live extends Component {
	state = {
		loading: true,
		index: 0,
	};

	componentDidMount = () => {};

	render() {
		const { classes } = this.props;
		const { index } = this.state;
		return (
			<div>
				<LoadingIndicator loading={this.state.loading} />
				<TitleHeader color={green.A400} />
				<Header color={green[800]} />
				<CommandoBarTop title="Live">
					<Tabs
						value={this.state.index}
						onChange={(e, val) => this.setState({ index: val })}
						indicatorClassName={classes.tabLine}
					>
						<Tab
							label="Streams"
							classes={{
								root: classes.tab,
								label:
									this.state.index === 0
										? classes.tabLabelActive
										: classes.tabLabel,
							}}
						/>
						<Tab
							label="Friends"
							classes={{
								root: classes.tab,
								label:
									this.state.index === 1
										? classes.tabLabelActive
										: classes.tabLabel,
							}}
						/>
						<Tab
							label="Live TV"
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
									Streams
								</Typography>
							</Column>
						</Container>
						<Container>
							<Column>
								<Typography variant="display3" className={classes.feedTitle}>
									Friends streams
								</Typography>
							</Column>
						</Container>
						<Container>
							<Column>
								<Typography variant="display3" className={classes.feedTitle}>
									Live TV
								</Typography>
							</Column>
						</Container>
						<Container>
							<Column />
						</Container>
					</SwipeableViews>
				</Root>
			</div>
		);
	}
}

export default firebaseConnect()(
	connect(({ firebase: { profile } }) => ({ profile }))(withStyles(style)(Live))
);
