import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import Menu, { MenuItem } from 'material-ui/Menu';
import MenuIcon from 'material-ui-icons/Menu';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Info from 'material-ui-icons/Info';
import miraiLogo from '../assets/mirai-logo5.png';
import { grey } from 'material-ui/colors';
import Drawer from 'material-ui/Drawer';
import List, {
	ListItem,
	ListItemIcon,
	ListItemText,
	ListSubheader,
} from 'material-ui/List';
import Hidden from 'material-ui/Hidden';
import Divider from 'material-ui/Divider';
import Card, {
	CardContent,
	CardMedia,
	CardActions,
	CardHeader,
} from 'material-ui/Card';
import HomeIcon from 'material-ui-icons/Home';
import SearchIcon from 'material-ui-icons/Search';
import DashboardIcon from 'material-ui-icons/Dashboard';
import LiveTvIcon from 'material-ui-icons/LiveTv';
import BellIcon from 'material-ui-icons/Notifications';
import BellOffIcon from 'material-ui-icons/NotificationsNone';
import StarIcon from 'material-ui-icons/Star';
import Avatar from 'material-ui/Avatar';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import MoreVert from 'material-ui-icons/MoreVert';
import CloseIcon from 'material-ui-icons/Close';
import AppsIcon from 'material-ui-icons/Apps';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';

import * as Vibrant from 'node-vibrant';

import localForage from 'localforage';

import { connect } from 'react-redux';

import Autosuggest from 'react-autosuggest';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import Tabs, { Tab } from 'material-ui/Tabs';

import { firebaseConnect, isEmpty } from 'react-redux-firebase';

import NotificationForm from './notificationForm';
import BottomNavigation from 'material-ui/BottomNavigation/BottomNavigation';
import BottomNavigationAction from 'material-ui/BottomNavigation/BottomNavigationAction';
import { history } from '../store';

const drawerWidth = 240;

const styles = theme => ({
	root: {
		width: '100%',
		transition: theme.transitions.create(['all']),
		paddingLeft: 'env(safe-area-inset-left)',
		paddingRight: 'env(safe-area-inset-right)',
	},
	gd: {
		width: '100%',
		height: 82,
		position: 'fixed',
		transition: theme.transitions.create(['all']),
		background: 'linear-gradient(to top, transparent, rgba(0,0,0,1))',
	},
	appBar: {
		background: theme.palette.background.appBar,
		borderBottom: `1px solid rgba(255,255,255,0)`,
	},
	appBarTop: {
		background: 'rgba(0,0,0,.1)',
		boxShadow: 'none',
		borderBottom: `1px solid rgba(255,255,255,.1)`,
		backdropFilter: 'blur(10px)',
	},
	appFrame: {
		position: 'relative',
		display: 'flex',
		width: '100%',
		height: '100%',
	},
	flex: {
		flex: 1,
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20,
	},
	logoButton: {
		position: 'absolute',
		left: '50%',
		right: '50%',
		transform: 'translate(-50%, -50%)',
		margin: 'auto',
		top: theme.spacing.unit * 4,
		[theme.breakpoints.down('sm')]: {
			position: 'initial',
			left: 'initial',
			right: 'initial',
			transform: 'initial',
			margin: 'auto',
			top: 'initial',
		},
	},
	userButton: {
		width: 32,
		height: 32,
		margin: 'auto',
		overflow: 'hidden',
	},
	userButtonImg: {
		height: 32,
		objectFit: 'cover',
	},
	list: {
		width: drawerWidth,
	},
	listFull: {
		width: 'auto',
	},
	listDivider: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
	},
	drawerToolbar: theme.mixins.toolbar,
	drawer: {
		width: drawerWidth,
		height: '100%',
		paddingLeft: 'env(safe-area-inset-left)',
		[theme.breakpoints.up('md')]: {
			height: 'auto',
		},
		background:
			window.safari && window.navigator.userAgent.indexOf('Edge') > -1
				? 'rgba(0,0,0,.1)'
				: '#111',
		backdropFilter: 'blur(10px)',
		boxShadow:
			window.safari && window.navigator.userAgent.indexOf('Edge') > -1
				? 'none'
				: null,
	},
	drawerBg: {},
	drawerDocked: {
		height: '100%',
		position: 'fixed',
	},
	menuPadding: {
		padding: 0,
		overflow: 'initial',
	},
	profileCard: {
		width: 345,
	},
	profileCardHeader: {
		cursor: 'pointer',
	},
	profileCardImg: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		height: 96 + 8,
		objectFit: 'cover',
		width: '100%',
		opacity: 0.4,
		zIndex: -1,
		transition: theme.transitions.create(['all']),
	},
	searchContainer: {
		flexGrow: 1,
		position: 'relative',
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
		borderRadius: 4,
		background: grey[900],
		fontSize: 16,
		textAlign: 'center',
		padding: '10px 12px',
		width: 'calc(100% - 24px)',
		transition: theme.transitions.create(['box-shadow']),
		'&:focus': {
			boxShadow: '0 1pt 0.2rem rgba(0,0,0,.25)',
		},
	},
	content: {
		backgroundColor: theme.palette.background.default,
		width: '100%',
		height: 'calc(100% - 56px)',
		[theme.breakpoints.up('sm')]: {
			height: 'calc(100% - 64px)',
		},
		position: 'relative',
		'& > div': {
			position: 'absolute',
			width: '100%',
			[theme.breakpoints.down('md')]: {
				marginBottom: 56,
			},
		},
	},
	footerCopy: {
		fontWeight: 700,
		padding: theme.spacing.unit * 3,
		fontSize: theme.typography.pxToRem(12),
		color: grey[800],
	},
	contextBar: {
		[theme.breakpoints.down('sm')]: {
			display: 'none',
		},
	},
	tabLabel: {
		opacity: 0.5,
		fontSize: theme.typography.pxToRem(14),
		textTransform: 'initial',
	},
	tabLabelActive: {
		fontWeight: 700,
		fontSize: theme.typography.pxToRem(14),
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
	avatar: {
		marginLeft: -theme.spacing.unit * 4,
		height: 64,
		width: 64,
		boxShadow: '0 3px 16px rgba(0,0,0,.5)',
	},
	avatarImg: {
		height: '100%',
		width: '100%',
		objectFit: 'cover',
		transition: theme.transitions.create(['all']),
	},
	statusForm: {
		width: '100%',
	},
	navBar: {
		position: 'fixed',
		width: '100%',
		bottom: 0,
		zIndex: 9999,
	},
	sideNav: {
		position: 'fixed',
		height: '100%',
		top: theme.spacing.unit * 8,
		left: 0,
		display: 'flex',
		flexDirection: 'column',
		margin: theme.spacing.unit,
		zIndex: 1200,
	},
	sideButton: {
		display: 'flex',
		'& > span': {
			flexDirection: 'column',
			textTransform: 'initial',
		},
	},
	searchBar: {
		background: 'rgba(255,255,255,.05)',
		border: '1px solid rgba(255,255,255,.1)',
		boxShadow: 'none',
		maxWidth: 1970,
		minWidth: 300,
		display: 'flex',
		transition: theme.transitions.create(['all']),
		'&:hover': {
			background: 'rgba(255,255,255,.08)',
			border: '1px solid rgba(255,255,255,.15)',
		},
		'&:focus': {
			background: 'rgba(255,255,255,.08)',
			border: '1px solid rgba(255,255,255,.15)',
		},
		margin: 'auto',
		marginRight: theme.spacing.unit,
	},
	searchInput: {
		maxWidth: 1970,
		minWidth: 300,
		boxSizing: 'border-box',
	},
	searchIcon: {
		paddingLeft: theme.spacing.unit * 2,
		paddingRight: theme.spacing.unit * 2,
		margin: 'auto 0',
	},
	barTitle: {
		fontFamily: "'Fugaz One', cursive",
	},
	logoImg: {
		height: 52,
		margin: 'auto',
		position: 'relative',
		top: '-2px',
	},
});

class Superbar extends Component {
	static propTypes = {
		user: PropTypes.object,
	};

	state = {
		anchorEl: null,
		infoEl: null,
		drawerOpen: false,
		searchVal: '',
		notAtTop: true,
		currentPage: '',
		watchIsOn: false,
		status: 0,
		mirTitle: '',
		scrolling: false,
		commit: 'd10',
	};

	componentWillMount = () => {
		if (this.props.history.location.pathname === '/')
			this.setState({ tabVal: 0, currentPage: 'Mirai' });
		else {
			this.setState({ tabVal: 4 });
		}

		if (
			this.props.history.location.pathname === '/watch' &&
			window.location.pathname === '/watch'
		) {
			this.setState({ watchIsOn: true });
		} else {
			this.setState({ watchIsOn: false });
		}
	};

	componentDidMount = async () => {
		window.addEventListener('scroll', this.handleScroll);
		this.vibrance();
	};

	componentWillReceiveProps = nextProps => {
		if (this.props.mir)
			if (this.props.mir.title !== nextProps.mir.title) {
				this.setState({ mirTitle: '' }, () =>
					this.setState({ mirTitle: nextProps.mir.title })
				);
			}
	};

	handleMenu = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleRequestClose = () => {
		this.setState({ anchorEl: null });
	};

	handleInfoMenu = event => {
		this.setState({ infoEl: event.currentTarget });
	};

	handleInfoRequestClose = () => {
		this.setState({ infoEl: null });
	};

	toggleDrawer = () => this.setState({ drawerOpen: !this.state.drawerOpen });

	tabChange = (e, val) => {
		this.setState({ tabVal: val }, () => {
			switch (this.state.tabVal) {
				case 0:
					this.props.history.push('/');
					break;
				case 1:
					this.props.history.push('/feeds');
					break;
				case 2:
					this.props.history.push('/rankings');
					break;
				case 3:
					this.props.history.push('/live');
					break;
				default:
					break;
			}
		});
	};

	listenToHistory = this.props.history.listen((location, action) => {
		switch (location.pathname) {
			case '/':
				this.setState({ currentPage: 'Mirai', tabVal: 0, watchIsOn: false });
				break;
			case '/feeds':
				this.setState({ currentPage: 'Mirai', tabVal: 1, watchIsOn: false });
				break;
			case '/rankings':
				this.setState({ currentPage: 'Mirai', tabVal: 2, watchIsOn: false });
				break;
			case '/live':
				this.setState({ currentPage: 'Mirai', tabVal: 3, watchIsOn: false });
				break;
			case '/user':
				this.setState({ currentPage: 'You', tabVal: 4, watchIsOn: false });
				break;
			case '/history':
				this.setState({
					currentPage: 'History',
					tabVal: 4,
					watchIsOn: false,
				});
				break;
			case '/later':
				this.setState({ currentPage: 'Later', tabVal: 4, watchIsOn: false });
				break;
			case '/help':
				this.setState({ currentPage: 'Help', tabVal: 4, watchIsOn: false });
				break;
			case '/studio':
				this.setState({
					currentPage: '',
					tabVal: 4,
					watchIsOn: false,
				});
				break;
			case '/fig':
				this.setState({
					currentPage: '',
					tabVal: 4,
					watchIsOn: false,
				});
				break;
			case '/show':
				this.setState({
					currentPage: '',
					tabVal: 4,
					watchIsOn: false,
				});
				break;
			case '/settings':
				this.setState({
					currentPage: 'Settings',
					tabVal: 4,
					watchIsOn: false,
				});
				break;
			case '/setup':
				this.setState({ currentPage: 'Setup', tabVal: 4, watchIsOn: false });
				break;
			case '/wizard':
				this.setState({ currentPage: 'Wizard', tabVal: 4, watchIsOn: false });
				break;
			case '/watch':
				this.setState({ currentPage: '', tabVaL: 4, watchIsOn: true });
				break;
			case '/tag':
				this.setState({ currentPage: '', tabVal: 4, watchIsOn: false });
				break;
			case '/tou':
				this.setState({
					currentPage: 'Terms of Usage',
					tabVal: 4,
					watchIsOn: false,
				});
				break;
			case '/monika':
				this.setState({ currentPage: 'Monika', tabVal: 4, watchIsOn: false });
				break;
			case '/search':
				this.setState({ currentPage: 'Search', tabVal: 4, watchIsOn: false });
				break;
			default:
				break;
		}
	});

	revealBar = () => (document.getElementById('superBar').style.opacity = 1);

	hideBar = () => (document.getElementById('superBar').style.opacity = 0);

	vibrance = async () => {
		let image = this.props.profile ? this.props.profile.avatar : null;
		let hues = await localForage.getItem('user-hue');

		if (image && !hues)
			Vibrant.from('https://cors-anywhere.herokuapp.com/' + image).getPalette(
				(err, pal) => {
					if (pal) {
						this.setState({
							hue: pal.DarkMuted.getHex(),
							hueVib: pal.LightVibrant && pal.LightVibrant.getHex(),
							hueVibN: pal.DarkVibrant && pal.DarkVibrant.getHex(),
						});
					}
				}
			);
		else if (image && hues && hues.image !== image)
			Vibrant.from('https://cors-anywhere.herokuapp.com/' + image).getPalette(
				(err, pal) => {
					if (pal) {
						this.setState({
							hue: pal.DarkMuted.getHex(),
							hueVib: pal.LightVibrant && pal.LightVibrant.getHex(),
							hueVibN: pal.DarkVibrant && pal.DarkVibrant.getHex(),
						});
					}
				}
			);
		else if (image && hues)
			this.setState({
				hue: hues.hue,
				hueVib: hues.vib,
				hueVibN: hues.vibn,
			});

		setTimeout(() => this.setState({ loading: false }), 200);
	};

	componentWillUnmount = () => {
		window.removeEventListener('scroll', this.handleScroll);
		this.listenToHistory();
	};

	handleScroll = event => {
		if (window.scrollY === 0 && this.state.scrolling === true)
			this.setState({ scrolling: false }, () => {
				if (document.getElementById('fabShowButton') && !window.safari)
					document.getElementById('fabShowButton').style.opacity = 0;
				let mainH = document.getElementById('mainHeader');
				let mainC = document.getElementById('mainCard');
				let commando = document.getElementById('commandoBar');
				if (mainH && mainC && commando) {
					mainH.classList.remove('compacMode');
					commando.classList.remove('fixedcommando');
				}
			});
		else if (window.scrollY !== 0 && this.state.scrolling !== true)
			this.setState({ scrolling: true }, () => {
				if (document.getElementById('fabShowButton'))
					document.getElementById('fabShowButton').style.opacity = 1;
				let mainH = document.getElementById('mainHeader');
				let mainC = document.getElementById('mainCard');
				let commando = document.getElementById('commandoBar');
				if (mainH && mainC && commando) {
					mainH.classList.add('compacMode');
					commando.classList.add('fixedcommando');
				}
			});
	};

	render() {
		const { classes } = this.props;
		const {
			anchorEl,
			infoEl,
			drawerOpen,
			notAtTop,
			tabVal,
			currentPage,
			watchIsOn,
			hue,
			mirTitle,
			scrolling,
			commit,
		} = this.state;

		const user = !isEmpty(this.props.profile) ? this.props.profile : null;

		const open = Boolean(anchorEl);
		const infoOpen = Boolean(infoEl);

		const menuList = (
			<div className={classes.list}>
				<Toolbar className={classes.drawerToolbar}>
					<IconButton
						className={classes.menuButton}
						color="contrast"
						aria-label="Menu"
						onClick={this.toggleDrawer}
					>
						<CloseIcon />
					</IconButton>
				</Toolbar>
				<List>
					<ListItem
						button
						onClick={() => {
							this.toggleDrawer();
							this.tabChange(null, 0);
						}}
					>
						<ListItemText primary="Home" />
					</ListItem>
					<ListItem
						button
						onClick={() => {
							this.toggleDrawer();
							this.tabChange(null, 1);
						}}
					>
						<ListItemText primary="Feeds" />
					</ListItem>
					<ListItem
						button
						onClick={() => {
							this.toggleDrawer();
							this.tabChange(null, 2);
						}}
					>
						<ListItemText primary="Rankings" />
					</ListItem>
					<ListItem
						button
						onClick={() => {
							this.toggleDrawer();
							this.tabChange(null, 3);
						}}
					>
						<ListItemText primary="Live" />
					</ListItem>
				</List>
				{user ? (
					<div>
						<Divider className={classes.listDivider} />
						<List subheader={<ListSubheader>YOU</ListSubheader>}>
							<ListItem
								button
								onClick={() => {
									this.toggleDrawer();
									this.tabChange(null, 4);
									this.props.history.push('/history');
								}}
							>
								<ListItemText primary="History" />
							</ListItem>
							<ListItem
								button
								onClick={() => {
									this.toggleDrawer();
									this.tabChange(null, 4);
									this.props.history.push('/later');
								}}
							>
								<ListItemText primary="Later" />
							</ListItem>
							<ListItem
								button
								onClick={() => {
									this.toggleDrawer();
									this.tabChange(null, 4);
									this.props.history.push('/user#favorites');
								}}
							>
								<ListItemText primary="Favorites" />
							</ListItem>
						</List>
					</div>
				) : null}
				<Divider className={classes.listDivider} />
				<List>
					<ListItem
						button
						onClick={() => {
							this.toggleDrawer();
							this.tabChange(null, 4);
							this.props.history.push('/help');
						}}
					>
						<ListItemText primary="Help" />
					</ListItem>
					<ListItem
						button
						onClick={() => {
							this.toggleDrawer();
							this.tabChange(null, 4);
							this.props.history.push('/feedback');
						}}
					>
						<ListItemText primary="Feedback" />
					</ListItem>
					<ListItem
						button
						onClick={() => {
							this.toggleDrawer();
							window.open('https://discord.gg/gt69fbe');
						}}
					>
						<ListItemText primary="Discord" />
					</ListItem>
					<ListItem
						button
						onClick={() => {
							this.toggleDrawer();
							this.tabChange(null, 4);
							this.props.history.push('/tou');
						}}
					>
						<ListItemText primary="Terms of Usage" />
					</ListItem>
					<ListItem
						button
						onClick={() => {
							this.toggleDrawer();
							this.tabChange(null, 4);
							this.props.history.push('/monika');
						}}
					>
						<ListItemText primary="Monika" />
					</ListItem>
				</List>
				<Divider className={classes.listDivider} />
				<Typography className={classes.footerCopy} type="headline">
					Mirai commit-{commit}
					<br />
					{this.props.mir && this.props.mir.twist
						? Object.keys(this.props.mir.twist).length -
							1 +
							' animes in database'
						: null}
					<br />2018 afroJ
				</Typography>
			</div>
		);

		return (
			<div className={classes.appFrame}>
				<AppBar
					id="superBar"
					classes={{ root: classes.root }}
					className={
						scrolling &&
						!(window.navigator.userAgent.indexOf('Edge') > -1) &&
						!window.safari
							? classes.appBar
							: classes.appBarTop
					}
					style={
						watchIsOn
							? { display: 'none' }
							: { transform: 'translate3d(0,0,0)' }
					}
				>
					<div
						className={classes.gd}
						style={
							window.safari && window.navigator.userAgent.indexOf('Edge') > -1
								? { opacity: 0.2 }
								: scrolling ? { opacity: 0 } : { opacity: 0.2 }
						}
					/>
					<Toolbar>
						<IconButton
							className={classes.menuButton}
							color="contrast"
							aria-label="Menu"
							onClick={this.toggleDrawer}
						>
							<MenuIcon />
						</IconButton>
						<Tabs
							className={classes.contextBar}
							value={tabVal}
							onChange={this.tabChange}
							indicatorClassName={classes.tabLine}
							centered
						>
							<Tab
								classes={{
									root: classes.tab,
									label:
										tabVal === 0 ? classes.tabLabelActive : classes.tabLabel,
								}}
								label="Home"
							/>
							<Tab
								label="Feeds"
								classes={{
									root: classes.tab,
									label:
										tabVal === 1 ? classes.tabLabelActive : classes.tabLabel,
								}}
							/>
							<Tab
								label="Rankings"
								classes={{
									root: classes.tab,
									label:
										tabVal === 2 ? classes.tabLabelActive : classes.tabLabel,
								}}
							/>
							<Tab
								label="Live"
								classes={{
									root: classes.tab,
									label:
										tabVal === 3 ? classes.tabLabelActive : classes.tabLabel,
								}}
							/>
							<Tab style={{ display: 'none' }} />
						</Tabs>
						<Hidden smDown>
							<div className={classes.flex} />
						</Hidden>
						<IconButton
							className={classes.logoButton}
							onClick={() => this.props.history.push('/')}
						>
							<img src={miraiLogo} alt="" className={classes.logoImg} />
						</IconButton>
						<div className={classes.flex} />
						<Hidden smDown>
							<SearchBox
								mir={this.props.mir}
								history={history}
								classes={{
									searchBar: classes.searchBar,
									searchInput: classes.searchInput,
									searchIcon: classes.searchIcon,
								}}
							/>
						</Hidden>
						{user && user.noMine ? <Button>Donate</Button> : null}
						<Hidden smUp>
							<IconButton
								onClick={() => {
									this.tabChange(null, 4);
									this.props.history.push('/search');
								}}
								color="contrast"
							>
								<SearchIcon />
							</IconButton>
						</Hidden>
						<div>
							<IconButton
								aria-owns={open ? 'info-menu' : null}
								aria-haspopup="true"
								onClick={this.handleInfoMenu}
								color="contrast"
							>
								{user && user.notifcations ? <BellIcon /> : <BellOffIcon />}
							</IconButton>
							<Menu
								id="info-menu"
								anchorEl={infoEl}
								transformOrigin={{
									vertical: 'bottom',
									horizontal: 'center',
								}}
								MenuListProps={{ style: { padding: 0 } }}
								open={infoOpen}
								onClose={this.handleInfoRequestClose}
							>
								<NotificationForm />
							</Menu>
						</div>
						{user ? (
							<div>
								<IconButton
									aria-owns={open ? 'profile-menu' : null}
									aria-haspopup="true"
									onClick={this.handleMenu}
									color="contrast"
								>
									<Avatar
										src={user.avatar}
										alt=""
										className={classes.userButton}
										classes={{ img: classes.userButtonImg }}
										imgProps={{
											style: { opacity: 0 },
											onLoad: e => (e.currentTarget.style.opacity = null),
										}}
									/>
								</IconButton>
								<Menu
									id="profile-menu"
									anchorEl={anchorEl}
									anchorOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									transformOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									open={open}
									onClose={this.handleRequestClose}
									PopoverClasses={{ paper: classes.menuPadding }}
								>
									<div
										style={{ outline: 'none' }}
										className={classes.profileCard}
									>
										<CardHeader
											className={classes.profileCardHeader}
											onClick={() => {
												this.handleRequestClose();
												this.tabChange(null, 4);
												this.props.history.push('/user');
											}}
											avatar={
												<Avatar
													src={user.avatar}
													classes={{ img: classes.avatarImg }}
													className={classes.avatar}
													imgProps={{
														style: { opacity: 0 },
														onLoad: e => (e.currentTarget.style.opacity = null),
													}}
												/>
											}
											title={user.username}
											subheader={user.nick}
										/>
										<img
											src={user.headers}
											alt=""
											className={classes.profileCardImg}
										/>
										<Divider />
										{/*<form>
                      <FormControl className={classes.statusForm}>
                        <Select
                          value={status}
                          onChange={this.handleStatus}
                          input={<Input name="status" id="status" />}
                        >
                          <MenuItem value={10}>Online</MenuItem>
                          <MenuItem value={20}>Busy</MenuItem>
                          <MenuItem value={30}>Ghost</MenuItem>
                        </Select>
                      </FormControl>
                    </form>
                    <Divider />*/}
										<List>
											<ListItem
												button
												onClick={() => {
													this.handleRequestClose();
													this.tabChange(null, 4);
													this.props.history.push('/settings');
												}}
											>
												<ListItemText primary="Settings" />
											</ListItem>
											<ListItem
												button
												onClick={() => {
													this.handleRequestClose();
													this.props.firebase
														.logout()
														.then(async () =>
															localForage.removeItem('user', () => {
																this.tabChange(null, 4);
																this.props.history.push('/setup');
															})
														)
														.catch(err => console.error(err.message));
												}}
											>
												<ListItemText primary="Log off" />
											</ListItem>
										</List>
									</div>
								</Menu>
							</div>
						) : (
							<IconButton
								onClick={() => {
									this.props.history.push('/setup');
								}}
							>
								<AccountCircle />
							</IconButton>
						)}
					</Toolbar>
				</AppBar>
				{/*<Hidden lgDown>
					<div
						className={classes.sideNav}
						id="sideNav"
						style={watchIsOn ? { display: 'none' } : null}
					>
						<Button
							className={classes.sideButton}
							onClick={() => this.props.history.push('/')}
						>
							<HomeIcon />
							Home
						</Button>
						<Button
							className={classes.sideButton}
							onClick={() => this.props.history.push('/feeds')}
						>
							<DashboardIcon />
							Feeds
						</Button>
						<Button
							className={classes.sideButton}
							onClick={() => this.props.history.push('/rankings')}
						>
							<StarIcon />
							Rankings
						</Button>
						<Button
							className={classes.sideButton}
							onClick={() => this.props.history.push('/live')}
						>
							<LiveTvIcon />
							Live
						</Button>
					</div>
				</Hidden>*/}
				<Drawer
					classes={{ root: classes.drawerBg, paper: classes.drawer }}
					open={drawerOpen}
					onClose={this.toggleDrawer}
					type="temporary"
					ModalProps={{
						keepMounted: true,
					}}
				>
					{menuList}
				</Drawer>
				<div className={classes.content}>{this.props.children}</div>
				{/*<Hidden xlUp>
					<BottomNavigation
						value={tabVal}
						onChange={this.tabChange}
						showLabels
						className={classes.navBar}
						style={watchIsOn ? { display: 'none' } : null}
					>
						<BottomNavigationAction label="Home" icon={<HomeIcon />} />
						<BottomNavigationAction label="Feeds" icon={<DashboardIcon />} />
						<BottomNavigationAction label="Rankings" icon={<StarIcon />} />
						<BottomNavigationAction label="Live" icon={<LiveTvIcon />} />
					</BottomNavigation>
				</Hidden>*/}
			</div>
		);
	}
}

class SearchBox extends Component {
	state = {
		value: '',
		suggestionList: null,
	};

	onChange = e =>
		this.setState({ value: e.currentTarget.value }, () => {
			if (this.props.mir !== null && this.props.mir.twist !== null) {
				this.setState({
					suggestionList: this.props.mir.twist.filter(s =>
						s.name.toLowerCase().match(this.state.value.toLowerCase())
					),
				});
			}
		});

	onSubmit = e => {
		e.preventDefault();
		if (this.state.value.length > 2 && this.state.value !== '')
			this.props.history.push('/search?q=' + this.state.value);
	};

	render() {
		const { value, suggestionList } = this.state;
		const { classes } = this.props;
		return (
			<div>
				<Paper className={classes.searchBar}>
					<SearchIcon className={classes.searchIcon} />
					<form onSubmit={this.onSubmit}>
						<TextField
							autoFocus={true}
							onChange={this.onChange}
							fullWidth
							value={value}
							placeholder={'Min. 3 characters'}
							InputProps={{
								className: classes.searchInput,
								disableUnderline: true,
								fullWidth: true,
							}}
							type={'search'}
						/>
					</form>
				</Paper>
				{suggestionList ? <Paper square /> : null}
			</div>
		);
	}
}

export default firebaseConnect()(
	connect(
		({ firebase: { profile }, mir }) => ({
			profile,
			mir,
		}),
		null
	)(withStyles(styles)(Superbar))
);
