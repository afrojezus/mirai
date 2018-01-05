import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "material-ui/Button";
import AppBar from "material-ui/AppBar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import { withStyles } from "material-ui/styles";
import Toolbar from "material-ui/Toolbar";
import Menu, { MenuItem } from "material-ui/Menu";
import MenuIcon from "material-ui-icons/Menu";
import AccountCircle from "material-ui-icons/AccountCircle";
import Info from "material-ui-icons/Info";
import miraiLogo from "../assets/mirai-icon.png";
import { grey } from "material-ui/colors";
import Drawer from "material-ui/Drawer";
import List, {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from "material-ui/List";
import Hidden from "material-ui/Hidden";
import Divider from "material-ui/Divider";
import Card, {
  CardContent,
  CardMedia,
  CardActions,
  CardHeader
} from "material-ui/Card";
import HomeIcon from "material-ui-icons/Home";
import SearchIcon from "material-ui-icons/Search";
import DashboardIcon from "material-ui-icons/Dashboard";
import LiveTvIcon from "material-ui-icons/LiveTv";
import BellIcon from "material-ui-icons/Notifications";
import BellOffIcon from "material-ui-icons/NotificationsNone";
import StarIcon from "material-ui-icons/Star";
import Avatar from "material-ui/Avatar";
import MoreVert from "material-ui-icons/MoreVert";
import Input, { InputLabel } from "material-ui/Input";
import { FormControl, FormHelperText } from "material-ui/Form";
import Select from "material-ui/Select";

import localForage from "localforage";

import Autosuggest from "react-autosuggest";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";

import Tabs, { Tab } from "material-ui/Tabs";

import { Auth, Database } from "../utils/firebase";

import NotificationForm from "./notificationForm";

const renderInput = inputProps => {
  const { classes, autoFocus, value, ref, ...other } = inputProps;

  return (
    <TextField
      autoFocus={autoFocus}
      className={classes.textField}
      value={value}
      inputRef={ref}
      InputProps={{
        classes: {
          input: classes.input
        },
        ...other
      }}
    />
  );
};

const renderSuggestion = (suggestion, { query, isHighlighted }) => {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={index} style={{ fontWeight: 300 }}>
              {part.text}
            </span>
          ) : (
            <strong key={index} style={{ fontWeight: 500 }}>
              {part.text}
            </strong>
          );
        })}
      </div>
    </MenuItem>
  );
};

const renderSuggestionsContainer = options => {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
};

const getSuggestionValue = suggestion => {
  return suggestion.name;
};

const getSuggestions = (list, value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : list.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.name.toLowerCase().slice(0, inputLength) === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
};

const drawerWidth = 240;

const styles = theme => ({
  root: {
    width: "100%",
    transition: theme.transitions.create(["all"])
  },
  gd: {
    width: "100%",
    height: 82,
    position: "fixed",
    transition: theme.transitions.create(["all"]),
    background: "linear-gradient(to top, transparent, rgba(0,0,0,.9))"
  },
  appBar: {
    background: "transparent",
    boxShadow: "none"
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
    width: 32,
    borderRadius: "50%"
  },
  logoTitle: {
    marginLeft: -24
  },
  barTitle: {
    marginLeft: 24
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
    width: drawerWidth
  },
  listFull: {
    width: "auto"
  },
  listDivider: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  drawerToolbar: theme.mixins.toolbar,
  drawer: {
    width: drawerWidth,
    height: "100%",
    backgroundColor: "#111"
  },
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
  profileCardHeader: {
    cursor: "pointer"
  },
  profileCardImg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 100 + 8,
    objectFit: "cover",
    width: "100%",
    opacity: 0.4,
    zIndex: -1
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
      width: "100%"
    }
  },
  footerCopy: {
    fontWeight: 700,
    position: "fixed",
    bottom: 0,
    padding: theme.spacing.unit * 3,
    fontSize: 12,
    color: grey[800]
  },
  contextBar: {
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  tabLabel: {
    opacity: 0.5,
    fontSize: 14,
    textTransform: "initial"
  },
  tabLabelActive: {
    fontWeight: 700,
    fontSize: 14,
    textTransform: "initial"
  },
  tabLine: {
    filter: "drop-shadow(0 1px 12px rgba(0,0,255,.2))",
    height: 4
  },
  avatar: {
    marginLeft: -theme.spacing.unit * 4,
    height: 64,
    width: 64,
    boxShadow: "0 3px 16px rgba(0,0,0,.5)"
  },
  avatarImg: {
    height: "100%",
    width: "100%",
    objectFit: "cover"
  }
});

class Superbar extends Component {
  static propTypes = {
    user: PropTypes.object
  };

  state = {
    anchorEl: null,
    infoEl: null,
    drawerOpen: false,
    searchVal: "",
    notAtTop: true,
    currentPage: "",
    watchIsOn: false
  };

  componentWillMount = () => {
    if (this.props.history.location.pathname === "/")
      this.setState({ tabVal: 0 });
    else {
      this.setState({ tabVal: 4 });
    }
    this.pageChange();
  };

  /*componentDidMount = () => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 0) {
        this.setState({ notAtTop: true });
      } else {
        this.setState({ notAtTop: false });
      }
    });
  };*/

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

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(this.props.twistBase, value)
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      searchVal: newValue
    });
  };

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

  pageChange = () => {
    this.props.history.listen((location, action) => {
      switch (location.pathname) {
        case "/":
          this.setState({ currentPage: "", tabVal: 0, watchIsOn: false });
          break;
        case "/feeds":
          this.setState({ currentPage: "", tabVal: 1, watchIsOn: false });
          break;
        case "/rankings":
          this.setState({ currentPage: "", tabVal: 2, watchIsOn: false });
          break;
        case "/live":
          this.setState({ currentPage: "", tabVal: 3, watchIsOn: false });
          break;
        case "/user":
          this.setState({ currentPage: "", tabVal: 4, watchIsOn: false });
          break;
        case "/history":
          this.setState({
            currentPage: "History",
            tabVal: 4,
            watchIsOn: false
          });
          break;
        case "/later":
          this.setState({ currentPage: "Later", tabVal: 4, watchIsOn: false });
          break;
        case "/help":
          this.setState({ currentPage: "Help", tabVal: 4, watchIsOn: false });
          break;
        case "/show":
          this.setState({ currentPage: "", tabVal: 4, watchIsOn: false });
          break;
        case "/settings":
          this.setState({ currentPage: "", tabVal: 4, watchIsOn: false });
          break;
        case "/setup":
          this.setState({ currentPage: "", tabVal: 4, watchIsOn: false });
          break;
        case "/wizard":
          this.setState({ currentPage: "", tabVal: 4, watchIsOn: false });
          break;
        case "/watch":
          this.setState({ currentPage: "", tabVaL: 4, watchIsOn: true });
          break;
        case "/monika":
          this.setState({ currentPage: "", tabVal: 4, watchIsOn: false });
          break;
        case "/search":
          this.setState({ currentPage: "", tabVal: 4, watchIsOn: false });
          break;
        default:
          break;
      }
    });
  };

  revealBar = () => (document.getElementById("superBar").style.opacity = 1);

  hideBar = () => (document.getElementById("superBar").style.opacity = 0);

  handleStatus = e =>
    this.setState({ [e.target.value]: e.target.value }, async () =>
      Database.ref("users")
        .child(this.props.user.userID)
        .update({ status: e.target.value })
    );

  render() {
    const { classes, user, twistBase, status } = this.props;
    const {
      anchorEl,
      infoEl,
      drawerOpen,
      searchVal,
      notAtTop,
      tabVal,
      currentPage,
      watchIsOn
    } = this.state;
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
            <MenuIcon />
          </IconButton>
          <Typography type="title">Mirai</Typography>
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
        <Divider className={classes.listDivider} />
        <List subheader={<ListSubheader>YOU</ListSubheader>}>
          <ListItem
            button
            onClick={() => {
              this.toggleDrawer();
              this.tabChange(null, 4);
              this.props.history.push("/history");
            }}
          >
            <ListItemText primary="History" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              this.toggleDrawer();
              this.tabChange(null, 4);
              this.props.history.push("/later");
            }}
          >
            <ListItemText primary="Later" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              this.toggleDrawer();
              this.tabChange(null, 4);
              this.props.history.push("/user#favorites");
            }}
          >
            <ListItemText primary="Favorites" />
          </ListItem>
        </List>
        <Divider className={classes.listDivider} />
        <List>
          <ListItem
            button
            onClick={() => {
              this.toggleDrawer();
              this.tabChange(null, 4);
              this.props.history.push("/help");
            }}
          >
            <ListItemText primary="Help" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              this.toggleDrawer();
              this.tabChange(null, 4);
              this.props.history.push("/feedback");
            }}
          >
            <ListItemText primary="Feedback" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              this.toggleDrawer();
              window.open("https://discord.gg/gt69fbe");
            }}
          >
            <ListItemText primary="Discord" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              this.toggleDrawer();
              this.tabChange(null, 4);
              this.props.history.push("/monika");
            }}
          >
            <ListItemText primary="Monika" />
          </ListItem>
        </List>
        <Divider className={classes.listDivider} />
        <Typography className={classes.footerCopy} type="headline">
          {Object.keys(status).length - 1} online<br />2018 afroJ
        </Typography>
      </div>
    );

    return (
      <div className={classes.appFrame}>
        <AppBar
          id="superBar"
          classes={{ root: classes.root }}
          className={classes.appBar}
          style={watchIsOn ? { opacity: 0 } : null}
          onMouseEnter={watchIsOn ? this.revealBar : null}
          onMouseLeave={watchIsOn ? this.hideBar : null}
        >
          <div
            className={classes.gd}
            style={!notAtTop ? { opacity: 0.5 } : { opacity: 1 }}
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
            <IconButton
              className={classes.logoTitle}
              onClick={() => {
                this.props.history.push("/");
              }}
            >
              <img alt="" className={classes.logoButton} src={miraiLogo} />
            </IconButton>
            <Typography className={classes.barTitle} type="title">
              {currentPage}
            </Typography>
            <div className={classes.flex} />
            {/**<Autosuggest
              theme={{
                container: classes.searchContainer,
                suggestionsContainerOpen: classes.suggestionsContainerOpen,
                suggestionsList: classes.suggestionsList,
                suggestion: classes.suggestion
              }}
              renderInputComponent={renderInput}
              suggestions={twistBase}
              onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
              renderSuggestionsContainer={renderSuggestionsContainer}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={{
                autoFocus: true,
                classes,
                placeholder: "Search anime",
                value: searchVal,
                onChange: this.handleChange,
                disableUnderline: true
              }}
            />**/}
            <Tabs
              className={classes.contextBar}
              value={tabVal}
              onChange={this.tabChange}
            >
              <Tab
                classes={{
                  label:
                    tabVal === 0 ? classes.tabLabelActive : classes.tabLabel,
                  rootAccent: classes.tabLine
                }}
                label={
                  this.props.history.location.pathname.includes("monika")
                    ? "Just Monika"
                    : "Home"
                }
              />
              <Tab
                classes={{
                  label:
                    tabVal === 1 ? classes.tabLabelActive : classes.tabLabel,
                  rootAccent: classes.tabLine
                }}
                label={
                  this.props.history.location.pathname.includes("monika")
                    ? "Just Monika"
                    : "Feeds"
                }
              />
              <Tab
                classes={{
                  label:
                    tabVal === 2 ? classes.tabLabelActive : classes.tabLabel,
                  rootAccent: classes.tabLine
                }}
                label={
                  this.props.history.location.pathname.includes("monika")
                    ? "Just Monika"
                    : "Rankings"
                }
              />
              <Tab
                classes={{
                  label:
                    tabVal === 3 ? classes.tabLabelActive : classes.tabLabel,
                  rootAccent: classes.tabLine
                }}
                label={
                  this.props.history.location.pathname.includes("monika")
                    ? "Just Monika"
                    : "Live"
                }
              />
              <Tab style={{ display: "none" }} />
            </Tabs>
            <div className={classes.flex} />
            <IconButton
              onClick={() => {
                this.tabChange(null, 4);
                this.props.history.push("/search");
              }}
              color="contrast"
            >
              <SearchIcon />
            </IconButton>
            <div>
              <IconButton
                aria-owns={open ? "info-menu" : null}
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
                  vertical: "bottom",
                  horizontal: "center"
                }}
                MenuListProps={{ style: { padding: 0 } }}
                open={infoOpen}
                onRequestClose={this.handleInfoRequestClose}
              >
                <NotificationForm />
              </Menu>
            </div>
            {user ? (
              <div>
                <IconButton
                  aria-owns={open ? "profile-menu" : null}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="contrast"
                >
                  <Avatar
                    src={user.avatar}
                    alt=""
                    className={classes.userButton}
                    classes={{ img: classes.userButtonImg }}
                  />
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
                  onRequestClose={this.handleRequestClose}
                  PopoverClasses={{ paper: classes.menuPadding }}
                >
                  <div
                    style={{ outline: "none" }}
                    className={classes.profileCard}
                  >
                    <CardHeader
                      className={classes.profileCardHeader}
                      onClick={() => {
                        this.handleRequestClose();
                        this.tabChange(null, 4);
                        this.props.history.push("/user");
                      }}
                      avatar={
                        <Avatar
                          src={user.avatar}
                          classes={{ img: classes.avatarImg }}
                          className={classes.avatar}
                          style={
                            status.hasOwnProperty(user.userID)
                              ? { border: "2px solid lime" }
                              : null
                          }
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
                    <form>
                      <FormControl>
                        <InputLabel htmlFor="status">Status</InputLabel>
                        <Select
                          value={status}
                          onChange={this.handleStatus}
                          input={<Input name="status" id="status" />}
                        >
                          <MenuItem value={"Online"}>Online</MenuItem>
                          <MenuItem value={"Busy"}>Busy</MenuItem>
                          <MenuItem value={"Ghost"}>Ghost</MenuItem>
                        </Select>
                      </FormControl>
                    </form>
                    <Divider />
                    <List>
                      <ListItem
                        button
                        onClick={() => {
                          this.handleRequestClose();
                          this.tabChange(null, 4);
                          this.props.history.push("/settings");
                        }}
                      >
                        <ListItemText primary="Settings" />
                      </ListItem>
                      <ListItem
                        button
                        onClick={() => {
                          this.handleRequestClose();
                          Auth.signOut()
                            .then(async () =>
                              localForage.removeItem("user", () => {
                                this.tabChange(null, 4);
                                this.props.history.push("/setup");
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
                  this.props.history.push("/setup");
                }}
              >
                <AccountCircle />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
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
        <div className={classes.content}>{this.props.children}</div>
      </div>
    );
  }
}

export default withStyles(styles)(Superbar);
