import React, { Component } from "react";
import PropTypes from "prop-types";
// import * as Icon from "material-ui-icons";
import { grey } from 'material-ui/colors'
import moment from 'moment';
import Card, { CardHeader, CardActions } from "material-ui/Card";
import Button from "material-ui/Button/Button";
import Divider from "material-ui/Divider/Divider";
import CardContent from "material-ui/Card/CardContent";
import withStyles from "material-ui/styles/withStyles";
import Avatar from "material-ui/Avatar/Avatar";
import Typography from "material-ui/Typography/Typography";
import { connect } from "react-redux";
import { firebaseConnect, isEmpty } from "react-redux-firebase";

const types = {
  FRIEND_REQUEST: "fr",
  STREAM_INVITE: "si",
  NEW_EPISODE: "nep",
  FEED_LIKE: "feedlike",
  FEED_DISLIKE: "feeddislike",
  FEED_COMMENT: "feedcomment"
};

const style = theme => ({
  root: {
    width: 300,
    maxHeight: 400,
    boxShadow: "none",
    padding: 0
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 500
  },
    notificationCard: {
      background: grey[800]
    },
    notificationCardActions: {
      background: grey[900]
    }
});

const Notification = firebaseConnect()(
    connect(
        ({ firebase: { profile }, mir }) => ({
            profile,
            mir
        }),
        null
    )(withStyles(style)(
  class extends Component {
      // Friend request functions
      acceptFR = async () => {
          const userid = this.props.userid;
          const username = this.props.username;
          const avatar = this.props.avatar;
          const you = this.props.profile;
          const db = this.props.firebase.database().ref("/users")
              .child(this.props.profile.userID);
          const frienddb = this.props.firebase.database().ref("/users")
              .child(userid)
          const frienddbdata = await this.props.firebase.database().ref("/users")
              .child(userid).once('value');
          const notify = db.child('notifications');
          const req = db.child('requests');
          const id = this.props.id;
          if (frienddbdata) {
              const hasAccepted = await notify.child(id).update({ignored: true});
              const noMorePending = await req.child('friend').child(userid).update({pending: false});
              const addFriendOnTheirList = await frienddb.child('friends').child(you.userID).update({
                  username: you.username,
                  avatar: you.avatar,
                  userID: you.userID
              })
              const addFriendOnYourList = await db.child('friends').child(userid).update({
                  username: username,
                  avatar: avatar,
                  userID: userid
              })
          }
      }

      ignoreFR = async () => {
          const db = this.props.firebase.database().ref("/users")
              .child(this.props.profile.userID);
          const notify = db.child('notifications');
          const req = db.child('requests');
          const id = this.props.id;
          const userid = this.props.userid;

          const hasIgnored = await notify.child(id).update({ignored: true});
          const noMorePending = await req.child('friend').child(userid).remove();
      }

    render() {
      const { classes, title, date, desc, options, avatar, id, type } = this.props;
      if (type === types.FRIEND_REQUEST) {
        return (
          <Card className={classes.notificationCard}>
            <CardHeader
              title={title + ' ' + moment(date).from(Date.now())}
              subheader={desc}
              avatar={<Avatar src={avatar} />}
            />
            <CardActions className={classes.notificationCardActions}>
              {options &&
                options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={
                      option === "accept" ? this.acceptFR : this.ignoreFR
                    }
                  >
                    {option}
                  </Button>
                ))}
            </CardActions>
          </Card>
        );
      }

      return <div />;
    }
  }
)));

class NotificationForm extends Component {
  state = {
    notifications: null
  };

  componentDidMount = async () => {
      if (!isEmpty(this.props.profile)) {
          return this.props.firebase
              .database()
              .ref("/users")
              .child(this.props.profile.userID)
              .child('notifications')
              .on("value", val => this.setState({notifications: val.val()}));
      } else {
          return this.setState({notifications: null})
      }
  };

  render() {
    const { classes, profile } = this.props;
    const { notifications } = this.state;
    return (
      <Card className={classes.root}>
        <CardHeader
          classes={{ title: classes.formTitle }}
          title="Notifications"
        />
        <Divider />
        <CardContent>
          {notifications ? (
            Object.values(notifications).filter(n => !n.ignored).map((notification, index) => (
              <Notification
                key={index}
                userid={notification.userid}
                id={notification.id}
                date={notification.date}
                title={notification.title}
                desc={notification.desc}
                options={notification.options}
                avatar={notification.avatar}
                type={notification.type}
                username={notification.username}
              />
            ))
          ) : (
            <Typography variant="title">{isEmpty(this.props.profile) ? 'Sign up for notifications.' : 'No notifications for today!'}</Typography>
          )}
        </CardContent>
      </Card>
    );
  }
}

export default firebaseConnect()(
  connect(
    ({ firebase: { profile }, mir }) => ({
      profile,
      mir
    }),
    null
  )(withStyles(style)(NotificationForm))
);
