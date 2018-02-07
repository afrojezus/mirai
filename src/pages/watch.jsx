// TODO: Fix every single eslint-airbnb issue
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as M from 'material-ui';
import * as Icon from 'material-ui-icons';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import Button from 'material-ui/Button/Button';
import IconButton from 'material-ui/IconButton/IconButton';
import Typography from 'material-ui/Typography/Typography';
import Divider from 'material-ui/Divider/Divider';
import Card from 'material-ui/Card/Card';
import CardContent from 'material-ui/Card/CardContent';
import LinearProgress from 'material-ui/Progress/LinearProgress';
import CardActions from 'material-ui/Card/CardActions';
import Menu from 'material-ui/Menu/Menu';
import CardHeader from 'material-ui/Card/CardHeader';
import grey from 'material-ui/colors/grey';
import MenuItem from 'material-ui/Menu/MenuItem';
import Tooltip from 'material-ui/Tooltip/Tooltip';
import FormGroup from 'material-ui/Form/FormGroup';
import FormControlLabel from 'material-ui/Form/FormControlLabel';
import Switch from 'material-ui/Switch/Switch';
import TextField from 'material-ui/TextField/TextField';
import withStyles from 'material-ui/styles/withStyles';
import ReactPlayer from 'react-player';
import localForage from 'localforage';
import queryString from 'query-string';
import FadeIn from 'react-fade-in';
import { connect } from 'react-redux';
import { firebaseConnect, isEmpty, firebase } from 'react-redux-firebase';
import blue from 'material-ui/colors/blue';
import { history } from '../store';
import Aqua3 from '../assets/aqua3.gif';
import Duration from '../components/yuplayer/Duration';
import Twist from '../twist-api';
import Segoku from '../utils/segoku/segoku';
import corrector from '../utils/bigfuck';
import hsfetcher from '../torrent';
import { getState, loadEp, loadFile } from '../utils/mirfetch';

const style = theme => ({
	root: {
		height: '100vh',
		width: '100%',
		position: 'relative',
		top: 0,
		left: 0,
		overflow: 'hidden'
	},
	player: {
		height: '100%',
		width: '100%',
		position: 'absolute',
		top: 0,
		left: 0,
		background: 'black',
		transition: theme.transitions.create(['all'])
	},
	controlpanel: {
		position: 'fixed',
		bottom: theme.spacing.unit * 6,
		width: 'calc(100% - 128px)',
		marginLeft: 64,
		marginRight: 64,
		background: window.safari ? 'rgba(0,0,0,.2)' : grey[800],
		boxShadow: '0 2px 32px rgba(0,0,0,.3)',
		transition: theme.transitions.create(['all']),
		backdropFilter: 'blur(10px)'
	},
	backToolbar: {
		zIndex: 10,
		transition: theme.transitions.create(['all'])
	},
	indicator: {
		flexDirection: 'row',
		padding: 0,
		display: 'flex',
		position: 'relative'
	},
	progress: {
		flex: 1
	},
	progressLoaded: {
		zIndex: -1,
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%'
	},
	progressBg: {
		backgroundColor: grey[900]
	},
	progressBgOver: {
		backgroundColor: 'transparent'
	},
	progressBar: {
		transition: 'none'
	},
	progressBarLoaded: {
		transition: 'none',
		backgroundColor: grey[700]
	},
	duration: {
		padding: theme.spacing.unit,
		fontFamily: 'SF Mono'
	},
	left: {
		padding: theme.spacing.unit
	},
	epListCont: {
		maxHeight: 300,
		overflowY: 'scroll',
		padding: 0
	},
	epListItem: {},
	volumeSlider: {
		paddingLeft: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		outline: 'none'
	},
	progressInput: {
		background: 'transparent',
		position: 'absolute',
		margin: '-5px 0',
		width: '100%',
		'-webkit-appearance': 'none',
		outline: 'none',
		transition: theme.transitions.create(['all']),
		opacity: 0,
		'&:hover': {
			opacity: 1
		}
	},
	loading: {
		height: '100%',
		width: '100%',
		zIndex: 1000,
		position: 'fixed',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%,-50%)',
		padding: 0,
		margin: 'auto',
		transition: theme.transitions.create(['all'])
	},
	showInfo: {
		margin: 'auto',
		width: '100%',
		padding: theme.spacing.unit * 8,
		display: 'flex',
		zIndex: 500,
		boxSizing: 'border-box'
	},
	showInfoColumn: {
		display: 'flex',
		flexDirection: 'column',
		margin: 8
	},
	showInfoTitle: {
		fontWeight: 700,
		padding: theme.spacing.unit,
		paddingLeft: 0,
		color: 'white'
	},
	showInfoDesc: {
		paddingTop: theme.spacing.unit * 2,
		fontSize: 16
	},
	showInfoArtwork: {
		width: 300,
		objectFit: 'cover',
		boxShadow: '0 2px 16px rgba(0,0,0,.2)'
	},
	nextButton: {},
	nextButtonWrapper: {
		margin: theme.spacing.unit,
		position: 'relative'
	},
	nextButtonProgress: {
		color: blue.A200,
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12
	},
	qualityTitle: {
		border: '2px solid white',
		borderRadius: 2,
		padding: theme.spacing.unit / 2,
		boxSizing: 'border-box',
		fontSize: 14,
		fontWeight: 500
	},
	menuPaper: {
		outline: 'none'
	}
});

class Watch extends Component {
	static propTypes = {
		profile: PropTypes.shape({
			userID: PropTypes.string
		}),
		history: PropTypes.shape({
			goBack: PropTypes.func,
			location: PropTypes.shape({
				pathname: PropTypes.string,
				search: PropTypes.string,
				state: PropTypes.shape({
					eps: PropTypes.arrayOf(PropTypes.shape({}))
				})
			}),
			push: PropTypes.func
		}),
		theme: PropTypes.shape({}),
		mir: PropTypes.shape({
			play: PropTypes.shape({})
		}),
		location: PropTypes.shape({
			state: PropTypes.shape({}),
			search: PropTypes.string,
			pathname: PropTypes.string
		}),
		classes: style
	};

	static defaultProps = {
		profile: null,
		history,
		mir: null,
		location: null,
		classes: style,
		theme: {}
	};
	state = {};

	componentWillMount = () => {};

	componentDidMount = () => {};

	componentWillReceiveProps = nextProps => {};

	componentWillUnmount = () => {};

	render() {
		const { classes } = this.props;
		return <div id="frame" className={classes.root} />;
	}
}

export default firebaseConnect()(
	connect(({ firebase: { profile }, mir }) => ({ profile, mir }))(
		withStyles(style)(Watch)
	)
);
