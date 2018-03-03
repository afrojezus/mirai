import React, { Component } from "react";
import PropTypes from "prop-types";
import * as ICON from "material-ui-icons";
import Card, {
  CardHeader,
  CardActions,
  CardContent,
  CardMedia
} from "material-ui/Card";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import Divider from "material-ui/Divider";
import { firebaseConnect, isEmpty } from "react-redux-firebase";
import { connect } from "react-redux";
import moment from "moment";
import classnames from "classnames";
import Avatar from "material-ui/Avatar";
import FadeIn from "react-fade-in";
import IconButton from "material-ui/IconButton";
import { guid } from "../utils/uuid";
import Tooltip from "material-ui/Tooltip/Tooltip";

const feedWidth = 450;
const feedHeight = 60;

const style = theme => ({
  root: {
    maxWidth: feedWidth,
    padding: theme.spacing.unit,
    boxSizing: "border-box",
    [theme.breakpoints.down("md")]: {
      maxWidth: "initial"
    }
  },
  card: {
    boxSizing: "border-box",
    padding: theme.spacing.unit
  },
  feedMaker: {
    maxWidth: feedWidth,
    padding: theme.spacing.unit,
    boxSizing: "border-box",
    transition: theme.transitions.create(["all"]),
    [theme.breakpoints.down("md")]: {
      maxWidth: "initial"
    },
    animation: "fadeIn 0.5s ease"
  },
  feedMakerActive: {
    maxWidth: feedWidth * 2 / 1.5,
    transition: theme.transitions.create(["all"]),
    [theme.breakpoints.down("md")]: {
      maxWidth: "initial"
    }
  },
  feedmakerTextField: {
    padding: theme.spacing.unit,
    boxSizing: "border-box"
  },
  feedmakerTextFieldActive: {
    fontSize: theme.typography.pxToRem(24)
  },
  button: {
    flex: 1
  },
  cardactions: {
    position: "relative",
    bottom: 0
  }
});

export const FeedMaker = firebaseConnect()(
  connect(({ firebase: { profile }, ...state }) => ({ profile, ...state }))(
    withStyles(style, { withTheme: true })(
      class extends Component {
        static propTypes = {
          classes: PropTypes.object.isRequired
        };

        state = {
          text: "",
          context: "STATUS",
          title: "",
          image: "",
          date: Date.now(),
          avatar: ""
        };

        componentDidMount = () => {
          const { id, image, date } = this.state;
          if (id) {
            this.setState({ id });
          }
          if (image) {
            this.setState({ image });
          }
          if (date) {
            this.setState({ date });
          }
        };

        setImage = async () => {};

        postFeed = async () => {
          const you = this.props.profile;
          const db = this.props.firebase
            .database()
            .ref("/social")
            .child("byusers");
          const { title, context, text, image, date } = this.state;
          try {
            const id = guid();
            return await db
              .child(id)
              .update({
                title,
                context,
                text,
                image,
                date,
                user: {
                  username: you.username,
                  avatar: you.avatar,
                  id: you.userID
                },
                id,
                repost: false
              })
              .then(() => this.setState({ text: "" }));
          } catch (error) {
            return console.error(error);
          }
        };

        render() {
          const { classes, profile, theme } = this.props;
          const { text, context, title, image, date, avatar } = this.state;
          if (isEmpty(profile)) return null;
          return (
            <Grid
              item
              xs
              className={classnames(
                classes.feedMaker,
                text ? classes.feedMakerActive : null
              )}
            >
              <Card style={{ minHeight: "inherit" }} elevation={3}>
                {text ? (
                  <FadeIn>
                    <CardHeader
                      title={profile.username}
                      avatar={<Avatar src={profile.avatar} />}
                      subheader={
                        context + " | " + moment(date).from(Date.now())
                      }
                      classes={{
                        avatar: classes.headerAva,
                        title: classes.headerTitle,
                        subheader: classes.subheader
                      }}
                    />
                  </FadeIn>
                ) : null}
                <CardContent className={classes.cardcontent}>
                  <TextField
                    className={classnames(
                      classes.feedmakerTextField,
                      text ? classes.feedmakerTextFieldActive : null
                    )}
                    value={text}
                    multiline
                    InputProps={{
                      disableUnderline: true,
                      style: { fontSize: text && text.length < 50 ? 24 : null }
                    }}
                    placeholder="What's on your mind today?"
                    fullWidth
                    onChange={e => this.setState({ text: e.target.value })}
                  />
                </CardContent>
                <Divider />
                <CardActions className={classes.cardactions}>
                  <IconButton onClick={this.setImage}>
                    <ICON.Image />
                  </IconButton>
                  <div style={{ flex: 1 }} />
                  <Button onClick={this.postFeed}>Post</Button>
                </CardActions>
              </Card>
            </Grid>
          );
        }
      }
    )
  )
);

export const Feed = firebaseConnect()(
  connect(({ firebase: { profile }, ...state }) => ({ profile, ...state }))(
    withStyles(style, { withTheme: true })(
      class extends Component {
        static propTypes = {
          classes: PropTypes.object.isRequired,
          theme: PropTypes.object.isRequired,
          title: PropTypes.string,
          context: PropTypes.string,
          id: PropTypes.string.isRequired,
          text: PropTypes.string,
          image: PropTypes.string,
          date: PropTypes.number,
          avatar: PropTypes.string,
          user: PropTypes.object
        };

        static defaultProps = {
          title: "Feed",
          context: "Feed context",
          text: "Feed text",
          image: "",
          date: 0,
          avatar: "",
          user: null
        };

        state = {
          id: this.props.id,
          title: this.props.title,
          context: this.props.context,
          text: this.props.text,
          image: this.props.image,
          date: this.props.date,
          avatar: this.props.avatar,
          user: this.props.user
        };

        componentWillMount = () => {};

        componentDidMount = () => {
          const {
            title,
            context,
            id,
            text,
            image,
            date,
            avatar,
            user
          } = this.props;
          if (title) {
            return this.setState({ title });
          }
          if (context) {
            return this.setState({ context });
          }
          if (id) {
            return this.setState({ id });
          }
          if (text) {
            return this.setState({ text });
          }
          if (image) {
            return this.setState({ image });
          }
          if (date) {
            return this.setState({ date });
          }
          if (avatar) {
            return this.setState({ avatar });
          }
          if (user) {
            return this.setState({ user });
          }
          return null;
        };

        componentWillReceiveProps = nextProps => {
          const {
            title,
            context,
            id,
            text,
            image,
            date,
            avatar,
            user
          } = nextProps;
          if (title) {
            return this.setState({ title });
          }
          if (context) {
            return this.setState({ context });
          }
          if (id) {
            return this.setState({ id });
          }
          if (text) {
            return this.setState({ text });
          }
          if (image) {
            return this.setState({ image });
          }
          if (date) {
            return this.setState({ date });
          }
          if (avatar) {
            return this.setState({ avatar });
          }
          if (user) {
            return this.setState({ user });
          }
          return null;
        };

        deleteOwnFeed = async () => {
          const db = this.props.firebase
            .database()
            .ref("/social")
            .child("byusers")
            .child(this.state.id);
          try {
            return await db.remove();
          } catch (error) {
            return console.error(error);
          }
        };

        render() {
          const {
            classes,
            theme,
            profile,
            onClick,
            commentClick,
            noActions,
            noHeader,
            ...props
          } = this.props;
          const {
            title,
            id,
            context,
            text,
            image,
            date,
            avatar,
            user
          } = this.state;
          return (
            <Grid item xs className={classes.root} {...props}>
              <FadeIn>
                <Card className={classes.card}>
                  {noHeader ? null : (
                    <CardHeader
                      title={title}
                      avatar={<Avatar src={avatar} />}
                      subheader={
                        context + " | " + moment(date).from(Date.now())
                      }
                      classes={{
                        avatar: classes.headerAva,
                        title: classes.headerTitle,
                        subheader: classes.subheader
                      }}
                      action={
                        (user && user.id === profile.userID) ||
                        profile.role === "admin" ||
                        "dev" ? (
                          <IconButton onClick={this.deleteOwnFeed}>
                            <ICON.Close />
                          </IconButton>
                        ) : null
                      }
                    />
                  )}
                  {image ? <CardMedia image={image} /> : null}
                  <CardContent className={classes.cardcontent}>
                    <Typography
                      className={classes.text}
                      variant="body1"
                      dangerouslySetInnerHTML={{ __html: text }}
                    />
                  </CardContent>
                  {noActions ? null : (
                    <CardActions className={classes.cardactions}>
                      <div style={{ flex: 1 }} />
                      <Tooltip title="Mood" placement="bottom">
                        <IconButton onMouseOver={this.showMoods}>
                          <ICON.Face />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Comments" placement="bottom">
                        <IconButton onClick={commentClick}>
                          <ICON.Comment />
                        </IconButton>
                      </Tooltip>
                      {user && user.id === profile.userID ? null : (
                        <Tooltip title="Repost this" placement="bottom">
                          <IconButton onClick={this.repostFeed}>
                            <ICON.Share />
                          </IconButton>
                        </Tooltip>
                      )}
                    </CardActions>
                  )}
                </Card>
              </FadeIn>
            </Grid>
          );
        }
      }
    )
  )
);
