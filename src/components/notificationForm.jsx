import React, { Component } from "react";
import PropTypes from "prop-types";
// import * as Icon from "material-ui-icons";
import Card, { CardHeader, CardActions } from "material-ui/Card/Card";
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
  }
});

const Notification = withStyles(style)(
  class extends Component {
    render() {
      const { classes, title, date, desc, options, avatar, type } = this.props;
      if (type === types.FRIEND_REQUEST) {
        return (
          <Card>
            <CardHeader
              title={title}
              subtitle={desc}
              avatar={<Avatar src={avatar} />}
            />
            <CardActions>
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
);

class NotificationForm extends Component {
  state = {
    notifications: null
  };

  componentDidMount = () => {
    if (isEmpty(this.props.profile)) {
      return null;
    }
    return this.props.firebase
      .database()
      .ref("/users")
      .child(this.props.profile.userID)
      .child("notifications")
      .on("value", val => this.setState({ notifications: val.val() }));
  };

  componentDidCatch = (error, info) => {
    return console.error(error, info);
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
            Object.values(notifications).map((notification, index) => (
              <Notification
                key={index}
                id={notification.id}
                date={notification.date}
                title={notification.title}
                desc={notification.desc}
                options={notification.options}
                avatar={notification.avatar}
                type={notification.type}
              />
            ))
          ) : (
            <Typography variant="title">No notifications for today!</Typography>
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
