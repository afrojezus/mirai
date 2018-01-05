import React, { Component } from "react";
import * as M from "material-ui";
import * as Icon from "material-ui-icons";

import { Database, Auth } from "../utils/firebase";

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
    marginLeft: "auto",
    marginRight: "auto",
    padding: 24,
    maxWidth: 1200,
    paddingTop: theme.spacing.unit * 8,
    [theme.breakpoints.up("md")]: {
      maxWidth: "calc(100% - 64px)"
    }
  },
  fillImg: {
    height: "100%",
    width: "100%",
    objectFit: "cover"
  },
  header: {
    display: "flex",
    width: "100%",
    margin: "auto"
  },
  avatar: {
    width: 256,
    height: 256,
    boxShadow: "0 2px 16px rgba(0,0,0,.27)",
    margin: "auto"
  },
  mainHead: {
    flex: 1,
    margin: "auto",
    padding: theme.spacing.unit,
    width: "100%",
    paddingLeft: theme.spacing.unit * 6
  },
  title: {
    fontWeight: 700,
    fontSize: 52,
    color: "white",
    textShadow: "0 1px 12px rgba(0,0,0,.17)"
  },
  nicktitle: {
    fontWeight: 500,
    color: "white",
    fontSize: 28,
    textShadow: "0 1px 12px rgba(0,0,0,.07)"
  },
  motto: {
    color: "white",
    marginTop: theme.spacing.unit * 4
  }
});

class User extends Component {
  state = {
    loading: true
  };

  componentDidMount = () =>
    setTimeout(() => this.setState({ loading: false }, async () => {}), 300);

  render() {
    const { classes, user, history, meta, status } = this.props;
    const { loading } = this.state;
    if (!user) return null;
    return (
      <div className={classes.root} style={loading ? { opacity: 0 } : null}>
        <img src={user.headers} alt="" className={classes.bgImage} />
        <M.Grid container spacing={0} className={classes.content}>
          <div className={classes.header}>
            <M.Avatar
              src={user.avatar}
              className={classes.avatar}
              classes={{ img: classes.fillImg }}
              style={
                status.hasOwnProperty(user.userID)
                  ? { border: "4px solid lime" }
                  : null
              }
            />
            <div className={classes.mainHead}>
              <M.Typography type="display2" className={classes.title}>
                {user.username}
              </M.Typography>
              <M.Typography type="display1" className={classes.nicktitle}>
                {user.nick}
              </M.Typography>
              <M.Typography
                type="body1"
                className={classes.motto}
                dangerouslySetInnerHTML={{ __html: user.motto }}
              />
            </div>
          </div>
        </M.Grid>
      </div>
    );
  }
}

export default M.withStyles(style)(User);
