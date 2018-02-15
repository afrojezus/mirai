// TODO: Fix every single eslint-airbnb issue
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import { firebaseConnect, isEmpty, firebase } from 'react-redux-firebase';
import Typography from 'material-ui/Typography/Typography';
import { history } from '../store';
import {
	Root,
	CommandoBar,
	Container,
	LoadingIndicator,
	TitleHeader,
} from '../components/layouts';
import Supertable from '../components/supertable';

const style = theme => ({
	column: {
		display: 'flex',
		flexFlow: 'column wrap',
		marginBottom: theme.spacing.unit,
		width: '100%',
	},
	noneMessage: {
		paddingTop: theme.spacing.unit * 3,
		paddingBottom: theme.spacing.unit * 3,
		color: 'rgba(255,255,255,.8)',
	},
	categoryTitle: {
		fontWeight: 700,
	},
});

class Later extends Component {
	state = {
		loading: true,
	};

	componentDidMount = () => this.setState({ loading: false });

	componentWillReceiveProps = nextProps => {
		if (this.props.profile !== nextProps.profile) {
		}
	};

	userprops = {
		userShows:
			!isEmpty(this.props.profile) &&
			this.props.profile.later &&
			this.props.profile.later.show
				? Object.values(this.props.profile.later.show)
				: null,
		userManga:
			!isEmpty(this.props.profile) &&
			this.props.profile.later &&
			this.props.profile.later.manga
				? Object.values(this.props.profile.later.manga)
				: null,
	};

	render = () => (
		<div>
			<LoadingIndicator loading={this.state.loading} />
			<Root>
				<TitleHeader title="Later" color={'#000'} />
				<Container hasHeader>
					<div className={this.props.classes.column}>
						<Typography
							className={this.props.classes.categoryTitle}
							variant="title"
						>
							Anime you want to check out later
						</Typography>
						{!isEmpty(this.props.profile) && this.userprops.userShows ? (
							<Supertable
								data={this.userprops.userShows.sort((a, b) => b.date - a.date)}
								type="s"
								typeof="later"
							/>
						) : (
							<Typography
								className={this.props.classes.noneMessage}
								variant="title"
							>
								It appears you got no anime to check out later...
							</Typography>
						)}
					</div>
					<div className={this.props.classes.column}>
						<Typography
							className={this.props.classes.categoryTitle}
							variant="title"
						>
							Manga you want to check out later
						</Typography>
						{!isEmpty(this.props.profile) && this.userprops.userManga ? (
							<Supertable
								data={this.userprops.userManga.sort((a, b) => b.date - a.date)}
								type="m"
								typeof="later"
							/>
						) : (
							<Typography
								className={this.props.classes.noneMessage}
								variant="title"
							>
								It appears you got no manga to check out later...
							</Typography>
						)}
					</div>
				</Container>
			</Root>
		</div>
	);
}

export default firebaseConnect()(
	connect(({ firebase: { profile } }) => ({ profile }))(
		withStyles(style)(Later)
	)
);
