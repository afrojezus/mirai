import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import * as ICON from "material-ui-icons";
import Typography from "material-ui/Typography";
import localForage from "localforage";
import Grid from "material-ui/Grid";
import IconButton from "material-ui/IconButton";
import checkLang from "../checklang";
import strings from "../strings.json";
import { firebaseConnect, isEmpty } from "react-redux-firebase";
import Colorizer from "../utils/colorizer";
import { blue, grey } from "material-ui/colors";
import { connect } from "react-redux";
import Filter from "../utils/filter";
import { scrollFix } from "./../utils/scrollFix";
import CardButton from "../components/cardButton";
import {
  Container,
  Root,
  Header,
  LoadingIndicator,
  TitleHeader,
  ItemContainer,
  SectionTitle
} from "../components/layouts";
import SuperTable from "../components/supertable";
import Anilist from "../anilist-api";
import { bigFuckingQuery, bigFuckingQueryM } from "../anilist-api/queries";
import Hidden from "material-ui/Hidden";
import { FeedMaker, Feed } from "../components/feed";
import Select from "material-ui/Select";
import { MenuItem } from "material-ui/Menu";

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 8
  },
  container: {
    marginLeft: "auto",
    marginRight: "auto",
    padding: 24,
    maxWidth: 1600,
    paddingLeft: "env(safe-area-inset-left)",
    paddingRight: "env(safe-area-inset-right)"
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
    background: "black",
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
    margin: "auto"
  },
  headlineTitle: {
    marginBottom: 24,
    fontSize: 48,
    fontWeight: 800
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
  }
});

class Home extends Component {
  state = {
    feeds: null,
    anchorEl: null,
    es: false,
    loading: true,
    ongoing: null,
    rankingMentionable: null,
    hue: "#111",
    hueVib: "#111",
    hueVibN: "#111",
    lang: strings.enus,
    filterFeedVal: 0
  };

  componentWillMount = () => {
    checkLang(this);
    scrollFix();
  };

  componentDidMount = () => {
    this.feedsObserve();
    this.getColors();
    this.setState({ loading: false });
  };
  componentWillUnmount = () => {};

  getColors = () => {
    const hue = localStorage.getItem("user-hue");
    if (hue) {
      let hues = JSON.parse(hue);
      return this.setState({
        hue: hues.hue,
        hueVib: hues.hueVib,
        hueVibN: hues.hueVibN
      });
    } else {
      return null;
    }
  };

  feedsObserve = () => {
    return this.props.firebase.ref("social").on("value", feed => {
      return this.props.firebase.ref("users").on("value", usersR => {
        if (!feed) {
          return null;
        }

        // Get all 'social' feeds
        const feedsync = feed.val();
        // Get users
        const usersync = usersR.val();
        // Get activity feed from users
        const users = Object.values(usersync)
          .filter(x => x.feed)
          .map(f => f.feed);
        const userFeedArray = users.map(s => Object.values(s));
        // THIS SHIT IS GIVING ME HEADACHES.
        let userFeeds = [];
        userFeedArray.map(a => a.map(s => userFeeds.push(s)));
        // Make sure there ain't duplicates
        const activities = Object.values(userFeeds).filter(a =>
          userFeeds.map(s => !s.activity)
        );

        // Group them together in one fuckfeed
        let feeds = [
          ...Object.values(feedsync.byusers),
          ...feedsync.public_feed,
          ...activities
        ];

        feeds.sort((a, b) => b.date - a.date);

        return this.setState({ feeds: feeds });
      });
    });
  };

  openEntity = link => this.props.changePage(link);

  easterEggOne = () => this.setState({ es: !this.state.es });

  filterFeed = e => this.setState({ filterFeedVal: e.target.value });

  componentDidCatch(error, info) {
    console.log(error, info);
  }

  render() {
    const { classes } = this.props;
    const {
      feeds,
      loading,
      ongoing,
      ongoingM,
      rankingMentionable,
      hue,
      hueVibN,
      lang,
      filterFeedVal
    } = this.state;

    const user = this.props.profile;
    return (
      <div>
        <LoadingIndicator loading={loading} />
        {!isEmpty(user) && user.headers ? (
          <Header image={user.headers} color={hue} />
        ) : null}
        <div className={classes.frame}>
          <TitleHeader
            title={!isEmpty(user) ? null : lang.home.welcomeanon}
            color={hue !== "#111" ? hue : "#111"}
          />
          <Root>
            <Container hasHeader={!isEmpty(user) ? false : true} spacing={16}>
              <Hidden mdDown>
                <Grid item xs={3}>
                  <SectionTitle title="Sample text" />
                </Grid>
              </Hidden>
              <Grid item xs>
                <FeedMaker color={hue} />
                <Container style={{ padding: 8 }}>
                  <SectionTitle title={lang.home.feeds} noPad />
                  <div style={{ flex: 1 }} />
                  <form>
                    <Select value={filterFeedVal} onChange={this.filterFeed}>
                      <MenuItem value={0}>All</MenuItem>
                      <MenuItem value={1}>Only posts</MenuItem>
                      <MenuItem value={2}>Only activities</MenuItem>
                    </Select>
                  </form>
                </Container>
                {feeds &&
                feeds.filter(
                  o =>
                    filterFeedVal === 0
                      ? o
                      : filterFeedVal === 1
                        ? !o.type
                        : filterFeedVal === 2 ? o.type : null
                ).length > 0 ? (
                  feeds
                    .filter(
                      o =>
                        filterFeedVal === 0
                          ? o
                          : filterFeedVal === 1
                            ? !o.type
                            : filterFeedVal === 2 ? o.type : null
                    )
                    .map((feed, index) => {
                      if (feed.user.username === undefined)
                        // It's an update.
                        return (
                          <Feed
                            key={index}
                            ftitle={feed.name}
                            context={"MIRAI UPDATE"}
                            text={feed.context}
                            date={feed.date}
                            avatar={feed.user.image}
                            id={feed.id}
                            user={feed.user}
                            mirUpdate
                            noActions
                            color={hue}
                          />
                        );
                      else if (feed.context === "INTRO")
                        // It's an intro feed
                        return (
                          <Feed
                            key={index}
                            ftitle={feed.user.username}
                            context={feed.context}
                            text={feed.text}
                            date={feed.date}
                            avatar={feed.user.avatar}
                            image={feed.image}
                            id={feed.id}
                            user={feed.user}
                            noDelete
                            noActions
                            color={hue}
                          />
                        );
                      else if (feed.type)
                        // It's an activity feed
                        return (
                          <Feed
                            key={index}
                            ftitle={feed.user.username}
                            context={feed.activity}
                            date={feed.date}
                            avatar={feed.user.avatar}
                            showId={feed.showId}
                            id={feed.id}
                            image={feed.coverImg}
                            user={{
                              avatar: feed.user.avatar,
                              id: feed.user.userID,
                              username: feed.user.username
                            }}
                            color={hue}
                            activity
                            noActions
                          />
                        ); // It's an user-made feed
                      else
                        return (
                          <Feed
                            key={index}
                            ftitle={feed.user.username}
                            context={feed.context}
                            text={feed.text}
                            date={feed.date}
                            avatar={feed.user.avatar}
                            image={feed.image}
                            id={feed.id}
                            user={feed.user}
                            color={hue}
                          />
                        );
                    })
                ) : (
                  <SectionTitle title="Nobody has said anything..." lighter />
                )}
              </Grid>
              <Grid item xs={3}>
                {!isEmpty(user) &&
                user.favs &&
                user.favs.show &&
                user.favs.show ? (
                  <div style={{ width: "100%" }}>
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
                      <SectionTitle title={lang.home.animefavTitle} />
                      <div style={{ flex: 1 }} />
                      <Typography variant="title" className={classes.headline}>
                        {Object.values(user.favs.show).length}{" "}
                        {lang.home.animefavEstimate}
                      </Typography>
                    </Grid>
                    <ItemContainer style={{ marginTop: 24 }}>
                      {Object.values(user.favs.show)
                        .sort((a, b) => a.name - b.name)
                        .map(anime => (
                          <CardButton
                            key={anime.id}
                            title={anime.name}
                            image={anime.image}
                            onClick={() =>
                              this.props.history.push(`/show?s=${anime.id}`)
                            }
                          />
                        ))}
                    </ItemContainer>
                  </div>
                ) : null}
              </Grid>
            </Container>
          </Root>
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
