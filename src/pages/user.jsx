import React, { Component } from "react";
import PropTypes from "prop-types";
import * as M from "material-ui";
import * as Icon from "material-ui-icons";
import localForage from "localforage";
import queryString from "query-string";
import * as Vibrant from "node-vibrant";
import SwipableViews from "react-swipeable-views";
import Tilt from "react-tilt";
import { connect } from "react-redux";
import { firebaseConnect, isEmpty, firebase } from "react-redux-firebase";
import {
  timeFormatToReadable,
  timeFormatToReadableTime
} from "../components/supertable";
import CardButton, { PeopleButton } from "../components/cardButton";
import { history } from "../store";
import {
    CommandoBar,
    Header,
    Root,
    Container,
    LoadingIndicator,
    TitleHeader,
    MainCard, Column
} from "../components/layouts";

const style = theme => ({
  root: {
    height: "100%",
    width: "100%",
    position: "relative",
    transition: theme.transitions.create(["all"])
  },
  bgImage: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
    height: "100vh",
    objectFit: "cover",
    width: "100%",
    zIndex: -1
  },
  content: {
    paddingTop: theme.spacing.unit * 8,
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 1600
  },
  header: {
    position: "relative",
    margin: "auto",
    paddingTop: theme.spacing.unit * 3
  },
  title: {
    color: "white",
    fontSize: 64,
    fontWeight: 700,
    textShadow: "0 3px 16px rgba(0,0,0,.4)",
    padding: theme.spacing.unit,
    textAlign: "center",
    margin: "auto"
  },
  icon: {
    boxShadow: "0 1px 12px rgba(0,0,0,.2)",
    color: "white",
    height: 92,
    width: 92,
    zIndex: -1,
    background: "linear-gradient(to top, #9900ff 0%, #ff00ff 70%)",
    borderRadius: "50%",
    padding: theme.spacing.unit * 2
  },
  fillImg: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    background: "white"
  },
  peopleCard: {
    height: "auto",
    width: 183,
    flexGrow: "initial",
    flexBasis: "initial",
    margin: theme.spacing.unit / 2,
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      transform: "scale(1.05)",
      overflow: "initial",
      zIndex: 200,
      boxShadow: `0 2px 14px rgba(0,55,230,.3)`,
      background: M.colors.blue.A200
    },
    "&:hover > * > h1": {
      transform: "scale(1.1)",
      textShadow: "0 2px 12px rgba(0,0,0,.7)"
    },
    position: "relative",
    overflow: "hidden"
  },
  peopleImage: {
    height: 156,
    width: 156,
    margin: "auto",
    zIndex: 1,
    borderRadius: "50%",
    boxShadow: "0 2px 12px rgba(0,0,0,.2)",
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      boxShadow: "0 3px 16px rgba(0,0,0,.5)"
    },
    top: 0,
    left: 0
  },
  peopleCharImage: {
    height: 64,
    width: 64,
    margin: "auto",
    zIndex: 2,
    position: "absolute",
    borderRadius: "50%",
    boxShadow: "0 2px 12px rgba(0,0,0,.2)",
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      boxShadow: "0 3px 16px rgba(0,0,0,.5)",
      transform: "scale(1.2)"
    },
    right: theme.spacing.unit * 3,
    bottom: theme.spacing.unit * 7
  },
  entityContext: {
    "&:last-child": {
      paddingBottom: 12
    }
  },
  peopleTitle: {
    fontSize: 14,
    fontWeight: 500,
    padding: theme.spacing.unit,
    paddingBottom: theme.spacing.unit / 2,
    transition: theme.transitions.create(["transform"]),
    bottom: 0,
    zIndex: 5,
    margin: "auto",
    textAlign: "center",
    textShadow: "0 1px 12px rgba(0,0,0,.2)"
  },
  peopleSubTitle: {
    fontSize: 14,
    color: "rgba(255,255,255,.7)",
    fontWeight: 600,
    margin: "auto",
    transition: theme.transitions.create(["transform"]),
    zIndex: 5,
    textShadow: "0 1px 12px rgba(0,0,0,.2)",
    textAlign: "center",
    whiteSpace: "nowrap"
  },
  entityCard: {
    height: 200,
    width: 183,
    flexGrow: "initial",
    flexBasis: "initial",
    margin: theme.spacing.unit / 2,
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      transform: "scale(1.05)",
      overflow: "initial",
      zIndex: 200,
      boxShadow: `0 2px 14px rgba(0,55,230,.3)`,
      background: M.colors.blue.A200
    },
    "&:hover > div": {
      boxShadow: "none"
    },
    "&:hover > * > h1": {
      transform: "scale(1.4)",
      fontWeight: 700,
      textShadow: "0 2px 12px rgba(0,0,0,.7)"
    },
    position: "relative",
    overflow: "hidden"
  },
  entityCardDisabled: {
    height: 200,
    width: 183,
    flexGrow: "initial",
    flexBasis: "initial",
    margin: theme.spacing.unit / 2,
    transition: theme.transitions.create(["all"]),
    filter: "brightness(.8)",
    position: "relative",
    overflow: "hidden"
  },
  entityImage: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    position: "absolute",
    zIndex: -1,
    transition: theme.transitions.create(["filter"]),
    "&:hover": {
      filter: "brightness(0.8)"
    },
    top: 0,
    left: 0
  },
  entityTitle: {
    fontSize: 14,
    fontWeight: 500,
    position: "absolute",
    padding: theme.spacing.unit * 2,
    transition: theme.transitions.create(["transform"]),
    bottom: 0,
    zIndex: 5,
    left: 0,
    textShadow: "0 1px 12px rgba(0,0,0,.2)"
  },
  entitySubTitle: {
    fontSize: 14,
    fontWeight: 600,
    position: "absolute",
    padding: theme.spacing.unit * 2,
    transition: theme.transitions.create(["transform"]),
    top: 0,
    left: 0,
    zIndex: 5,
    textShadow: "0 1px 12px rgba(0,0,0,.2)"
  },
  itemcontainer: {
    paddingBottom: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  gradientCard: {
    position: "relative",
    background: "linear-gradient(to top, transparent, rgba(0,0,0,.6))",
    height: 183,
    width: "100%"
  },
  sectDivide: {
    marginTop: theme.spacing.unit * 2
  },
  progressCon: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: 400,
    margin: "auto"
  },
  progressTitle: {
    display: "flex",
    fontSize: 12,
    margin: "auto",
    textAlign: "center"
  },
  progressBar: {
    background: "rgba(255,255,255,.3)",
    margin: theme.spacing.unit / 2
  },
  progressBarActive: {
    background: "white"
  },
  commandoBar: {
    width: "100%",
    display: "inline-flex",
    boxSizing: "border-box",
    background: "#222",
    boxShadow: "0 3px 18px rgba(0,0,0,.1)"
  },
  commandoText: {
    margin: "auto",
    textAlign: "center"
  },
  commandoTextBox: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    margin: "auto"
  },
  commandoTextLabel: {
    fontSize: 10,
    textAlign: "center",
    color: "rgba(255,255,255,.8)"
  },
  smallTitlebar: {
    display: "flex"
  },
  secTitle: {
    padding: theme.spacing.unit,
    fontWeight: 700,
    fontSize: 22,
    zIndex: "inherit",
    paddingBottom: theme.spacing.unit * 2
  },
  secTitleSmall: {
    padding: theme.spacing.unit,
    fontSize: 16,
    zIndex: "inherit",
    color: "rgba(255,255,255,.5)",
    paddingBottom: theme.spacing.unit * 2
  },
  backToolbar: {
    marginTop: theme.spacing.unit * 8
  },
  bigBar: {
    width: "100%",
    height: "auto",
    boxShadow: "0 2px 24px rgba(0,0,0,.2)",
    background: "#111",
    marginTop: theme.spacing.unit * 8,
    position: "relative",
    overflow: "hidden",
    paddingBottom: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 8,
    transition: theme.transitions.create(["all"]),
    [theme.breakpoints.down("md")]: {
      marginTop: 0
    }
  },
  glassEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
    height: "100vh",
    objectFit: "cover",
    width: "100%",
    transform: "scale(20)"
  },
  rootInactive: {
    opacity: 0,
    pointerEvents: "none",
    transition: theme.transitions.create(["all"])
  },
  container: {
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 1200,
    [theme.breakpoints.up("md")]: {
      maxWidth: "calc(100% - 64px)",
      paddingTop: 24
    },
    margin: "auto"
  },
  frame: {
    height: "100%",
    width: "100%",
    position: "relative",
    transition: theme.transitions.create(["all"])
  },
  grDImage: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 1,
    height: "100vh",
    width: "100%",
    zIndex: -1,
    overflow: "hidden",
    transition: theme.transitions.create(["all"])
  },
  mainFrame: {
    marginLeft: 24
  },
  bigTitle: {
    fontWeight: 700,
    fontSize: 82,
    color: "white",
    textShadow: "0 2px 12px rgba(0,0,0,.2)"
  },
  smallTitle: {
    fontWeight: 600,
    color: "white",
    fontSize: 40,
    textShadow: "0 2px 12px rgba(0,0,0,.17)"
  },
  tagBox: {
    marginTop: theme.spacing.unit
  },
  tagTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "white",
    textShadow: "0 2px 12px rgba(0,0,0,.17)",
    marginBottom: theme.spacing.unit
  },
  desc: {
    marginTop: theme.spacing.unit * 4,
    color: "white",
    textShadow: "0 0 12px rgba(0,0,0,.1)",
    marginBottom: theme.spacing.unit * 6,
    fontSize: theme.typography.pxToRem(16)
  },
  boldD: {
    marginTop: theme.spacing.unit,
    color: "white",
    textShadow: "0 0 12px rgba(0,0,0,.1)",
    marginBottom: theme.spacing.unit,
    fontWeight: 600
  },
  smallD: {
    marginLeft: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    color: "white",
    textShadow: "0 0 12px rgba(0,0,0,.1)",
    marginBottom: theme.spacing.unit
  },
  sepD: {
    display: "flex",
    marginLeft: theme.spacing.unit
  },
  artworkimg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    background: "white",
    transition: theme.transitions.create(["all"]),
    zIndex: -1
  },
  artwork: {
    width: 400,
    height: 400,
    borderRadius: "50%",
    overflow: "hidden",
    margin: "auto",
    boxShadow: "0px 7px 32px rgba(0,0,0,0.5)",
    transition: theme.transitions.create(["all"]),
    position: "relative",
    zIndex: 500,
    [theme.breakpoints.down("md")]: {
      height: 256,
      width: 256,
      margin: theme.spacing.unit * 2
    }
  },
  loading: {
    height: "100%",
    width: "100%",
    zIndex: -5,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    padding: 0,
    margin: "auto",
    transition: theme.transitions.create(["all"])
  },
  tabLabel: {
    opacity: 0.5,
    fontSize: 16,
    color: "white",
    textTransform: "initial"
  },
  tabLabelActive: {
    fontWeight: 700,
    fontSize: 16,
    color: "white",
    textTransform: "initial"
  },
  tabLine: {
    filter: "drop-shadow(0 1px 12px rgba(0,0,255,.2))",
    height: 2,
    background: "white"
  },
  tab: {
    height: 64
  },
  feed: {
    margin: theme.spacing.unit
  }
});

class User extends Component {
  state = {
    loading: true,
    data: null,
    tabVal: 0
  };

  componentWillMount = async () => {
    if (!isEmpty(this.props.profile)) return this.init();
    return false;
  };

  componentWillUnmount = () => {
    this.unlisten();
  };

  unlisten = this.props.history.listen(location => {
    const id = queryString.parse(location.search);
    if (location.pathname === "/user") {
      if (id.u !== this.state.id) return this.init();
      else if (location.search === "") return this.init();
    }
    return false;
  });

  init = () =>
    this.setState({ loading: true, data: null, id: null }, () => {
      const id = queryString.parse(this.props.location.search);
      if (this.props.location.search) {
        if (id !== this.props.profile.userID) {
          this.props.firebase
            .database()
            .ref("users")
            .child(id.u)
            .on("value", val =>
              this.setState(
                { data: val.val(), id: val.val().userID },
                async () =>
                  this.vibrance().then(() => this.setState({ loading: false }))
              )
            );
        } else {
          this.vibrance().then(() => this.setState({ loading: false }));
        }
      } else {
        this.vibrance().then(() => this.setState({ loading: false }));
      }
    });

  vibrance = async () => {
    const image = this.state.data
      ? this.state.data.avatar
      : this.props.profile
        ? this.props.profile.headers
          ? this.props.profile.headers
          : this.props.profile.avatar
        : null;
    const hues = await localForage.getItem("user-hue");
    if (image && !hues)
      Vibrant.from(`https://cors-anywhere.herokuapp.com/${image}`).getPalette(
        (err, pal) => {
          if (pal) {
            return this.setState(
              {
                hue: pal.DarkMuted && pal.DarkMuted.getHex(),
                hueVib: pal.LightVibrant && pal.LightVibrant.getHex(),
                hueVibN: pal.DarkVibrant && pal.DarkVibrant.getHex()
              },
              async () => {
                if (!this.state.data) {
                  await localForage.setItem("user-hue", {
                    hue: this.state.hue,
                    vib: this.state.hueVib,
                    vibn: this.state.hueVibN,
                    image
                  });
                }
              }
            );
          }
          return null;
        }
      );
    else if (image && hues && hues.image !== image)
      Vibrant.from(`https://cors-anywhere.herokuapp.com/${image}`).getPalette(
        (err, pal) => {
          if (pal) {
            return this.setState(
              {
                hue: pal.DarkMuted && pal.DarkMuted.getHex(),
                hueVib: pal.LightVibrant && pal.LightVibrant.getHex(),
                hueVibN: pal.DarkVibrant && pal.DarkVibrant.getHex()
              },
              async () => {
                // let superBar = document.getElementById('superBar');
                // if (superBar) superBar.style.background = this.state.hue;
                if (!this.state.data) {
                  await localForage.setItem("user-hue", {
                    hue: this.state.hue,
                    vib: this.state.hueVib,
                    vibn: this.state.hueVibN,
                    image
                  });
                }
              }
            );
          }
          return null;
        }
      );
    else if (image && hues)
      return this.setState({
        hue: hues.hue,
        hueVib: hues.vib,
        hueVibN: hues.vibn
      });
    return null;
  };

  addFriend = async () => {
    const you = this.props.profile;
    const them = this.props.firebase
      .database()
      .ref("/users")
      .child(this.state.data.userID);
    const theirnotif = await them
      .child("notifications")
      .child(Date.now())
      .set({
        id: Date.now(),
        date: Date.now(),
        title: `Friend request`,
        desc: `${you.username} wants to be your friend.`,
        options: ["accept", "ignore"],
        avatar: you.avatar,
          ignored: false,
          userid: you.userID,
          type: 'fr',
          username: you.username
      });
    const theirreq = await them
      .child("requests")
      .child("friend")
      .child(you.userID)
      .set({
        pending: true
      });

    if (theirnotif && theirreq) {
      return true;
    } else {
      return false;
    }
  };

  removeFriend = async () => {
    const you = this.props.profile;
    const them = this.props.firebase
      .database()
      .ref("/users")
      .child(this.state.data.userID);

    const theirlist = await them
      .child("friends")
      .child(you.userID)
      .remove();
    const theirreq = await them
      .child("requests")
      .child("friend")
      .child(you.userID)
      .remove();

    const yourlist = await this.props.firebase
        .database()
        .ref("/users")
        .child(you.userID)
        .child('friends')
        .child(this.state.data.userID)
        .remove();

    if (theirlist && theirreq && yourlist) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    const { classes } = this.props;
    const user = this.props.profile;
    const { loading, hue, hueVibN, data, tabVal } = this.state;
    if (isEmpty(user)) return (
        <div>
            <TitleHeader color={'#000'} title={'In order to view others accounts, you need to log in.'}/>
        </div>
    );
    return (
      <div>
        <LoadingIndicator loading={loading} />
        <TitleHeader color={hue ? hue : null} />
        <Root>
          <Header image={data ? data.headers : user.headers} color={hueVibN} />
          <Container spacing={0}>
            <M.Grid container spacing={0} className={classes.container}>
              <M.Grid
                item
                style={{ width: 400, flexGrow: 0, marginRight: 24 }}
                xs
              >
                <Tilt
                  style={{ transformStyle: "preserve-3d" }}
                  options={{ scale: 1 }}
                >
                  <M.Avatar
                    src={data ? data.avatar : user.avatar}
                    className={classes.artwork}
                    classes={{ img: classes.fillImg }}
                    imgProps={{
                      style: { opacity: 0 },
                      onLoad: e => (e.currentTarget.style.opacity = null)
                    }}
                  />
                </Tilt>
              </M.Grid>
              <M.Grid item xs style={{ margin: "auto" }}>
                <M.Typography className={classes.bigTitle} variant="display3">
                  {data ? data.username : user.username}
                </M.Typography>
                <M.Typography variant="display1" className={classes.smallTitle}>
                  {data ? data.nick : user.nick}  {!isEmpty(user) && user.friends && data && user.friends[data.userID] ? '- You are both friends' : null}
                </M.Typography>
                <M.Typography
                  variant="body1"
                  className={classes.desc}
                  dangerouslySetInnerHTML={{
                    __html: data ? data.motto : user.motto
                  }}
                />
              </M.Grid>
            </M.Grid>
            <MainCard>
              <CommandoBar>
                <M.Tabs
                  value={tabVal}
                  onChange={(e, val) => this.setState({ tabVal: val })}
                  className={classes.contextBar}
                  indicatorClassName={classes.tabLine}
                >
                  <M.Tab
                    label={data ? data.username : user.username}
                    classes={{
                      root: classes.tab,
                      label:
                        tabVal === 0 ? classes.tabLabelActive : classes.tabLabel
                    }}
                  />
                  <M.Tab
                    label="Feed"
                    classes={{
                      root: classes.tab,
                      label:
                        tabVal === 1 ? classes.tabLabelActive : classes.tabLabel
                    }}
                  />
                  <M.Tab
                    label="Anime list"
                    classes={{
                      root: classes.tab,
                      label:
                        tabVal === 2 ? classes.tabLabelActive : classes.tabLabel
                    }}
                  />
                  <M.Tab
                    label="Manga list"
                    classes={{
                      root: classes.tab,
                      label:
                        tabVal === 3 ? classes.tabLabelActive : classes.tabLabel
                    }}
                  />
                  <M.Tab
                    label="Stats"
                    classes={{
                      root: classes.tab,
                      label:
                        tabVal === 4 ? classes.tabLabelActive : classes.tabLabel
                    }}
                  />
                </M.Tabs>
                <div style={{ flex: 1 }} />
                {!isEmpty(user) && data && data.userID !== user.userID ? (
                  <M.Button
                    color="default"
                    onClick={
                      !isEmpty(user) && user.friends && user.friends[data.userID]
                        ? this.removeFriend
                        : this.addFriend
                    }
                  >
                    {!isEmpty(user) &&
                    user.friends &&
                    user.friends[data.userID] ? (
                      <Icon.Remove style={{ marginRight: 12 }} />
                    ) : (
                      <Icon.PersonAdd style={{ marginRight: 12 }} />
                    )}
                    {!isEmpty(user) && user.friends && user.friends[data.userID]
                      ? "Remove friend"
                      : "Add as friend"}
                  </M.Button>
                ) : null}
                <M.IconButton color="default">
                  <Icon.MoreVert />
                </M.IconButton>
              </CommandoBar>
              <SwipableViews
                index={tabVal}
                onChangeIndex={index => this.setState({ tabVal: index })}
              >
                <M.Grid container className={classes.container}>
                  <M.Grid item xs style={{ zIndex: 10 }}>
                    <M.Typography vairant="title" className={classes.secTitle}>
                      Friends
                    </M.Typography>
                    <M.Grid
                      container
                      className={classes.itemcontainer}
                    >
                      {data ? data.friends ? (
                          Object.values(data.friends).map(
                              (friend, index) => (
                                  <PeopleButton
                                      key={index}
                                      name={{ first: friend.username }}
                                      onClick={() =>
                                          this.props.history.push(
                                              `/user?u=${friend.userID}`
                                          )
                                      }
                                      image={friend.avatar}
                                  />
                              )
                          )
                      ) : (
                          <M.Typography variant="body1">
                              {`${data.username} got no friends`}
                          </M.Typography>
                      ) : user.friends ? (
                          Object.values(user.friends).map(
                            (friend, index) => (
                              <PeopleButton
                                key={index}
                                name={{ first: friend.username }}
                                onClick={() =>
                                  this.props.history.push(
                                    `/user?u=${friend.userID}`
                                  )
                                }
                                image={friend.avatar}
                              />
                            )
                          )
                        ) : (
                        <M.Typography variant="body1">
                          You got no friends.
                        </M.Typography>
                      )}
                    </M.Grid>
                    <M.Typography variant="title" className={classes.secTitle}>
                      Feed
                    </M.Typography>
                    <M.Grid
                      container
                      className={classes.itemcontainer}
                      style={{ flexDirection: "column" }}
                    >
                      {data
                        ? null
                        : !isEmpty(user) &&
                          user.feed &&
                          Object.values(user.feed)
                            .sort((a, b) => b.date - a.date)
                            .map(feed => (
                              <M.Card
                                style={{ background: hueVibN }}
                                className={classes.feed}
                                key={feed.id}
                              >
                                <M.CardHeader
                                  avatar={
                                    <M.Avatar
                                      alt=""
                                      src={feed.user.avatar}
                                      className={classes.avatar}
                                    />
                                  }
                                  subheader={`${timeFormatToReadableTime(
                                    feed.date
                                  )} ${timeFormatToReadable(feed.date)}`}
                                  title={feed.user.username}
                                />
                                <M.CardMedia
                                  style={{ minHeight: 300 }}
                                  image={
                                    feed.bgImg ? feed.bgImg : feed.coverImg
                                  }
                                />
                                <M.CardContent>
                                  <M.Typography variant="body1">
                                    {feed.activity}
                                  </M.Typography>
                                </M.CardContent>
                                <M.CardActions>
                                  <div style={{ flex: 1 }} />
                                  <M.IconButton>
                                    <Icon.ThumbUp />
                                  </M.IconButton>
                                  <M.IconButton>
                                    <Icon.Comment />
                                  </M.IconButton>
                                </M.CardActions>
                              </M.Card>
                            ))}
                    </M.Grid>
                  </M.Grid>
                  <M.Grid item xs={5} style={{ zIndex: 10 }} id="favourites">
                    <M.Typography variant="title" className={classes.secTitle}>
                      Favorites
                    </M.Typography>
                    <M.Typography
                      variant="title"
                      className={classes.secTitleSmall}
                    >
                      Anime
                    </M.Typography>
                    <M.Grid container className={classes.itemcontainer}>
                      {data ? (
                        data.favs && data.favs.show ? (
                          Object.values(data.favs.show).map(show => (
                            <CardButton
                              key={show.id}
                              onClick={() =>
                                this.props.history.push(`/show?s=${show.id}`)
                              }
                              title={show.name}
                              image={show.image}
                            />
                          ))
                        ) : (
                          <M.Typography variant="body1">
                            {"They don't appear to like anime..."}
                          </M.Typography>
                        )
                      ) : !isEmpty(user) && user.favs && user.favs.show ? (
                        Object.values(user.favs.show).map(show => (
                          <CardButton
                            key={show.id}
                            onClick={() =>
                              this.props.history.push(`/show?s=${show.id}`)
                            }
                            title={show.name}
                            image={show.image}
                          />
                        ))
                      ) : (
                        <M.Typography variant="body1">
                          {
                            "Doesn't seem like you've found yourself a good one yet..."
                          }
                        </M.Typography>
                      )}
                    </M.Grid>
                    <M.Divider />
                    <M.Typography
                      variant="title"
                      className={classes.secTitleSmall}
                    >
                      Manga
                    </M.Typography>
                    <M.Grid container className={classes.itemcontainer}>
                      {data ? (
                        data.favs && data.favs.manga ? (
                          Object.values(data.favs.manga).map(show => (
                            <CardButton
                              key={show.id}
                              onClick={() =>
                                this.props.history.push(`/show?m=${show.id}`)
                              }
                              title={show.name}
                              image={show.image}
                            />
                          ))
                        ) : (
                          <M.Typography variant="body1">
                            Appears {data.username} is not into reading...
                          </M.Typography>
                        )
                      ) : !isEmpty(user) && user.favs && user.favs.manga ? (
                        Object.values(user.favs.manga).map(show => (
                          <CardButton
                            key={show.id}
                            onClick={() =>
                              this.props.history.push(`/show?m=${show.id}`)
                            }
                            title={show.name}
                            image={show.image}
                          />
                        ))
                      ) : (
                        <M.Typography variant="body1">
                          Not into reading? Understandable.
                        </M.Typography>
                      )}
                    </M.Grid>
                    <M.Divider />
                    <M.Typography
                      variant="title"
                      className={classes.secTitleSmall}
                    >
                      Characters
                    </M.Typography>
                    <M.Grid container className={classes.itemcontainer}>
                      {data ? (
                        data.favs && data.favs.char ? (
                          Object.values(data.favs.char).map(cast => (
                            <PeopleButton
                              key={cast.id}
                              name={{ first: cast.name }}
                              image={cast.image}
                              onClick={() =>
                                this.props.history.push(`/fig?c=${cast.id}`)
                              }
                            />
                          ))
                        ) : (
                          <M.Typography variant="body1">
                            {data.username} has yet to find his waifu...
                          </M.Typography>
                        )
                      ) : !isEmpty(user) && user.favs && user.favs.char ? (
                        Object.values(user.favs.char).map(cast => (
                          <PeopleButton
                            key={cast.id}
                            name={{ first: cast.name }}
                            image={cast.image}
                            onClick={() =>
                              this.props.history.push(`/fig?c=${cast.id}`)
                            }
                          />
                        ))
                      ) : (
                        <M.Typography variant="body1">
                          Do you like any characters at all?
                        </M.Typography>
                      )}
                    </M.Grid>
                    <M.Divider />
                    <M.Typography
                      variant="title"
                      className={classes.secTitleSmall}
                    >
                      Staff & Actors
                    </M.Typography>
                    <M.Grid container className={classes.itemcontainer}>
                      {data ? (
                        data.favs && data.favs.staff ? (
                          Object.values(data.favs.staff).map(cast => (
                            <PeopleButton
                              key={cast}
                              name={{ first: cast.name }}
                              image={cast.image}
                              onClick={() =>
                                this.props.history.push(`/fig?s=${cast.id}`)
                              }
                            />
                          ))
                        ) : (
                          <M.Typography variant="body1">
                            Staff? Actors? Casting? {data.username} does not
                            know.
                          </M.Typography>
                        )
                      ) : !isEmpty(user) && user.favs && user.favs.staff ? (
                        Object.values(user.favs.staff).map(cast => (
                          <PeopleButton
                            key={cast.id}
                            name={{ first: cast.name }}
                            image={cast.image}
                            onClick={() =>
                              this.props.history.push(`/fig?s=${cast.id}`)
                            }
                          />
                        ))
                      ) : (
                        <M.Typography variant="body1">
                          {
                            "Hmm... I suppose you don't find anyone that interesting to follow."
                          }
                        </M.Typography>
                      )}
                    </M.Grid>
                    <M.Divider />
                    <M.Typography
                      variant="title"
                      className={classes.secTitleSmall}
                    >
                      Studios
                    </M.Typography>
                    <M.Grid container className={classes.itemcontainer}>
                      {data ? (
                        data.favs && data.favs.studio ? (
                          Object.values(data.favs.studio).map(show => (
                            <M.Grid
                              className={classes.entityCard}
                              item
                              xs
                              key={show.id}
                            >
                              <M.Card
                                style={{ background: "transparent" }}
                                onClick={() =>
                                  this.props.history.push(
                                    `/studio?s=${show.id}`
                                  )
                                }
                              >
                                <div className={classes.gradientCard}>
                                  <M.CardMedia
                                    className={classes.entityImage}
                                    image={show.image}
                                  />
                                </div>
                                <M.Typography
                                  variant="headline"
                                  className={classes.entityTitle}
                                >
                                  {show.name}
                                </M.Typography>
                                <M.Typography
                                  variant="headline"
                                  className={classes.entitySubTitle}
                                />
                              </M.Card>
                            </M.Grid>
                          ))
                        ) : (
                          <M.Typography variant="body1">
                            {`Appears ${
                              data.username
                            } isn't fond of any studios at
                            all.`}
                          </M.Typography>
                        )
                      ) : !isEmpty(user) && user.favs && user.favs.studio ? (
                        Object.values(user.favs.studio).map(show => (
                          <M.Grid
                            className={classes.entityCard}
                            item
                            xs
                            key={show.id}
                          >
                            <M.Card
                              style={{ background: "transparent" }}
                              onClick={() =>
                                this.props.history.push(`/tag?s=${show.id}`)
                              }
                            >
                              <div className={classes.gradientCard}>
                                <M.CardMedia
                                  className={classes.entityImage}
                                  image={show.image}
                                />
                              </div>
                              <M.Typography
                                variant="headline"
                                className={classes.entityTitle}
                              >
                                {show.name}
                              </M.Typography>
                              <M.Typography
                                variant="headline"
                                className={classes.entitySubTitle}
                              />
                            </M.Card>
                          </M.Grid>
                        ))
                      ) : (
                        <M.Typography variant="body1">
                          Studios can be rather abstract.. perhaps you enjoy
                          works by Studio Ghibli or perhaps... Trigger?
                        </M.Typography>
                      )}
                    </M.Grid>
                  </M.Grid>
                </M.Grid>
                  <Container>
                      <Column/>
                  </Container>
                  <Container>
                      <Column>
                          <M.Typography variant="title" className={classes.secTitle}>
                              Recently watched
                          </M.Typography>
                          <M.Grid
                              container
                              className={classes.itemcontainer}
                          >
                              {data ? (
                                  data.episodeProgress ? (
                                      Object.values(data.episodeProgress).filter(s => s.recentlyWatched)
                                          .sort(
                                              (a, b) => b.recentlyWatched - a.recentlyWatched
                                          ).map(show => (
                                          <CardButton
                                              key={show.showId}
                                              onClick={() =>
                                                  this.props.history.push(`/show?s=${show.showId}`)
                                              }
                                              title={show.title}
                                              image={show.showArtwork}
                                              subtitle={show.ep ? `Episode ${show.ep}` : null}
                                          />
                                      ))
                                  ) : (
                                      <M.Typography variant="body1">
                                          Appears {data.username} hasn't seen a anime here yet.
                                      </M.Typography>
                                  )
                              ) : !isEmpty(user) && user.episodeProgress ? (
                                  Object.values(user.episodeProgress).filter(s => s.recentlyWatched)
                                      .sort(
                                          (a, b) => b.recentlyWatched - a.recentlyWatched
                                      ).map(show => (
                                      <CardButton
                                          key={show.showId}
                                          onClick={() =>
                                              this.props.history.push(`/show?s=${show.showId}`)
                                          }
                                          title={show.title}
                                          image={show.showArtwork}
                                          subtitle={show.ep ? `Episode ${show.ep}` : null}
                                      />
                                  ))
                              ) : (
                                  <M.Typography variant="body1">
                                      Watch something?
                                  </M.Typography>
                              )}
                          </M.Grid>
                          <M.Typography variant={'title'} className={classes.secTitleSmall}>
                              Last seen animes on yura
                          </M.Typography>
                          <M.Grid
                              container
                              className={classes.itemcontainer}
                          >
                          {data ? (
                              data.lastEp ? (
                                  Object.values(data.lastEp).map((show, index) => (
                                      <CardButton
                                          key={index}
                                          onClick={() =>
                                              this.props.history.push(`/show?s=${show.id}`)
                                          }
                                          title={show.showName}
                                          image={show.imageLgeBanner}
                                          subtitle={show.showEp}
                                      />
                                  ))
                              ) : (
                                  <M.Typography variant="body1">
                                      {data.username} never used yura, nothing to find.
                                  </M.Typography>
                              )
                          ) : !isEmpty(user) && user.lastEp ? (
                              Object.values(user.lastEp).map((show, index) => (
                                  <CardButton
                                      key={index}
                                      onClick={() =>
                                          this.props.history.push(`/show?s=${show.id}`)
                                      }
                                      title={show.showName}
                                      image={show.imageLgeBanner}
                                      subtitle={show.showEp}
                                  />
                              ))
                          ) : (
                              <M.Typography variant="body1">
                                  No information on about yura history.
                              </M.Typography>
                          )}
                          </M.Grid>
                          <M.Typography variant="title" className={classes.secTitle}>
                              Later
                          </M.Typography>
                          <M.Grid
                              container
                              className={classes.itemcontainer}
                          >

                          </M.Grid>
                          <M.Typography vairant="title" className={classes.secTitle}>
                              Completed
                          </M.Typography>
                          <M.Grid
                              container
                              className={classes.itemcontainer}
                          >

                          </M.Grid>
                          <M.Typography vairant="title" className={classes.secTitle}>
                              Dropped
                          </M.Typography>
                          <M.Grid
                              container
                              className={classes.itemcontainer}
                          >

                          </M.Grid>
                      </Column>
                  </Container>
                  <Container>
                      <Column>
                          <M.Typography variant="title" className={classes.secTitle}>
                              Recently read
                          </M.Typography>
                          <M.Grid
                              container
                              className={classes.itemcontainer}
                          >

                          </M.Grid>
                          <M.Typography variant="title" className={classes.secTitle}>
                              Later
                          </M.Typography>
                          <M.Grid
                              container
                              className={classes.itemcontainer}
                          >

                          </M.Grid>
                          <M.Typography vairant="title" className={classes.secTitle}>
                              Completed
                          </M.Typography>
                          <M.Grid
                              container
                              className={classes.itemcontainer}
                          >

                          </M.Grid>
                          <M.Typography vairant="title" className={classes.secTitle}>
                              Dropped
                          </M.Typography>
                          <M.Grid
                              container
                              className={classes.itemcontainer}
                          >

                          </M.Grid>
                      </Column>
                  </Container>
                  <Container/>
              </SwipableViews>
            </MainCard>
          </Container>
        </Root>
      </div>
    );
  }
}

export default firebaseConnect()(
  connect(({ firebase: { profile } }) => ({ profile }))(
    M.withStyles(style)(User)
  )
);
