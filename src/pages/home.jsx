import MenuItem from "material-ui/Menu/MenuItem";
import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import { Database } from "../utils/firebase";
import localForage from "localforage";
import Grid from "material-ui/Grid";
import Divider from "material-ui/Divider";
import Avatar from "material-ui/Avatar";
import Slider from "react-slick";
import Card, {
  CardContent,
  CardMedia,
  CardHeader,
  CardActions
} from "material-ui/Card";
import { grey } from "material-ui/colors";
import IconButton from "material-ui/IconButton";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import Twist from "../twist-api";

import Dotdotdot from "react-dotdotdot";

import PlusOneIcon from "material-ui-icons/PlusOne";
import Button from "material-ui/Button";
import MoreVertIcon from "material-ui-icons/MoreVert";
import ShareIcon from "material-ui-icons/Share";
import { Menu } from "material-ui";
import miraiIcon from "../assets/mirai-icon.png";

import { firebaseConnect } from "react-redux-firebase";

import { blue } from "material-ui/colors";

import Snackbar from "material-ui/Snackbar";
import CloseIcon from "material-ui-icons/Close";

import Segoku from "../utils/segoku/segoku";

import ripple from "../assets/Ripple.mp4";
import CircularProgress from "material-ui/Progress/CircularProgress";

import { push } from "react-router-redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import SuperTable from "../components/supertable";

const styles = theme => ({
  root: {
    // paddingTop: theme.spacing.unit * 8
  },
  container: {
    marginLeft: "auto",
    marginRight: "auto",
    padding: 24,
    maxWidth: 1200,
    [theme.breakpoints.up("md")]: {
      maxWidth: "calc(100% - 64px)"
    }
  },
  itemContainer: {
    margin: theme.spacing.unit
  },
  bgImage: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    height: "100vh",
    objectFit: "cover",
    width: "100%",
    zIndex: -1,
    transition: theme.transitions.create(["all"])
  },
  topHeader: {
    width: "100%",
    maxHeight: 520,
    position: "relative",
    margin: "auto",
    transition: theme.transitions.create(["all"])
  },
  topHeaderBig: {
    width: "100%",
    maxHeight: 520,
    position: "relative",
    margin: "auto",
    transition: theme.transitions.create(["all"]),
    background: "white",
    paddingTop: theme.spacing.unit * 12
  },
  cardBg: {
    objectFit: "cover",
    height: "100%",
    width: "100%",
    position: "absolute",
    textIndent: -999,
    top: 0,
    left: 0,
    zIndex: 0
  },
  cardContent: {
    textAlign: "center",
    height: "100%",
    zIndex: 2,
    display: "flex",
    background: grey[800]
  },
  divide: {
    width: "100%",
    marginTop: 24,
    marginBottom: 24
  },
  spacer: {
    flex: 1
  },
  headline: {
    marginBottom: 24
  },
  headlineTitle: {
    marginBottom: 24,
    fontSize: 48,
    fontWeight: 500,
    color: "#111",
    fontFamily: "Product Sans"
  },
  fullWidth: {
    width: "100%"
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
      background: blue.A200
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
  entityContext: {
    "&:last-child": {
      paddingBottom: 12
    }
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
  likeCount: {},
  cardColor: {},
  snackBar: {
    position: "fixed",
    marginTop: 64
  },
  avatar: {
    marginLeft: -theme.spacing.unit * 4,
    height: 82,
    width: 82,
    boxShadow: "0 3px 16px rgba(0,0,0,.5)"
  },
  frame: {
    transition: theme.transitions.create(["all"])
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
  bigCard: {
    margin: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    display: "flex",
    boxShadow: "0 2px 18px rgba(0,0,0,.4)",
    background: "rgba(255,255,255,0)",
    height: "100%",
    minHeight: "300px !important",
    width: "100%",
    boxSizing: "border-box",
    transition: theme.transitions.create(["all"]),
    "&:last-child": {
      marginRight: theme.spacing.unit * 9
    },
    "&:first-child": {
      marginLeft: theme.spacing.unit * 9
    },
    position: "relative",
    "&:hover": {
      background: `rgba(0,55,230,.3)`
    },
    "&:hover > div:nth-of-type(2) > img": {
      zIndex: 200,
      boxShadow: `0 2px 14px rgba(0,55,230,.3)`,
      borderColor: blue.A200
    }
  },
  bigCardIcon: {
    background: "white",
    zIndex: 4,
    width: 156,
    height: 228,
    boxShadow: "0 3px 24px rgba(0,0,0,.6)",
    objectFit: "cover",
    marginRight: theme.spacing.unit * 2,
    transition: theme.transitions.create(["all"]),
    border: "8px solid transparent",
    "&:hover": {
      filter: "brightness(0.8)"
    }
  },
  bigCardImage: {
    position: "absolute",
    height: "100%",
    width: "100%",
    objectFit: "cover",
    top: 0,
    left: 0,
    display: "inline-block",
    background: "linear-gradient(to top, rgba(0,0,0,.7), transparent)"
  },
  bigCardImageImg: {
    position: "relative",
    height: "100%",
    width: "100%",
    objectFit: "cover",
    top: 0,
    left: 0,
    zIndex: -1,
    display: "block"
  },
  bigCardRow: {
    display: "flex",
    zIndex: 3,
    position: "absolute",
    width: "100%",
    bottom: -theme.spacing.unit * 2,
    left: -theme.spacing.unit * 2
  },
  bigCardTitle: {
    zIndex: 3,
    color: "white",
    fontWeight: 700,
    fontSize: 32,
    textShadow: "0 3px 20px rgba(0,0,0,.87)"
  },
  bigCardText: {
    display: "flex",
    flexDirection: "column",
    margin: "auto 0"
  },
  bigCardSmallTitle: {
    zIndex: 3,
    color: "white",
    fontWeight: 400,
    marginTop: theme.spacing.unit,
    lineHeight: 1,
    fontSize: 18,
    textShadow: "0 3px 20px rgba(0,0,0,.7)"
  },
  bigCardVerySmallTitle: {
    zIndex: 3,
    color: "white",
    fontWeight: 700,
    fontSize: 14,
    textShadow: "0 3px 20px rgba(0,0,0,.7)",
    marginBottom: theme.spacing.unit,
    textTransform: "uppercase"
  },
  sliderBig: {
    height: "100%",
    marginBottom: theme.spacing.unit * 2,
    "& > .slick-list": {},
    flexFlow: "row nowrap"
  },
  sliderDots: {
    color: "white",
    position: "absolute",
    width: "100%",
    display: "flex !important",
    listStyle: "none",
    boxSizing: "border-box",
    justifyContent: "center",
    "& > .slick-active > button": {
      background: "white"
    },
    "& > li": {
      filter: "drop-shadow(0 2px 18px rgba(0,0,0,.5))",
      padding: 0,
      margin: "0 5px",
      height: 24,
      width: 24,
      display: "inline-block",
      position: "relative",
      cursor: "pointer",
      "& > button": {
        filter: "drop-shadow(0 2px 18px rgba(0,0,0,.5))",
        fontSize: 0,
        lineHeight: 0,
        display: "block",
        width: 10,
        height: 10,
        padding: 5,
        cursor: "pointer",
        color: "transparent",
        border: 0,
        outline: 0,
        background: "rgba(255,255,255,.2)",
        borderRadius: "50%"
      }
    }
  }
});

class Home extends Component {
  state = {
    feeds: null,
    anchorEl: null,
    es: false,
    loading: true,
    ongoing: null,
    rankingMentionable: null
  };

  componentDidMount = async () => {
    this.feedsObserve();
    this.rankingsObserve();
    this.makeTitlebarWhite();
    this.fetchOngoing().then(() =>
      setTimeout(() => this.setState({ loading: false }), 300)
    );
  };

  makeTitlebarWhite = () => {
    let superbar = document.getElementById("superBar");
    if (superbar) superbar.classList.add("whiteshit");
  };

  fetchOngoing = async () => {
    const ongoing = await new Segoku().get({
      page: 1,
      isAdult: false,
      sort: ["POPULARITY_DESC"],
      status: "RELEASING"
    });

    const ongoingM = await new Segoku().getM({
      page: 1,
      isAdult: false,
      sort: ["POPULARITY_DESC"],
      status: "RELEASING"
    });

    try {
      if (ongoing && ongoingM) this.setState({ ongoing, ongoingM });
    } catch (error) {
      console.error(error);
    }
  };

  rankingsObserve = () =>
    this.props.firebase
      .ref("ranking")
      .child("mentionable")
      .on("value", mentionables =>
        this.setState({
          rankingMentionable: Object.values(mentionables.val())
        })
      );

  feedsObserve = () =>
    this.props.firebase
      .ref("social")
      .child("public_feed")
      .on("value", feed => this.setState({ feeds: Object.values(feed.val()) }));

  openEntity = link => this.props.changePage(link);

  easterEggOne = () => this.setState({ es: !this.state.es });

  componentWillUnmount = () => {
    let superbar = document.getElementById("superBar");
    if (superbar) superbar.classList.remove("whiteshit");
  };

  render() {
    const { classes, status } = this.props;
    const {
      feeds,
      anchorEl,
      es,
      loading,
      ongoing,
      ongoingM,
      rankingMentionable
    } = this.state;

    const user = this.props.profile;

    const openFeed = Boolean(anchorEl);

    const settings = {
      className: classes.sliderBig,
      dots: true,
      infinite: false,
      dotsClass: classes.sliderDots,
      arrows: true,
      focusOnSelect: true,
      easing: "ease",
      speed: 300,
      slidesToShow: 5,
      slidesToScroll: 1,
      autoPlay: true,
      autoPlaySpeed: 1000,
      responsive: [
        { breakpoint: 2000, settings: { slidesToShow: 3 } },
        { breakpoint: 1200, settings: { slidesToShow: 1 } }
      ]
    };

    return (
      <div>
        <CircularProgress
          className={classes.loading}
          style={!loading ? { opacity: 0 } : null}
        />
        <div className={classes.frame} style={loading ? { opacity: 0 } : null}>
          {user && user.headers ? (
            <img
              src={user.headers}
              alt=""
              className={classes.bgImage}
              style={{ opacity: 0 }}
              onLoad={e => (e.currentTarget.style.opacity = null)}
            />
          ) : (
            <video
              muted
              loop
              autoPlay
              src={ripple}
              alt=""
              className={classes.bgImage}
              style={{ opacity: 0 }}
              onLoad={e => (e.currentTarget.style.opacity = null)}
            />
          )}
          <div className={classes.topHeaderBig}>
            <Grid container spacing={16} className={classes.container}>
              <Grid item xs className={classes.itemContainer}>
                <Typography type="title" className={classes.headlineTitle}>
                  {user && user.username
                    ? "Welcome to the Mirai Preview Program, " + user.username
                    : "What once started with Y now starts with M."}
                </Typography>
              </Grid>
            </Grid>
          </div>
          <div className={classes.root}>
            <Grid
              container
              spacing={16}
              className={classes.container}
              style={{ paddingBottom: 0 }}
            >
              <Grid
                item
                xs
                className={classes.itemContainer}
                style={{
                  marginBottom: 0,
                  flexDirection: "row",
                  display: "flex"
                }}
              >
                <Typography
                  type="title"
                  className={classes.headline}
                  style={{ marginBottom: 0 }}
                >
                  Currently ongoing anime
                </Typography>
                <div style={{ flex: 1 }} />
                <Typography
                  type="title"
                  className={classes.headline}
                  style={{ marginBottom: 0 }}
                >
                  {this.props.mir && this.props.mir.twist
                    ? Object.values(this.props.mir.twist).filter(
                        s => s.ongoing === true
                      ).length -
                      1 +
                      " ongoing animes in database"
                    : null}
                </Typography>
              </Grid>
            </Grid>
            {ongoing && ongoing.data ? (
              <div className={classes.topHeader}>
                <SuperTable
                  settings={settings}
                  data={ongoing.data.Page.media
                    .filter(s => s.nextAiringEpisode)
                    .sort(
                      (a, b) =>
                        a.nextAiringEpisode.timeUntilAiring -
                        b.nextAiringEpisode.timeUntilAiring
                    )}
                  type="s"
                  typeof="ongoing"
                  limit={12}
                />
              </div>
            ) : null}
            {/*<Grid
              container
              spacing={16}
              className={classes.container}
              style={{ paddingBottom: 0 }}
            >
              <Grid
                item
                xs
                className={classes.itemContainer}
                style={{ marginBottom: 0 }}
              >
                <Typography
                  type="title"
                  className={classes.headline}
                  style={{ marginBottom: 0 }}
                >
                  Currently ongoing manga
                </Typography>
              </Grid>
            </Grid>
            {ongoingM && ongoingM.data ? (
              <div className={classes.topHeader}>
                <SuperTable
                  settings={settings}
                  data={ongoingM.data.Page.media}
                  type="m"
                  typeof="ongoing"
                  limit={12}
                />
              </div>
            ) : null}*/}
            <Grid
              container
              spacing={16}
              className={classes.container}
              style={{ paddingBottom: 0 }}
            >
              <Grid
                item
                xs
                className={classes.itemContainer}
                style={{
                  marginBottom: 0,
                  flexDirection: "row",
                  display: "flex"
                }}
              >
                <Typography
                  type="title"
                  className={classes.headline}
                  style={{ marginBottom: 0 }}
                >
                  Ranking
                </Typography>
              </Grid>
            </Grid>
            <div className={classes.topHeader}>
              {rankingMentionable ? (
                <SuperTable
                  data={Object.values(rankingMentionable[0])}
                  settings={settings}
                  type="s"
                  typeof="ranking"
                  limit={12}
                />
              ) : null}
            </div>
            <Grid container spacing={16} className={classes.container}>
              <Grid item xs className={classes.itemContainer}>
                <Typography type="title" className={classes.headline}>
                  Public feeds
                </Typography>
                <Grid container spacing={16}>
                  {feeds &&
                    feeds.map((feed, index) => (
                      <Grid item xs key={index}>
                        <Card classes={{ root: classes.cardColor }}>
                          <CardHeader
                            avatar={
                              <Avatar
                                alt=""
                                src={miraiIcon}
                                className={classes.avatar}
                              />
                            }
                            title={feed.name}
                            subheader={feed.user.name + " - " + feed.date}
                          />
                          {feed.image ? <CardMedia image={feed.image} /> : null}
                          <CardContent>
                            <Typography type="body1">{feed.context}</Typography>
                          </CardContent>
                          <Divider />
                          <CardActions>
                            <Button
                              color="contrast"
                              className={classes.likeCount}
                            >
                              {feed.likes.length}{" "}
                              {feed.likes.length === 1 ? "Like" : "Likes"}
                            </Button>
                            <Button
                              color="contrast"
                              className={classes.likeCount}
                            >
                              {feed.comments.length}{" "}
                              {feed.comments.length === 1
                                ? "Comment"
                                : "Comments"}
                            </Button>
                            <div className={classes.spacer} />
                            <IconButton>
                              <PlusOneIcon />
                            </IconButton>
                            <IconButton>
                              <ShareIcon />
                            </IconButton>
                          </CardActions>
                        </Card>
                        <Menu
                          id="feed-menu"
                          anchorEl={anchorEl}
                          open={openFeed}
                          onRequestClose={() =>
                            this.setState({ anchorEl: null })
                          }
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "right"
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right"
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              this.setState({ anchorEl: null });
                              this.easterEggOne();
                            }}
                          >
                            I have issues with different opinions
                          </MenuItem>
                        </Menu>
                      </Grid>
                    ))}
                </Grid>
              </Grid>
            </Grid>
            {user && user.episodeProgress ? (
              <div>
                <Grid
                  container
                  spacing={16}
                  className={classes.container}
                  style={{ paddingBottom: 0 }}
                >
                  <Grid
                    item
                    xs
                    className={classes.itemContainer}
                    style={{
                      marginBottom: 0,
                      flexDirection: "row",
                      display: "flex"
                    }}
                  >
                    <Typography
                      type="title"
                      className={classes.headline}
                      style={{ marginBottom: 0 }}
                    >
                      Animes you've watched previously
                    </Typography>
                    <div style={{ flex: 1 }} />
                    <Typography
                      type="title"
                      className={classes.headline}
                      style={{ marginBottom: 0 }}
                    >
                      {Object.values(user.episodeProgress).length} animes seen
                    </Typography>
                  </Grid>
                </Grid>
                <div className={classes.topHeader}>
                  <SuperTable
                    data={Object.values(user.episodeProgress)
                      .filter(s => s.recentlyWatched)
                      .sort((a, b) => b.recentlyWatched - a.recentlyWatched)}
                    limit={24}
                    type="s"
                    typeof="progress"
                    settings={settings}
                  />
                </div>
              </div>
            ) : null}
            {user && user.favs && user.favs.show && user.favs.show ? (
              <div>
                <Grid
                  container
                  spacing={16}
                  className={classes.container}
                  style={{ paddingBottom: 0 }}
                >
                  <Grid
                    item
                    xs
                    className={classes.itemContainer}
                    style={{
                      marginBottom: 0,
                      flexDirection: "row",
                      display: "flex"
                    }}
                  >
                    <Typography
                      type="title"
                      className={classes.headline}
                      style={{ marginBottom: 0 }}
                    >
                      Your anime favorites
                    </Typography>
                    <div style={{ flex: 1 }} />
                    <Typography
                      type="title"
                      className={classes.headline}
                      style={{ marginBottom: 0 }}
                    >
                      {Object.values(user.favs.show).length} anime favourties
                    </Typography>
                  </Grid>
                </Grid>
                <div className={classes.topHeader}>
                  <SuperTable
                    data={Object.values(user.favs.show).sort(
                      (a, b) => a.name - b.name
                    )}
                    limit={24}
                    type="s"
                    typeof="favs"
                    settings={settings}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default firebaseConnect()(
  connect(({ firebase: { auth, profile }, mir }) => ({
    auth,
    profile,
    mir
  }))(withStyles(styles)(Home))
);
