import Typography from "material-ui/Typography";
import React, { Component } from "react";
import withStyles from "material-ui/styles/withStyles";
import Grid from "material-ui/Grid";
import miraiIcon from "../assets/mirai-icon.png";
import Card, { CardContent, CardActions } from "material-ui/Card";
import { grey } from "material-ui/colors";
import Divider from "material-ui/Divider";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";

import { Auth, Database } from "../utils/firebase";

import ripple from "../assets/Ripple.mp4";

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 8
  },
  divider: {
    width: "100%"
  },
  spacing: {
    flex: 1
  },
  container: {
    marginLeft: "auto",
    marginRight: "auto",
    padding: 24,
    maxWidth: 1200,
    flexDirection: "column"
  },
  title: {
    margin: "auto",
    paddingBottom: 24
  },
  formTitle: {
    fontSize: 14,
    textTransform: "uppercase",
    margin: "auto",
    paddingBottom: 12
  },
  loginForm: {
    maxHeight: 300,
    minWidth: 400,
    margin: "auto",
    background: grey[800],
    border: "2px solid rgba(255,0,0,0)",
    transition: theme.transitions.create(["border"])
  },
  textField: {
    width: "100%",
    marginBottom: 12
  },
  ripple: {
    position: "absolute",
    height: "100%",
    width: "100%",
    pointerEvents: "none",
    overflow: "hidden",
    objectFit: "cover",
    opacity: 0.1,
    filter: "hue-rotate(310deg)"
  },
  ripplecon: {
    position: "fixed",
    overflow: "hidden",
    height: "100vh",
    width: "100%",
    pointerEvents: "none",
    zIndex: -2
  }
});

class Setup extends Component {
  state = {
    mode: "login",
    email: "",
    password: "",
    error: ""
  };

  toggleLoginMode = () =>
    this.setState({
      mode: this.state.mode.includes("login") ? "signup" : "login"
    });

  login = () =>
    Auth.signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => this.props.history.push("/"))
      .catch(error =>
        this.setState({ error: error.message }, () =>
          setTimeout(() => {
            this.setState({ error: "" });
          }, 2000)
        )
      );

  signup = () =>
    Auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() =>
        Database.ref("users")
          .child(Auth.currentUser.uid)
          .update({
            username: `Mirai User ${Auth.currentUser.uid}`,
            headers: "",
            avatar:
              "https://firebasestorage.googleapis.com/v0/b/yura-a8e86.appspot.com/o/userData%2Favatar%2Fstock%2Fmirai-icon.png?alt=media&token=56972279-adea-4ad9-a79e-6aa6a964bf61",
            nick: "Hi, I'm new here",
            motto: "",
            email: Auth.currentUser.email,
            userID: Auth.currentUser.uid
          })
          .then(() => this.props.history.push("/wizard"))
      )
      .catch(error =>
        this.setState({ error: error.message }, () =>
          setTimeout(() => {
            this.setState({ error: "" });
          }, 2000)
        )
      );

  render() {
    const { classes } = this.props;
    const { mode, error } = this.state;
    return (
      <div className={classes.root}>
        <div className={this.props.classes.ripplecon}>
          <video
            src={ripple}
            className={this.props.classes.ripple}
            autoPlay
            muted
            loop
          />
        </div>
        <Grid container spacing={0} className={classes.container}>
          <img src={miraiIcon} className="floatingIconMirai" alt="" />
          <Typography type="title" className={classes.title}>
            {mode.includes("login")
              ? "Welcome back, we've been missing you from Mirai."
              : "Enter Mirai. Time to get started."}
          </Typography>
          <Card
            className={classes.loginForm}
            style={error !== "" ? { borderColor: "rgba(255,0,0,.7)" } : null}
          >
            <CardContent>
              <Typography type="title" className={classes.formTitle}>
                {error !== ""
                  ? error
                  : mode.includes("login") ? "Login" : "Sign up"}
              </Typography>
              <form>
                <TextField
                  autoFocus
                  onChange={e => this.setState({ email: e.target.value })}
                  label="Email"
                  className={classes.textField}
                  type="email"
                  autoComplete="username"
                />
                <TextField
                  onChange={e => this.setState({ password: e.target.value })}
                  label="Password"
                  className={classes.textField}
                  type="password"
                  autoComplete="current-password"
                />
              </form>
              <div className={classes.spacing} />
            </CardContent>
            <Divider className={classes.divider} />
            <CardActions>
              <Button color="contrast" onClick={this.toggleLoginMode}>
                {mode.includes("login") ? "Sign up" : "Sign in"}
              </Button>
              <div className={classes.divider} />
              {mode.includes("login") ? (
                <Button color="primary" onClick={this.login}>
                  Access
                </Button>
              ) : (
                <Button color="primary" onClick={this.signup}>
                  Dive in
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Setup);
