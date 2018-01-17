import React, { Component } from "react";
import * as M from "material-ui";
import * as Icon from "material-ui-icons";
import Aqua2 from "../assets/aqua2.mp4";

import { firebaseConnect } from "react-redux-firebase";

const specialColor = M.colors.red.A700;

const styles = theme => ({
  root: {
    // paddingTop: theme.spacing.unit * 8
  },
  container: {
    marginLeft: "auto",
    marginRight: "auto",
    padding: 24,
    maxWidth: 1600
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
    background: specialColor,
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
    background: M.colors.grey[800]
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
    fontWeight: 800,
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
      borderColor: M.colors.blue.A200
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

class Feeds extends Component {
  state = {
    feeds: null,
    anchorEl: null,
    es: false,
    loading: true,
    ongoing: null,
    rankingMentionable: null
  };

  componentDidMount = async () => {
    this.makeTitlebarColored();
    this.feedsObserve().then(() =>
      setTimeout(() => this.setState({ loading: false }), 300)
    );
  };

  feedsObserve = async () =>
    this.props.firebase
      .ref("social")
      .child("public_feed")
      .on("value", feed => this.setState({ feeds: Object.values(feed.val()) }));

  makeTitlebarColored = () => {
    let superbar = document.getElementById("superBar");
    if (superbar) {
      superbar.style.background = specialColor;
      superbar.style.boxShadow = "none";
    }
  };

  componentWillUnmount = () => {
    let superbar = document.getElementById("superBar");
    if (superbar) {
      superbar.style = null;
    }
  };
  render() {
    const { classes, user, history, meta } = this.props;
    const { publicfeed, loading } = this.state;
    return (
      <div>
        <M.CircularProgress
          className={classes.loading}
          style={!loading ? { opacity: 0 } : null}
        />
        <div className={classes.frame} style={loading ? { opacity: 0 } : null}>
          <video
            muted
            loop
            autoPlay
            src={Aqua2}
            alt=""
            className={classes.bgImage}
          />
          <div className={classes.topHeaderBig}>
            <M.Grid container spacing={16} className={classes.container}>
              <M.Grid item xs className={classes.itemContainer}>
                <M.Typography type="title" className={classes.headlineTitle}>
                  Feeds.
                </M.Typography>
              </M.Grid>
            </M.Grid>
          </div>
          <div className={classes.root}>
            <M.Grid
              container
              spacing={0}
              className={classes.container}
              style={{ marginBottom: 0 }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default firebaseConnect()(M.withStyles(styles)(Feeds));
