import React, { Component } from "react";
import * as M from "material-ui";
import * as Icon from "material-ui-icons";

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
    width: "100%",
    paddingTop: theme.spacing.unit * 8,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 24,
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
    padding: theme.spacing.unit,
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
    transition: theme.transitions.create(["all"])
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
    marginBottom: theme.spacing.unit * 6
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
    boxShadow: "0 3px 18px rgba(0,0,0,.5)",
    transition: theme.transitions.create(["all"]),
    position: "relative",
    zIndex: 500
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
  }
});

class PageNotFound extends Component {
  state = {
    loading: true
  };

  componentDidMount = () =>
    setTimeout(() => this.setState({ loading: false }), 300);
  render() {
    const { classes } = this.props;
    const { loading } = this.state;
    return (
      <div>
        <M.CircularProgress
          className={classes.loading}
          style={!loading ? { opacity: 0 } : null}
        />
        <div className={classes.root} style={loading ? { opacity: 0 } : null}>
          <M.Typography type="display2" className={classes.bigTitle}>
            404: page not found.
          </M.Typography>
        </div>
      </div>
    );
  }
}

export default M.withStyles(style)(PageNotFound);
