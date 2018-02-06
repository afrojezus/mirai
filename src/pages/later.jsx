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
	TitleHeader
} from '../components/layouts';
import Supertable from '../components/supertable';

const style = theme => ({
	column: {
		display: 'flex',
		flexFlow: 'column wrap',
		marginBottom: theme.spacing.unit,
		width: '100%'
	},
	noneMessage: {
		paddingTop: theme.spacing.unit * 3,
		paddingBottom: theme.spacing.unit * 3,
		color: 'rgba(255,255,255,.8)'
	},
	categoryTitle: {
		fontWeight: 700
	}
});

class Later extends Component {
	static propTypes = {
		profile: {},
		history,
		firebase,
		location: {
			state: {},
			search: PropTypes.string,
			pathname: PropTypes.string
		},
		classes: style
	};

	static defaultProps = {
		profile: null,
		history,
		location: null,
		firebase: null,
		classes: style
	};

	state = {
		loading: true,
		userShows: null,
		userManga: null
	};

	componentDidMount = () =>
		this.setState({ loading: false, ...this.userprops });

	componentWillReceiveProps = nextProps => {
		if (this.props.profile !== nextProps.profile)
			this.setState({ ...this.userprops }, () =>
				this.setState({ loading: false })
			);
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
				: null
	};

	render = () => (
  <div>
    <LoadingIndicator loading={this.state.loading} />
    <Root style={this.state.loading ? { opacity: 0 } : null}>
      <TitleHeader title="Later" />
      <Container hasHeader>
        <div className={this.props.classes.column}>
          <Typography
            className={this.props.classes.categoryTitle}
            type="title"
          >
							Anime you want to check out later
          </Typography>
          {!isEmpty(this.props.profile) && this.state.userShows ? (
            <Supertable
              data={this.state.userShows.sort((a, b) => b.date - a.date)}
              type="s"
              typeof="later"
            />
						) : (
  <Typography
    className={this.props.classes.noneMessage}
    type="title"
  >
								It appears you got no anime to check out later...
  </Typography>
						)}
        </div>
        <div className={this.props.classes.column}>
          <Typography
            className={this.props.classes.categoryTitle}
            type="title"
          >
							Manga you want to check out later
          </Typography>
          {!isEmpty(this.props.profile) && this.state.userManga ? (
            <Supertable
              data={this.state.userManga.sort((a, b) => b.date - a.date)}
              type="m"
              typeof="later"
            />
						) : (
  <Typography
    className={this.props.classes.noneMessage}
    type="title"
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
