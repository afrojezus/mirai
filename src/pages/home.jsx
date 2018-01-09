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

import { MIR_TWIST_LOAD } from "../constants";

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

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 8
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
    opacity: 0.4,
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
    "& > .slick-list": {}
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
    ongoing: null
  };

  componentDidMount = async () => {
    this.feedsObserve();
    this.twistLoad();
    this.fetchOngoing().then(() =>
      setTimeout(() => this.setState({ loading: false }), 300)
    );
  };

  twistLoad = async () => {
    if (this.props.mir && this.props.mir.twist) return null;
    else Twist.load().then(twist => this.props.twistInit(twist));
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

  feedsObserve = () =>
    this.props.firebase
      .ref("social")
      .child("public_feed")
      .on("value", feed => this.setState({ feeds: Object.values(feed.val()) }));

  openEntity = link => this.props.changePage(link);

  easterEggOne = () => this.setState({ es: !this.state.es });

  render() {
    const { classes, status } = this.props;
    const { feeds, anchorEl, es, loading, ongoing, ongoingM } = this.state;

    const user = this.props.profile;

    const openFeed = Boolean(anchorEl);

    const settings = {
      className: classes.sliderBig,
      dots: true,
      infinite: false,
      dotsClass: classes.sliderDots,
      arrows: false,
      focusOnSelect: true,
      easing: "ease",
      speed: 300,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoPlay: true,
      autoPlaySpeed: 1000
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
          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            open={es}
            autoHideDuration={6000}
            onRequestClose={this.easterEggOne}
            SnackbarContentProps={{
              "aria-describedby": "message-id"
            }}
            className={classes.snackBar}
            message={<span id="message-id">hahahahahah.</span>}
            action={
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.easterEggOne}
              >
                <CloseIcon />
              </IconButton>
            }
          />
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
                style={{ marginBottom: 0 }}
              >
                <Typography
                  type="title"
                  className={classes.headline}
                  style={{ marginBottom: 0 }}
                >
                  Ongoing anime
                </Typography>
              </Grid>
            </Grid>
            {ongoing && ongoing.data ? (
              <div className={classes.topHeader}>
                <Slider {...settings}>
                  {ongoing.data.Page.media.map((anime, index) => (
                    <Card className={classes.bigCard}>
                      <div className={classes.bigCardImage}>
                        <img
                          src={
                            anime.bannerImage
                              ? anime.bannerImage
                              : anime.coverImage.large
                          }
                          alt=""
                          className={classes.bigCardImageImg}
                        />
                      </div>
                      <div className={classes.bigCardRow}>
                        <img
                          src={anime.coverImage.large}
                          alt=""
                          className={classes.bigCardIcon}
                          onClick={() => this.openEntity(`/show?s=${anime.id}`)}
                        />
                        <div className={classes.bigCardText}>
                          <Typography
                            type="display2"
                            className={classes.bigCardVerySmallTitle}
                          >
                            {anime.genres[0]}
                          </Typography>
                          <Typography
                            type="display2"
                            className={classes.bigCardTitle}
                          >
                            {anime.title.english
                              ? anime.title.english
                              : anime.title.romaji}
                          </Typography>
                          <Dotdotdot clamp={3}>
                            <Typography
                              type="display2"
                              className={classes.bigCardSmallTitle}
                              dangerouslySetInnerHTML={{
                                __html: anime.description
                              }}
                            />
                          </Dotdotdot>
                        </div>
                      </div>
                    </Card>
                  ))}
                </Slider>
              </div>
            ) : null}
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
                style={{ marginBottom: 0 }}
              >
                <Typography
                  type="title"
                  className={classes.headline}
                  style={{ marginBottom: 0 }}
                >
                  Ongoing manga
                </Typography>
              </Grid>
            </Grid>
            {ongoingM && ongoingM.data ? (
              <div className={classes.topHeader}>
                <Slider {...settings}>
                  {ongoingM.data.Page.media.map((anime, index) => (
                    <Card className={classes.bigCard}>
                      <div className={classes.bigCardImage}>
                        <img
                          src={
                            anime.bannerImage
                              ? anime.bannerImage
                              : anime.coverImage.large
                          }
                          alt=""
                          className={classes.bigCardImageImg}
                        />
                      </div>
                      <div className={classes.bigCardRow}>
                        <img
                          src={anime.coverImage.large}
                          alt=""
                          className={classes.bigCardIcon}
                          onClick={() => this.openEntity(`/show?m=${anime.id}`)}
                        />
                        <div className={classes.bigCardText}>
                          <Typography
                            type="display2"
                            className={classes.bigCardVerySmallTitle}
                          >
                            {anime.genres[0]}
                          </Typography>
                          <Typography
                            type="display2"
                            className={classes.bigCardTitle}
                          >
                            {anime.title.english
                              ? anime.title.english
                              : anime.title.romaji}
                          </Typography>
                          <Dotdotdot clamp={3}>
                            <Typography
                              type="display2"
                              className={classes.bigCardSmallTitle}
                              dangerouslySetInnerHTML={{
                                __html: anime.description
                              }}
                            />
                          </Dotdotdot>
                        </div>
                      </div>
                    </Card>
                  ))}
                </Slider>
              </div>
            ) : null}
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
                style={{ marginBottom: 0 }}
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
              <Slider {...settings}>
                <Card className={classes.bigCard}>
                  <div className={classes.bigCardImage}>
                    <img
                      src="https://cdn.anilist.co/img/dir/anime/banner/98707-j0WtWtjACgJm.jpg"
                      alt=""
                      className={classes.bigCardImageImg}
                    />
                  </div>
                  <div className={classes.bigCardRow}>
                    <img
                      src="https://cdn.anilist.co/img/dir/anime/reg/98707-yKcrtBTmFjEu.png"
                      alt=""
                      className={classes.bigCardIcon}
                      onClick={() => this.openEntity("/show?s=98707")}
                    />
                    <div className={classes.bigCardText}>
                      <Typography
                        type="display2"
                        className={classes.bigCardVerySmallTitle}
                      >
                        <span role="img" aria-label="gemstone">
                          💎
                        </span>{" "}
                        GEM OF LAST SEASON
                      </Typography>
                      <Typography
                        type="display2"
                        className={classes.bigCardTitle}
                      >
                        Land of The Lustrous
                      </Typography>
                      <Typography
                        type="display2"
                        className={classes.bigCardSmallTitle}
                      >
                        Gems. A Monk. Moon people, and a whole lot more that we
                        can't explain
                      </Typography>
                    </div>
                  </div>
                </Card>
                <Card className={classes.bigCard}>
                  <div className={classes.bigCardImage}>
                    <img
                      src="https://cdn.anilist.co/img/dir/anime/banner/21827-axEmcLTtSMay.jpg"
                      alt=""
                      className={classes.bigCardImageImg}
                    />
                  </div>
                  <div className={classes.bigCardRow}>
                    <img
                      src="https://cdn.anilist.co/img/dir/anime/reg/21827-Xlo8r4tIfrJI.jpg"
                      alt=""
                      className={classes.bigCardIcon}
                      onClick={() => this.openEntity("/show?s=21827")}
                    />
                    <div className={classes.bigCardText}>
                      <Typography
                        type="display2"
                        className={classes.bigCardVerySmallTitle}
                      >
                        <span role="img" aria-label="gemstone">
                          ⭐
                        </span>{" "}
                        POPULAR UNDERDOG OF THE SEASON
                      </Typography>
                      <Typography
                        type="display2"
                        className={classes.bigCardTitle}
                      >
                        Violet Evergarden
                      </Typography>
                      <Typography
                        type="display2"
                        className={classes.bigCardSmallTitle}
                      >
                        Perhaps KyoAnis most prestigious work yet, well we've
                        yet to see
                      </Typography>
                    </div>
                  </div>
                </Card>
                <Card className={classes.bigCard}>
                  <div className={classes.bigCardImage}>
                    <img
                      src=" https://cdn.anilist.co/img/dir/anime/reg/98549-XfLyPhrP5Ors.jpg"
                      alt=""
                      className={classes.bigCardImageImg}
                    />
                  </div>
                  <div className={classes.bigCardRow}>
                    <img
                      src="https://cdn.anilist.co/img/dir/anime/reg/98549-XfLyPhrP5Ors.jpg"
                      alt=""
                      className={classes.bigCardIcon}
                      onClick={() => this.openEntity("/show?s=98549")}
                    />
                    <div className={classes.bigCardText}>
                      <Typography
                        type="display2"
                        className={classes.bigCardVerySmallTitle}
                      >
                        <span role="img" aria-label="gemstone">
                          😂
                        </span>{" "}
                        IT'S JOKE
                      </Typography>
                      <Typography
                        type="display2"
                        className={classes.bigCardTitle}
                      >
                        Pop Team Epic
                      </Typography>
                      <Typography
                        type="display2"
                        className={classes.bigCardSmallTitle}
                      >
                        A modern piece of comedy, a masterful shitpost
                      </Typography>
                    </div>
                  </div>
                </Card>
                <Card className={classes.bigCard}>
                  <div className={classes.bigCardImage}>
                    <img
                      src="https://cdn.anilist.co/img/dir/anime/reg/97832-XPMLlgFULgJW.jpg"
                      alt=""
                      className={classes.bigCardImageImg}
                      onClick={() => this.openEntity("/show?s=97832")}
                    />
                  </div>
                  <div className={classes.bigCardRow}>
                    <img
                      src="https://cdn.anilist.co/img/dir/anime/reg/97832-XPMLlgFULgJW.jpg"
                      alt=""
                      className={classes.bigCardIcon}
                    />
                    <div className={classes.bigCardText}>
                      <Typography
                        type="display2"
                        className={classes.bigCardVerySmallTitle}
                      >
                        <span role="img" aria-label="gemstone">
                          ⛸️
                        </span>{" "}
                        THE (LITERALLY) YURI ON ICE ONE THIS SEASON
                      </Typography>
                      <Typography
                        type="display2"
                        className={classes.bigCardTitle}
                      >
                        Citrus
                      </Typography>
                      <Typography
                        type="display2"
                        className={classes.bigCardSmallTitle}
                      >
                        Gay girls.
                      </Typography>
                    </div>
                  </div>
                </Card>
                <Card className={classes.bigCard}>
                  <div className={classes.bigCardImage}>
                    <img
                      src="https://cdn.anilist.co/img/dir/anime/reg/99468-9Ij1UpsehSVx.jpg"
                      alt=""
                      className={classes.bigCardImageImg}
                      onClick={() => this.openEntity("/show?s=99468")}
                    />
                  </div>
                  <div className={classes.bigCardRow}>
                    <img
                      src="https://cdn.anilist.co/img/dir/anime/reg/99468-9Ij1UpsehSVx.jpg"
                      alt=""
                      className={classes.bigCardIcon}
                    />
                    <div className={classes.bigCardText}>
                      <Typography
                        type="display2"
                        className={classes.bigCardVerySmallTitle}
                      >
                        <span role="img" aria-label="gemstone">
                          👺
                        </span>{" "}
                        THE MOST GENERIC ONE THIS SEASON
                      </Typography>
                      <Typography
                        type="display2"
                        className={classes.bigCardTitle}
                      >
                        Karakai Jozu no Takagi-san
                      </Typography>
                      <Typography
                        type="display2"
                        className={classes.bigCardSmallTitle}
                      >
                        Idk, you tell me.
                      </Typography>
                    </div>
                  </div>
                </Card>
              </Slider>
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
                            action={
                              <IconButton
                                aria-label="More"
                                aria-owns={openFeed ? "feed-menu" : null}
                                aria-haspopup="true"
                                onClick={e =>
                                  this.setState({ anchorEl: e.currentTarget })
                                }
                              >
                                <MoreVertIcon />
                              </IconButton>
                            }
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
                {user && user.episodeProgress ? (
                  <div className={classes.fullWidth}>
                    <Divider className={classes.divide} />
                    <Typography type="title" className={classes.headline}>
                      Animes you've watched previously
                    </Typography>
                    <Grid container>
                      {Object.values(user.episodeProgress).map(
                        (anime, index) => (
                          <Grid
                            className={classes.entityCard}
                            item
                            xs
                            key={index}
                          >
                            <Card
                              style={{ background: "transparent" }}
                              onClick={() =>
                                this.openEntity(
                                  `/show?s=${
                                    anime.anime
                                      ? anime.anime.meta.i
                                      : anime.showId
                                  }`
                                )
                              }
                            >
                              <div className={classes.gradientCard}>
                                <CardMedia
                                  className={classes.entityImage}
                                  image={
                                    anime.anime
                                      ? anime.anime.meta.a
                                      : anime.showArtwork
                                  }
                                />
                              </div>
                              <Typography
                                type="headline"
                                className={classes.entityTitle}
                              >
                                {anime.anime
                                  ? anime.anime.meta.t
                                    ? anime.anime.meta.t
                                    : anime.anime.meta.r
                                  : anime.title}
                              </Typography>
                              <Typography
                                type="headline"
                                className={classes.entitySubTitle}
                              >
                                {anime.ep ? "EPISODE " + anime.ep : null}
                              </Typography>
                            </Card>
                          </Grid>
                        )
                      )}
                    </Grid>
                  </div>
                ) : null}
                {user && user.favs && user.favs.show && user.favs.show ? (
                  <div className={classes.fullWidth}>
                    <Divider className={classes.divide} />
                    <Typography type="title" className={classes.headline}>
                      Your favourites
                    </Typography>
                    <Grid container>
                      {Object.values(user.favs.show).map((anime, index) => (
                        <Grid
                          className={classes.entityCard}
                          item
                          xs
                          key={index}
                        >
                          <Card
                            style={{ background: "transparent" }}
                            onClick={() => this.openEntity(anime.link)}
                          >
                            <div className={classes.gradientCard}>
                              <CardMedia
                                className={classes.entityImage}
                                image={anime.image}
                              />
                            </div>
                            <Typography
                              type="headline"
                              className={classes.entityTitle}
                            >
                              {anime.name}
                            </Typography>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                ) : null}
                <Grid container>
                  {ongoing && ongoing.data ? (
                    <Grid item xs className={classes.fullWidth}>
                      <Divider className={classes.divide} />
                      <Typography type="title" className={classes.headline}>
                        Currently ongoing anime
                      </Typography>
                      <Grid container>
                        {ongoing.data.Page.media.map((anime, index) => (
                          <Grid
                            className={classes.entityCard}
                            item
                            xs
                            key={index}
                          >
                            <Card
                              style={{ background: "transparent" }}
                              onClick={() =>
                                this.openEntity(`/show?s=${anime.id}`)
                              }
                            >
                              <div className={classes.gradientCard}>
                                <CardMedia
                                  className={classes.entityImage}
                                  image={anime.coverImage.large}
                                />
                              </div>
                              <Typography
                                type="headline"
                                className={classes.entityTitle}
                              >
                                {anime.title.english
                                  ? anime.title.english
                                  : anime.title.romaji}
                              </Typography>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  ) : null}
                  {ongoingM && ongoingM.data ? (
                    <Grid item xs className={classes.fullWidth}>
                      <Divider className={classes.divide} />
                      <Typography type="title" className={classes.headline}>
                        Currently ongoing manga
                      </Typography>
                      <Grid container>
                        {ongoingM.data.Page.media.map((manga, index) => (
                          <Grid
                            className={classes.entityCard}
                            item
                            xs
                            key={index}
                          >
                            <Card
                              style={{ background: "transparent" }}
                              onClick={() =>
                                this.openEntity(`/show?m=${manga.id}`)
                              }
                            >
                              <div className={classes.gradientCard}>
                                <CardMedia
                                  className={classes.entityImage}
                                  image={manga.coverImage.large}
                                />
                              </div>
                              <Typography
                                type="headline"
                                className={classes.entityTitle}
                              >
                                {manga.title.english
                                  ? manga.title.english
                                  : manga.title.romaji}
                              </Typography>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changePage: page => push(page),
      twistInit: twist => twistLoad(twist)
    },
    dispatch
  );

const twistLoad = twist => {
  return {
    type: MIR_TWIST_LOAD,
    twist
  };
};

export default firebaseConnect()(
  connect(
    ({ firebase: { auth, profile }, mir }) => ({
      auth,
      profile,
      mir
    }),
    mapDispatchToProps
  )(withStyles(styles)(Home))
);
