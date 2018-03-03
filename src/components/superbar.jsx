import React, { Component } from "react";
import Button from "material-ui/Button";
import AppBar from "material-ui/AppBar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import { withStyles } from "material-ui/styles";
import Toolbar from "material-ui/Toolbar";
import Menu from "material-ui/Menu";
import MenuIcon from "material-ui-icons/Menu";
import AccountCircle from "material-ui-icons/AccountCircle";
import { grey } from "material-ui/colors";
import Drawer from "material-ui/Drawer";
import checklang from "../checklang";
import List, {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from "material-ui/List";
import AtIcon from "material-ui-icons/Email";
import Hidden from "material-ui/Hidden";
import Divider from "material-ui/Divider";
import { CardHeader } from "material-ui/Card";
import HomeIcon from "material-ui-icons/Home";
import SearchIcon from "material-ui-icons/Search";
import DashboardIcon from "material-ui-icons/Dashboard";
import LiveTvIcon from "material-ui-icons/LiveTv";
import BellIcon from "material-ui-icons/Notifications";
import BellOffIcon from "material-ui-icons/NotificationsNone";
import StarIcon from "material-ui-icons/Star";
import Avatar from "material-ui/Avatar";
import ArrowBackIcon from "material-ui-icons/ArrowBack";
import MoreVert from "material-ui-icons/MoreVert";
import CloseIcon from "material-ui-icons/Close";
import AppsIcon from "material-ui-icons/Apps";
import strings from "../strings.json";
import * as Vibrant from "node-vibrant";

import localForage from "localforage";

import { connect } from "react-redux";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";

import Tabs, { Tab } from "material-ui/Tabs";

import { firebaseConnect, isEmpty } from "react-redux-firebase";
import miraiLogo from "../assets/mirai-icon.png";
import NotificationForm from "./notificationForm";
import { history } from "../store";
import MirPlayer from "./mirplayer";
import { Dialogue } from "./layouts";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    width: "100%",
    transition: theme.transitions.create(["all"]),
    paddingLeft: "env(safe-area-inset-left)",
    paddingRight: "env(safe-area-inset-right)"
  },
  mainToolbar: {
    maxWidth: "1970px",
    marginLeft: "auto",
    width: "100%",
    marginRight: "auto"
  },
  gd: {
    width: "100%",
    height: 82,
    position: "fixed",
    transition: theme.transitions.create(["all"]),
    background: "linear-gradient(to top, transparent, rgba(0,0,0,1))"
  },
  appBar: {
    background: theme.palette.background.appBar
    // borderBottom: `1px solid rgba(255,255,255,0)`,
  },
  appBarTop: {
    background: "rgba(0,0,0,.18)",
    boxShadow: "none",
    // borderBottom: `1px solid rgba(255,255,255,.16)`,
    backdropFilter: "blur(10px)"
  },
  appFrame: {
    position: "relative",
    display: "flex",
    width: "100%",
    height: "100%"
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  logoButton: {
    position: "absolute",
    left: "50%",
    right: "50%",
    transform: "translate(-50%, -50%)",
    margin: "auto",
    top: theme.spacing.unit * 4,
    [theme.breakpoints.down("sm")]: {
      position: "initial",
      left: "initial",
      right: "initial",
      transform: "initial",
      margin: "auto",
      top: "initial"
    }
  },
  userButton: {
    width: 32,
    height: 32,
    margin: "auto",
    overflow: "hidden"
  },
  userButtonImg: {
    height: 32,
    objectFit: "cover"
  },
  list: {
    width: drawerWidth,
    [theme.breakpoints.up("md")]: {
      width: "100%"
    }
  },
  listFull: {
    width: "auto"
  },
  listDivider: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    [theme.breakpoints.up("md")]: {
      marginLeft: 0,
      marginRight: 0
    }
  },
  drawerToolbar: theme.mixins.toolbar,
  drawer: {
    width: drawerWidth,
    height: "100%",
    background:
      window.safari && window.navigator.userAgent.indexOf("Edge") > -1
        ? "rgba(0,0,0,.1)"
        : "#111",
    backdropFilter: "blur(10px)",
    boxShadow:
      window.safari && window.navigator.userAgent.indexOf("Edge") > -1
        ? "none"
        : null
  },
  drawerBg: {},
  drawerDocked: {
    height: "100%",
    position: "fixed"
  },
  menuPadding: {
    padding: 0,
    overflow: "initial"
  },
  profileCard: {
    width: 345
  },
  profileCardHeader: {},
  profileCardAction: {
    margin: "auto"
  },
  profileCardImg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 96 + 8,
    objectFit: "cover",
    width: "100%",
    opacity: 0.4,
    zIndex: -1,
    transition: theme.transitions.create(["all"])
  },
  searchContainer: {
    flexGrow: 1,
    position: "relative"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  textField: {
    width: "100%",
    padding: 0,
    "label + &": {
      marginTop: theme.spacing.unit * 3
    }
  },
  input: {
    borderRadius: 4,
    background: grey[900],
    fontSize: 16,
    textAlign: "center",
    padding: "10px 12px",
    width: "calc(100% - 24px)",
    transition: theme.transitions.create(["box-shadow"]),
    "&:focus": {
      boxShadow: "0 1pt 0.2rem rgba(0,0,0,.25)"
    }
  },
  content: {
    backgroundColor: theme.palette.background.default,
    width: "100%",
    height: "calc(100% - 56px)",
    [theme.breakpoints.up("sm")]: {
      height: "calc(100% - 64px)"
    },
    position: "relative",
    "& > div": {
      position: "absolute",
      width: "100%",
      [theme.breakpoints.down("md")]: {
        marginBottom: 56
      }
    }
  },
  footerCopy: {
    fontWeight: 700,
    padding: theme.spacing.unit * 3,
    fontSize: theme.typography.pxToRem(12),
    color: grey[800],
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing.unit * 2
    }
  },
  contextBar: {
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  tabLabel: {
    opacity: 0.5,
    fontSize: theme.typography.pxToRem(14),
    textTransform: "initial"
  },
  tabLabelActive: {
    fontWeight: 700,
    fontSize: theme.typography.pxToRem(14),
    textTransform: "initial"
  },
  tabLine: {
    filter: "drop-shadow(0 1px 12px rgba(0,0,255,.2))",
    height: 2,
    background: "white",
    display: "none"
  },
  tab: {
    height: 64,
    [theme.breakpoints.down("md")]: {
      minWidth: 72
    }
  },
  avatar: {
    height: 64,
    width: 64
  },
  avatarImg: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    transition: theme.transitions.create(["all"])
  },
  statusForm: {
    width: "100%"
  },
  navBar: {
    position: "fixed",
    width: "100%",
    bottom: 0,
    zIndex: 9999
  },
  sideNav: {
    position: "fixed",
    height: "100%",
    top: theme.spacing.unit * 8,
    left: 0,
    display: "flex",
    flexDirection: "column",
    margin: theme.spacing.unit,
    zIndex: 1200
  },
  sideButton: {
    display: "flex",
    "& > span": {
      flexDirection: "column",
      textTransform: "initial"
    }
  },
  searchBar: {
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(255,255,255,.1)",
    boxShadow: "none",
    maxWidth: 1970,
    minWidth: 300,
    display: "flex",
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      background: "rgba(255,255,255,.08)",
      border: "1px solid rgba(255,255,255,.15)"
    },
    "&:focus": {
      background: "rgba(255,255,255,.08)",
      border: "1px solid rgba(255,255,255,.15)"
    },
    margin: "auto",
    marginRight: theme.spacing.unit
  },
  searchInput: {
    boxSizing: "border-box"
  },
  searchIcon: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    margin: "auto 0",
    width: "auto"
  },
  barTitle: {
    fontFamily: "'Fugaz One', cursive"
  },
  logoImg: {
    height: 38,
    margin: "auto",
    position: "relative"
  },
  metashit: {
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  tabwrapper: {
    [theme.breakpoints.up("md")]: {
      flexDirection: "row"
    }
  },
  tablabelcontainer: {
    [theme.breakpoints.down("md")]: {
      display: "none"
    }
  },
  quicklinks: {
    display: "flex",
    width: "100%",
    margin: "0 16px",
    boxSizing: "border-box",
    [theme.breakpoints.up("md")]: {
      margin: "auto",
      width: "auto"
    }
  }
});

class Superbar extends Component {
  state = {
    anchorEl: null,
    infoEl: null,
    drawerOpen: false,
    searchVal: "",
    notAtTop: true,
    currentPage: "",
    watchIsOn: false,
    status: 0,
    mirTitle: "",
    scrolling: false,
    commit: "d12",
    hue: null,
    hueVib: null,
    hueVibN: null,
    lang: strings.enus,
    userMenuHover: false,
    onlineUsers: [],
      donateModal: false
  };

  componentWillMount = () => {
    if (this.props.history.location.pathname === "/")
      this.setState({ tabVal: 0, currentPage: "Mirai" });
    else {
      this.setState({ tabVal: 4 });
    }

    if (
      this.props.history.location.pathname === "/watch" &&
      window.location.pathname === "/watch"
    ) {
      this.setState({ watchIsOn: true });
    } else {
      this.setState({ watchIsOn: false });
    }

    checklang(this);
  };

  componentDidMount = async () => {
    window.addEventListener("scroll", this.handleScroll);
    this.vibrance();
    await this.getUsersOnline();
  };

  componentWillReceiveProps = nextProps => {
    if (this.props.mir)
      if (this.props.mir.title !== nextProps.mir.title) {
        this.setState({ mirTitle: "" }, () =>
          this.setState({ mirTitle: nextProps.mir.title })
        );
      }
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
    this.listenToHistory();
  };

  handleScroll = event => {
    if (window.scrollY === 0 && this.state.scrolling === true)
      this.setState({ scrolling: false }, () => {
        if (document.getElementById("fabShowButton") && !window.safari)
          document.getElementById("fabShowButton").style.opacity = 0;
        const mainH = document.getElementById("mainHeader");
        const mainC = document.getElementById("mainCard");
        const commando = document.getElementById("commandoBar");
        if (mainH && mainC && commando) {
          mainH.classList.remove("compacMode");
          commando.classList.remove("fixedcommando");
        }
      });
    else if (window.scrollY !== 0 && this.state.scrolling !== true)
      this.setState({ scrolling: true }, () => {
        if (document.getElementById("fabShowButton"))
          document.getElementById("fabShowButton").style.opacity = 1;
        const mainH = document.getElementById("mainHeader");
        const mainC = document.getElementById("mainCard");
        const commando = document.getElementById("commandoBar");
        if (mainH && mainC && commando) {
          mainH.classList.add("compacMode");
          commando.classList.add("fixedcommando");
        }
      });
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
          this.props.history.push("/");
          break;
        case 1:
          this.props.history.push("/feeds");
          break;
        case 2:
          this.props.history.push("/rankings");
          break;
        case 3:
          this.props.history.push("/live");
          break;
        default:
          break;
      }
    });
  };

  listenToHistory = this.props.history.listen(location => {
    const { superbar } = this.state.lang;
    switch (location.pathname) {
      case "/":
        this.setState({
          currentPage: superbar.home,
          tabVal: 0,
          watchIsOn: false
        });
        break;
      case "/feeds":
        this.setState({
          currentPage: superbar.feeds,
          tabVal: 1,
          watchIsOn: false
        });
        break;
      case "/rankings":
        this.setState({
          currentPage: superbar.rankings,
          tabVal: 2,
          watchIsOn: false
        });
        break;
      case "/live":
        this.setState({
          currentPage: superbar.live,
          tabVal: 3,
          watchIsOn: false
        });
        break;
      case "/user":
        this.setState({
          currentPage: superbar.user,
          tabVal: 4,
          watchIsOn: false
        });
        break;
      case "/history":
        this.setState({
          currentPage: superbar.history,
          tabVal: 4,
          watchIsOn: false
        });
        break;
      case "/later":
        this.setState({
          currentPage: superbar.later,
          tabVal: 4,
          watchIsOn: false
        });
        break;
      case "/help":
        this.setState({
          currentPage: superbar.help,
          tabVal: 4,
          watchIsOn: false
        });
        break;
      case "/studio":
        this.setState({
          currentPage: "",
          tabVal: 4,
          watchIsOn: false
        });
        break;
      case "/fig":
        this.setState({
          currentPage: "",
          tabVal: 4,
          watchIsOn: false
        });
        break;
      case "/show":
        this.setState({
          currentPage: "",
          tabVal: 4,
          watchIsOn: false
        });
        break;
      case "/settings":
        this.setState({
          currentPage: superbar.usermenu.settings,
          tabVal: 4,
          watchIsOn: false
        });
        break;
      case "/setup":
        this.setState({ currentPage: "Setup", tabVal: 4, watchIsOn: false });
        break;
      case "/wizard":
        this.setState({ currentPage: "Wizard", tabVal: 4, watchIsOn: false });
        break;
      case "/watch":
        this.setState({ currentPage: "", tabVaL: 4, watchIsOn: true });
        break;
      case "/tag":
        this.setState({ currentPage: "", tabVal: 4, watchIsOn: false });
        break;
      case "/tou":
        this.setState({
          currentPage: superbar.termsofusage,
          tabVal: 4,
          watchIsOn: false
        });
        break;
      case "/monika":
        this.setState({ currentPage: "Monika", tabVal: 4, watchIsOn: false });
        break;
      case "/search":
        this.setState({
          currentPage: superbar.search,
          tabVal: 4,
          watchIsOn: false
        });
        break;
      case "/dev/player":
        this.setState({ currentPage: "Developer", tabVaL: 4 });
        break;
      case "/dev/db":
        this.setState({ currentPage: "Developer", tabVaL: 4 });
        break;
      default:
        break;
    }
  });

  revealBar = () => document.getElementById("superBar").style.opacity === 1;

  hideBar = () => document.getElementById("superBar").style.opacity === 0;

  vibrance = async () => {
    const image = this.props.profile ? this.props.profile.avatar : null;
    const hues = await localForage.getItem("user-hue");

    if (image && !hues)
      Vibrant.from(`https://cors-anywhere.herokuapp.com/${image}`).getPalette(
        (err, pal) => {
          if (pal) {
            this.setState({
              hue: pal.DarkMuted && pal.DarkMuted.getHex(),
              hueVib: pal.LightVibrant && pal.LightVibrant.getHex(),
              hueVibN: pal.DarkVibrant && pal.DarkVibrant.getHex()
            });
          }
        }
      );
    else if (image && hues && hues.image !== image)
      Vibrant.from(`https://cors-anywhere.herokuapp.com/${image}`).getPalette(
        (err, pal) => {
          if (pal) {
            this.setState({
              hue: pal.DarkMuted && pal.DarkMuted.getHex(),
              hueVib: pal.LightVibrant && pal.LightVibrant.getHex(),
              hueVibN: pal.DarkVibrant && pal.DarkVibrant.getHex()
            });
          }
        }
      );
    else if (image && hues)
      this.setState({
        hue: hues.hue,
        hueVib: hues.vib,
        hueVibN: hues.vibn
      });

    setTimeout(() => this.setState({ loading: false }), 200);
  };

  handleMenuOver = () =>
    this.setState({ userMenuHover: !this.state.userMenuHover });

  getUsersOnline = () =>
    this.props.firebase
      .database()
      .ref("presence")
      .on("value", value =>
        this.setState({
          onlineUsers: value === undefined ? 0 : value.val()
        })
      );

  openDonate = () => this.setState({donateModal: true, anchorEl: null });

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
      lang,
      userMenuHover,
      onlineUsers,
        donateModal
    } = this.state;

    const user = !isEmpty(this.props.profile) ? this.props.profile : null;

    const notifications = user
      ? user.notifications
        ? Object.values(user.notifications).filter(n => n.ignored === false)
        : null
      : null;

    const open = Boolean(anchorEl);
    const infoOpen = Boolean(infoEl);

    const metaShit = (
      <div className={classes.metashit}>
        <Typography className={classes.footerCopy} variant="headline">
          Mirai preview 2
          <br />
          {onlineUsers ? Object.values(onlineUsers).length : 0} users online
          <br />
          {this.props.mir && this.props.mir.twist
            ? `${Object.keys(this.props.mir.twist).length -
                1} animes in database`
            : null}
          <br />2018 thor "afrojezus"
        </Typography>
        <div className={classes.quicklinks}>
          <IconButton
            onClick={() => {
              this.toggleDrawer();
              window.open("https://discord.gg/gt69fbe");
            }}
          >
            <svg style={{ width: 28, height: 28 }} viewBox="0 0 24 24">
              <path
                fill="#ffffff"
                d="M22,24L16.75,19L17.38,21H4.5A2.5,2.5 0 0,1 2,18.5V3.5A2.5,2.5 0 0,1 4.5,1H19.5A2.5,2.5 0 0,1 22,3.5V24M12,6.8C9.32,6.8 7.44,7.95 7.44,7.95C8.47,7.03 10.27,6.5 10.27,6.5L10.1,6.33C8.41,6.36 6.88,7.53 6.88,7.53C5.16,11.12 5.27,14.22 5.27,14.22C6.67,16.03 8.75,15.9 8.75,15.9L9.46,15C8.21,14.73 7.42,13.62 7.42,13.62C7.42,13.62 9.3,14.9 12,14.9C14.7,14.9 16.58,13.62 16.58,13.62C16.58,13.62 15.79,14.73 14.54,15L15.25,15.9C15.25,15.9 17.33,16.03 18.73,14.22C18.73,14.22 18.84,11.12 17.12,7.53C17.12,7.53 15.59,6.36 13.9,6.33L13.73,6.5C13.73,6.5 15.53,7.03 16.56,7.95C16.56,7.95 14.68,6.8 12,6.8M9.93,10.59C10.58,10.59 11.11,11.16 11.1,11.86C11.1,12.55 10.58,13.13 9.93,13.13C9.29,13.13 8.77,12.55 8.77,11.86C8.77,11.16 9.28,10.59 9.93,10.59M14.1,10.59C14.75,10.59 15.27,11.16 15.27,11.86C15.27,12.55 14.75,13.13 14.1,13.13C13.46,13.13 12.94,12.55 12.94,11.86C12.94,11.16 13.45,10.59 14.1,10.59Z"
              />
            </svg>
          </IconButton>
          <IconButton
            onClick={() => {
              this.toggleDrawer();
              window.open("https://github.com/afrojezus/mirai");
            }}
          >
            <svg style={{ width: 28, height: 28 }} viewBox="0 0 24 24">
              <path
                fill="#ffffff"
                d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
              />
            </svg>
          </IconButton>
          <IconButton
            onClick={() => {
              this.toggleDrawer();
              window.open("mailto:thoralf21@gmail.com");
            }}
          >
            <AtIcon />
          </IconButton>
        </div>
      </div>
    );

    const menuList = (
      <div className={classes.list}>
        <Hidden mdUp>
          <Toolbar className={classes.drawerToolbar}>
            <Typography variant="title">Mirai</Typography>
          </Toolbar>
        </Hidden>
        <Hidden mdUp>
          <Divider />
        </Hidden>
        <Hidden mdUp>
          <List>
            <ListItem
              button
              onClick={() => {
                this.toggleDrawer();
                this.tabChange(null, 0);
              }}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={lang.superbar.home} />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                this.toggleDrawer();
                this.tabChange(null, 1);
              }}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary={lang.superbar.feeds} />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                this.toggleDrawer();
                this.tabChange(null, 2);
              }}
            >
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText primary={lang.superbar.rankings} />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                this.toggleDrawer();
                this.tabChange(null, 3);
              }}
            >
              <ListItemIcon>
                <LiveTvIcon />
              </ListItemIcon>
              <ListItemText primary={lang.superbar.live} />
            </ListItem>
          </List>
        </Hidden>
        {user ? (
          <div>
            <Hidden mdUp>
              <Divider className={classes.listDivider} />
            </Hidden>
            <List
              subheader={
                <Hidden mdUp>
                  <ListSubheader>{lang.superbar.you}</ListSubheader>
                </Hidden>
              }
            >
              <ListItem
                button
                onClick={() => {
                  this.handleRequestClose();
                  this.toggleDrawer();
                  this.tabChange(null, 4);
                  this.props.history.push("/history");
                }}
              >
                <ListItemText primary={lang.superbar.history} />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  this.handleRequestClose();
                  this.toggleDrawer();
                  this.tabChange(null, 4);
                  this.props.history.push("/later");
                }}
              >
                <ListItemText primary={lang.superbar.later} />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  this.handleRequestClose();
                  this.toggleDrawer();
                  this.tabChange(null, 4);
                  this.props.history.push("/user#favorites");
                }}
              >
                <ListItemText primary={lang.superbar.favorites} />
              </ListItem>
            </List>
          </div>
        ) : null}
        <Divider className={classes.listDivider} />
        <List>
          <ListItem
            button
            onClick={() => {
              this.handleRequestClose();
              this.toggleDrawer();
              this.tabChange(null, 4);
              this.props.history.push("/help");
            }}
          >
            <ListItemText primary={lang.superbar.help} />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              this.handleRequestClose();
              this.toggleDrawer();
              window.open("https://github.com/afrojezus/mirai/issues");
            }}
          >
            <ListItemText primary={lang.superbar.feedback} />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              this.handleRequestClose();
              this.toggleDrawer();
              this.tabChange(null, 4);
              this.props.history.push("/tou");
            }}
          >
            <ListItemText primary={lang.superbar.termsofusage} />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              this.handleRequestClose();
              this.toggleDrawer();
              this.tabChange(null, 4);
              this.props.history.push("/monika");
            }}
          >
            <ListItemText primary="Monika" />
          </ListItem>
          <ListItem button onClick={this.openDonate}>
            <ListItemText primary={lang.superbar.donate} />
          </ListItem>
        </List>
        <Divider className={classes.listDivider} />
        <Hidden mdUp>{metaShit}</Hidden>
      </div>
    );

    return (
      <div className={classes.appFrame}>
        <AppBar
          id="superBar"
          classes={{ root: classes.root }}
          className={
            scrolling &&
            !(window.navigator.userAgent.indexOf("Edge") > -1) &&
            !window.safari
              ? classes.appBar
              : classes.appBarTop
          }
          style={
            watchIsOn
              ? { display: "none" }
              : { transform: "translate3d(0,0,0)" }
          }
        >
          {window.safari &&
          window.navigator.userAgent.indexOf("Edge") > -1 ? null : (
            <div
              className={classes.gd}
              style={scrolling ? { opacity: 0 } : { opacity: 0.2 }}
            />
          )}
          <Toolbar className={classes.mainToolbar}>
            <Hidden mdUp>
              <IconButton
                className={classes.menuButton}
                contrast={"default"}
                aria-label="Menu"
                onClick={this.toggleDrawer}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
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
                  wrapper: classes.tabwrapper,
                  labelContainer: classes.tablabelcontainer
                }}
                icon={<HomeIcon />}
                label={lang.superbar.home}
              />
              <Tab
                icon={<DashboardIcon />}
                classes={{
                  root: classes.tab,
                  label:
                    tabVal === 1 ? classes.tabLabelActive : classes.tabLabel,
                  wrapper: classes.tabwrapper,
                  labelContainer: classes.tablabelcontainer
                }}
                label={lang.superbar.feeds}
              />
              <Tab
                icon={<StarIcon />}
                classes={{
                  root: classes.tab,
                  label:
                    tabVal === 2 ? classes.tabLabelActive : classes.tabLabel,
                  wrapper: classes.tabwrapper,
                  labelContainer: classes.tablabelcontainer
                }}
                label={lang.superbar.rankings}
              />
              <Tab
                icon={<LiveTvIcon />}
                classes={{
                  root: classes.tab,
                  label:
                    tabVal === 3 ? classes.tabLabelActive : classes.tabLabel,
                  wrapper: classes.tabwrapper,
                  labelContainer: classes.tablabelcontainer
                }}
                label={lang.superbar.live}
              />
              <Tab style={{ display: "none" }} />
            </Tabs>
            <Hidden smDown>
              <div className={classes.flex} />
            </Hidden>
            <Hidden mdUp>
              <Typography variant="title">
                {mirTitle !== "" ? mirTitle : currentPage}
              </Typography>
            </Hidden>
            <Hidden smDown>
              <IconButton
                className={classes.logoButton}
                onClick={() => window.scroll({ top: 0, behavior: "smooth" })}
              >
                <img src={miraiLogo} alt="" className={classes.logoImg} />
              </IconButton>
            </Hidden>
            <Hidden mdUp>
              <div className={classes.flex} />
            </Hidden>
            <Hidden smDown>
              <SearchBox
                mir={this.props.mir}
                history={history}
                classes={{
                  searchBar: classes.searchBar,
                  searchInput: classes.searchInput,
                  searchIcon: classes.searchIcon
                }}
              />
            </Hidden>
            <Hidden mdUp>
              <IconButton
                onClick={() => this.props.history.push("/search")}
                contrast={"default"}
              >
                <SearchIcon />
              </IconButton>
            </Hidden>
            <div>
              <IconButton
                disabled={!user}
                aria-owns={open ? "info-menu" : null}
                aria-haspopup="true"
                onClick={this.handleInfoMenu}
                contrast={"default"}
              >
                {notifications && notifications.length > 0 ? (
                  <BellIcon />
                ) : (
                  <BellOffIcon />
                )}
              </IconButton>
              <Menu
                id="info-menu"
                anchorEl={infoEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                MenuListProps={{ style: { padding: 0 } }}
                open={infoOpen}
                onClose={this.handleInfoRequestClose}
              >
                <NotificationForm />
              </Menu>
            </div>
            <div>
              <IconButton
                aria-owns={open ? "profile-menu" : null}
                aria-haspopup="true"
                onClick={this.handleMenu}
                contrast={"default"}
              >
                {user ? (
                  <Avatar
                    src={user.avatar}
                    alt=""
                    className={classes.userButton}
                    classes={{ img: classes.userButtonImg }}
                    imgProps={{
                      style: { opacity: 0 },
                      onLoad: e => (e.currentTarget.style.opacity = null)
                    }}
                  />
                ) : (
                  <MoreVert />
                )}
              </IconButton>
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                open={open}
                PaperProps={{
                  style: {
                    maxHeight: window.innerHeight / 1.05,
					  overflowY: "auto",
					zIndex: 2000
                  }
                }}
                onClose={this.handleRequestClose}
                PopoverClasses={{ paper: classes.menuPadding }}
              >
                <div
                  style={{ outline: "none", maxHeight: "inherit" }}
                  className={classes.profileCard}
                >
                  <CardHeader
                    className={classes.profileCardHeader}
                    onClick={() => {
                      if (user) {
                        this.handleRequestClose();
                        this.tabChange(null, 4);
                        this.props.history.push("/user");
                      }
                      return null;
                    }}
                    classes={{
                      action: classes.profileCardAction
                    }}
                    avatar={
                      user ? (
                        <Avatar
                          src={user.avatar}
                          classes={{ img: classes.avatarImg }}
                          className={classes.avatar}
                          imgProps={{
                            style: { opacity: 0 },
                            onLoad: e => (e.currentTarget.style.opacity = null)
                          }}
                        />
                      ) : null
                    }
                    title={user ? user.username : "Mirai"}
                    subheader={
                      user ? user.nick : lang.superbar.usermenu.subheader
                    }
                    action={
                      user ? null : (
                        <Button
                          onClick={() => {
                            this.handleRequestClose();
                            this.tabChange(null, 4);
                            this.props.history.push("/setup");
                          }}
                        >
                          {lang.superbar.usermenu.loginbutton}
                        </Button>
                      )
                    }
                  />
                  {user ? (
                    <img
                      src={user.headers}
                      alt=""
                      className={classes.profileCardImg}
                    />
                  ) : null}
                  {/* <form>
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
                    <Divider /> */}
                  {!isEmpty(this.props.profile) &&
                  this.props.profile.isDeveloper === true ? (
                    <List
                      subheader={
                        <ListSubheader>
                          {lang.superbar.usermenu.developer}
                        </ListSubheader>
                      }
                    >
                      <ListItem
                        button
                        onClick={() => {
                          this.handleRequestClose();
                          this.props.history.push("/dev/db");
                        }}
                      >
                        <ListItemText
                          primary={lang.superbar.usermenu.developerDb}
                        />
                      </ListItem>
                      <ListItem
                        button
                        onClick={() => {
                          this.handleRequestClose();
                          this.props.history.push("/dev/player");
                        }}
                      >
                        <ListItemText
                          primary={lang.superbar.usermenu.developerMedia}
                        />
                      </ListItem>
                      <Divider />
                    </List>
                  ) : null}
                  <Hidden smDown>{menuList}</Hidden>
                  {user ? (
                    <List>
                      <ListItem
                        button
                        onClick={() => {
                          this.handleRequestClose();
                          this.tabChange(null, 4);
                          this.props.history.push("/settings");
                        }}
                      >
                        <ListItemText
                          primary={lang.superbar.usermenu.settings}
                        />
                      </ListItem>
                      <ListItem
                        button
                        onClick={() => {
                          this.handleRequestClose();
                          this.props.firebase
                            .logout()
                            .then(async () =>
                              localForage.removeItem("user", async () => {
                                this.tabChange(null, 4);
                                this.props.history.push("/setup");
                                await localForage.removeItem("player-state");
                              })
                            )
                            .catch(err => console.error(err.message));
                        }}
                      >
                        <ListItemText
                          primary={lang.superbar.usermenu.signout}
                        />
                      </ListItem>
                    </List>
                  ) : null}
                  <Hidden smDown>{metaShit}</Hidden>
                </div>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        {/* <Hidden lgDown>
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
				</Hidden> */}
        <Hidden mdUp>
          <Drawer
            classes={{ paper: classes.drawer }}
            open={drawerOpen}
            onClose={this.toggleDrawer}
            type="temporary"
            ModalProps={{
              keepMounted: true
            }}
          >
            {menuList}
          </Drawer>
        </Hidden>
          <Dialogue open={donateModal} onClose={() => this.setState({ donateModal: false })}
                    title={lang.superbar.donate}>
              <Typography variant='body1'>Donate to the Mirai project to bettern the quality of the application and encourage newer features.</Typography>
          </Dialogue>
        <div className={classes.content}>{this.props.children}</div>
        {/* <Hidden xlUp>
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
				</Hidden> */}
        <MirPlayer fullSize={watchIsOn} />
      </div>
    );
  }
}

class SearchBox extends Component {
  state = {
    value: "",
    suggestionList: null,
    lang: strings.enus
  };

  componentWillMount = () => {
    checklang(this);
  };

  onChange = e =>
    this.setState({ value: e.currentTarget.value }, () => {
      if (this.props.mir !== null && this.props.mir.twist !== null) {
        this.setState({
          suggestionList: this.props.mir.twist.filter(s =>
            s.name.toLowerCase().match(this.state.value.toLowerCase())
          )
        });
      }
    });

  onSubmit = e => {
    e.preventDefault();
    if (this.state.value.length > 2 && this.state.value !== "") {
      if (
        this.state.value.match("cory in the house") ||
        this.state.value.match("Cory in the house") ||
        this.state.value.match("Cory In The House")
      ) {
        return this.props.history.push(`/show?s=99999999999`);
      } else {
        return this.props.history.push(`/search?q=${this.state.value}`);
      }
    }
  };

  render() {
    const { value, suggestionList, lang } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.searchBar}>
          <SearchIcon className={classes.searchIcon} />
          <form onSubmit={this.onSubmit} style={{ width: "100%" }}>
            <TextField
              autoFocus
              onChange={this.onChange}
              fullWidth
              value={value}
              placeholder={lang.superbar.searchbox.placeholder}
              InputProps={{
                className: classes.searchInput,
                disableUnderline: true,
                fullWidth: true
              }}
              type="search"
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
      mir
    }),
    null
  )(withStyles(styles)(Superbar))
);
