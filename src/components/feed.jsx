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
import CircularProgress from "material-ui/Progress/CircularProgress";
import { history } from "../store";
import Hidden from "material-ui/Hidden";
import { Dialogue } from "./layouts";

const feedWidth = "100%";
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
    // background: '#fafafa',
    border: "1px solid rgba(255,255,255,.1)"
  },
  cardcontent: {
    boxSizing: "border-box",
    padding: theme.spacing.unit * 2
  },
  cardheader: {},
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
    padding: 0,
    position: "relative",
    bottom: 0,
    boxSizing: "border-box",
    maxHeight: 0,
    transition: theme.transitions.create(["all"]),
    opacity: 0
  },
  cardactionsActive: {
    maxHeight: 64,
    padding: theme.spacing.unit,
    transition: theme.transitions.create(["all"]),
    opacity: 1
  },
  cardactionsF: {
    padding: theme.spacing.unit,
    position: "relative",
    bottom: 0,
    boxSizing: "border-box",
    opacity: 1,
    [theme.breakpoints.down("sm")]: {
      justifyContent: "space-around"
    }
  },
  headerAva: {
    cursor: "pointer"
  },
  media: {
    transition: theme.transitions.create(["all"]),
    minHeight: 300,
    maxHeight: 700,
    borderBottom: "1px solid rgba(255,255,255,.1)"
  },
  mediaF: {
    transition: theme.transitions.create(["all"]),
    height: 200,
    width: "100%",
    objectFit: "cover"
  },
  cardaction: {
    margin: "auto"
  },
  text: {
    // color: '#111'
  },
  divider: {
    // background: 'rgba(0,0,0,.1)'
  },
  headerTitle: {
    // color: '#111'
  },
  subheader: {
    // color: 'rgba(0,0,0,.7)'
  },
  activityImage: {
    width: 60,
    maxHeight: 80,
    objectFit: "cover",
    borderBottomLeftRadius: 1,
    borderTopLeftRadius: 1,
    cursor: "pointer"
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
          avatar: "",
          uploadingImage: false,
          error: false
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

        setImage = e => {
          return this.imageInput.click();
        };

        getImage = e => {
          const form = new FormData();
          if (this.imageInput.files.length === 0) {
            return false;
          }

          form.append("files[]", this.imageInput.files[0]);
          return this.setState({ uploadingImage: true }, async () => {
            try {
              const loli = await fetch("https://mixtape.moe/upload.php", {
                method: "POST",
                body: form
              });
              const loliJson = await loli.json();
              return this.setState({
                image: loliJson.files[0].url,
                uploadingImage: false
              });
            } catch (error) {
              console.error(error);
              return this.setState({ error: true }, () =>
                setTimeout(() => this.setState({ error: false }), 3000)
              );
            }
          });
        };

        postFeed = async () => {
          const you = this.props.profile;
          const db = this.props.firebase
            .database()
            .ref("/social")
            .child("byusers");
          const { title, context, text, image, date } = this.state;
          try {
            if (text === "" || null) {
              return new Error("You didn't write anything...");
            }
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
              .then(() => this.setState({ text: "", image: "" }));
          } catch (error) {
            return console.error(error);
          }
        };

        render() {
          const { classes, profile, theme, color } = this.props;
          const {
            text,
            context,
            title,
            image,
            date,
            avatar,
            uploadingImage
          } = this.state;
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
              <Card
                className={classes.card}
                style={{
                  minHeight: "inherit",
                  background: color ? color : null
                }}
                elevation={3}
              >
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
                {text ? <Divider className={classes.divider} /> : null}
                {image !== "" ? (
                  <img
                    className={classes.mediaF}
                    alt=""
                    style={{ minHeight: 200 }}
                    ref={image => (this.image = image)}
                    src={image}
                  />
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
                    onChange={e => {
                      let val = e.target.value;
                      this.setState(
                        { text: val },
                        () => (val === "" ? this.setState({ image: "" }) : null)
                      );
                    }}
                  />
                </CardContent>
                {text ? <Divider className={classes.divider} /> : null}
                <CardActions
                  className={classnames(
                    classes.cardactions,
                    text ? classes.cardactionsActive : null
                  )}
                >
                  <form>
                    <label>
                      <input
                        accept="image/*"
                        type="file"
                        name="files[]"
                        onChange={e => this.getImage(e)}
                        className="hiddenfileinput"
                        ref={imageInput => (this.imageInput = imageInput)}
                      />
                      <Tooltip
                        title={
                          window.safari
                            ? "Currently issues with image upload on Safari, sorry."
                            : "Upload an image"
                        }
                      >
                        <div>
                          <IconButton
                            disabled={window.safari ? true : uploadingImage}
                            classes={{ label: classes.text }}
                            type="button"
                            onClick={this.setImage}
                          >
                            {uploadingImage ? (
                              <CircularProgress />
                            ) : (
                              <ICON.Image />
                            )}
                          </IconButton>
                        </div>
                      </Tooltip>
                    </label>
                  </form>
                  {image ? (
                    <Button
                      classes={{ label: classes.text }}
                      onClick={() => this.setState({ image: "" })}
                    >
                      Remove image
                    </Button>
                  ) : null}
                  <div style={{ flex: 1 }} />
                  {text ? (
                    <Button
                      classes={{ label: classes.text }}
                      onClick={this.postFeed}
                    >
                      Post
                    </Button>
                  ) : null}
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
          theme: PropTypes.object.isRequired
        };

        static defaultProps = {
          ftitle: "Feed",
          context: "Feed context",
          text: "Feed text",
          image: "",
          date: 0,
          avatar: "",
          user: null
        };

        state = {
          id: this.props.id,
          ftitle: this.props.ftitle,
          context: this.props.context,
          text: this.props.text,
          image: this.props.image,
          date: this.props.date,
          avatar: this.props.avatar,
          user: this.props.user,
          showComments: false
        };

        componentWillMount = () => {};

        deleteOwnFeed = async () => {
          const db = this.props.firebase
            .database()
            .ref("/social")
            .child("byusers")
            .child(this.props.id);
          try {
            return await db.remove();
          } catch (error) {
            return console.error(error);
          }
        };

        deleteOwnActivity = async () => {
          const db = this.props.firebase
            .database()
            .ref("/social")
            .child("byusers")
            .child(this.props.id);
          try {
            return await db.remove();
          } catch (error) {
            return console.error(error);
          }
        };

        likeThis = async () => {
          const db = this.props.firebase
            .database()
            .ref("/social")
            .child("byusers")
            .child(this.props.id)
            .child("likes")
            .child(this.props.profile.userID);
          try {
            return await db.update({ like: true });
          } catch (error) {
            return console.error(error);
          }
        };

        disLikeThis = async () => {
          const db = this.props.firebase
            .database()
            .ref("/social")
            .child("byusers")
            .child(this.props.id)
            .child("likes")
            .child(this.props.profile.userID);
          try {
            return await db.remove();
          } catch (error) {
            return console.error(error);
          }
        };

        showComments = () => this.setState({ showComments: true });

        hideComments = () => this.setState({ showComments: false });

        repostThis = async () => {
          console.info("[mirai] This feature is yet to be added!");
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
            noDelete,
            mirUpdate,
            color,
            activity,
            ftitle,
            id,
            context,
            text,
            image,
            date,
            avatar,
            user,
            showId,
            style,
            likes,
            comments
          } = this.props;
          const { showComments } = this.state;
          return (
            <Grid item xs className={classes.root} style={style}>
              <Dialogue
                zoom
                open={showComments}
                onClose={this.hideComments}
                feed={{
                  ftitle,
                  image,
                  text,
                  context,
                  user,
                  avatar,
                  date,
                  color,
                  id
                }}
              />
              <FadeIn>
                <Card
                  style={{ background: color ? color : null }}
                  className={classes.card}
                >
                  <div style={{ display: activity ? "flex" : null }}>
                    {activity ? (
                      <img
                        onClick={() =>
                          activity ? history.push(`/show?s=${showId}`) : null
                        }
                        src={image}
                        alt=""
                        className={classes.activityImage}
                      />
                    ) : null}
                    <div style={{ flex: activity ? 1 : null }}>
                      {noHeader ? null : (
                        <CardHeader
                          title={
                            activity
                              ? ftitle + " | " + moment(date).from(Date.now())
                              : ftitle
                          }
                          avatar={
                            <Avatar
                              onClick={() =>
                                !mirUpdate || !context.includes("INTRO")
                                  ? history.push(`/user?u=${user.id}`)
                                  : null
                              }
                              src={avatar}
                            />
                          }
                          subheader={
                            activity
                              ? context
                              : context + " | " + moment(date).from(Date.now())
                          }
                          className={classes.cardheader}
                          classes={{
                            avatar: classes.headerAva,
                            title: classes.headerTitle,
                            subheader: classes.subheader,
                            action: classes.cardaction
                          }}
                          action={
                            activity ? null : isEmpty(
                              profile
                            ) ? null : mirUpdate ? null : noDelete ? null : user &&
                            user.id === profile.userID ? (
                              <IconButton
                                classes={{ label: classes.text }}
                                onClick={
                                  activity
                                    ? this.deleteOwnActivity
                                    : this.deleteOwnFeed
                                }
                              >
                                <ICON.Close />
                              </IconButton>
                            ) : null
                          }
                        />
                      )}
                      {activity ? null : (
                        <Divider className={classes.divider} />
                      )}
                      {activity ? null : image ? (
                        <CardMedia className={classes.media} image={image} />
                      ) : null}
                      {activity ? null : (
                        <CardContent className={classes.cardcontent}>
                          <Typography
                            className={classes.text}
                            variant="body1"
                            dangerouslySetInnerHTML={{ __html: text }}
                          />
                        </CardContent>
                      )}

                      {noActions ? null : (
                        <Divider className={classes.divider} />
                      )}
                      {noActions ? null : (
                        <CardActions className={classes.cardactionsF}>
                          <Hidden smDown>
                            <div style={{ flex: 1 }} />
                          </Hidden>
                          <Tooltip
                            title={
                              isEmpty(profile)
                                ? "You need to login to like posts"
                                : likes && likes[profile.userID]
                                  ? "Dislike this"
                                  : "Like this"
                            }
                            placement="bottom"
                          >
                            <div>
                              <IconButton
                                disabled={isEmpty(profile) ? true : false}
                                classes={{ label: classes.text }}
                                onClick={async () =>
                                  likes && likes[profile.userID]
                                    ? this.disLikeThis()
                                    : this.likeThis()
                                }
                              >
                                {likes && likes[profile.userID] ? (
                                  <ICON.Favorite />
                                ) : (
                                  <ICON.FavoriteBorder />
                                )}
                              </IconButton>
                            </div>
                          </Tooltip>
                          <Tooltip title={"Show comments"} placement="bottom">
                            <div>
                              <IconButton
                                classes={{ label: classes.text }}
                                onClick={this.showComments}
                              >
                                <ICON.Comment />
                              </IconButton>
                            </div>
                          </Tooltip>
                          {user && user.id === profile.userID ? null : (
                            <Tooltip
                              title={
                                isEmpty(profile)
                                  ? "You need to login to repost posts"
                                  : "Repost this"
                              }
                              placement="bottom"
                            >
                              <div>
                                <IconButton
                                  disabled={isEmpty(profile) ? true : false}
                                  classes={{ label: classes.text }}
                                  onClick={this.repostFeed}
                                >
                                  <ICON.Share />
                                </IconButton>
                              </div>
                            </Tooltip>
                          )}
                        </CardActions>
                      )}
                    </div>
                  </div>
                </Card>
              </FadeIn>
            </Grid>
          );
        }
      }
    )
  )
);
