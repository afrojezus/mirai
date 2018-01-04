import React, { Component } from "react";
import * as M from "material-ui";
import * as Icon from "material-ui-icons";
import { Database } from "../utils/firebase";

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

class NotificationForm extends Component {
  render = () => {
    const { classes, user } = this.props;
    return (
      <M.Card className={classes.root}>
        <M.CardHeader
          classes={{ title: classes.formTitle }}
          title="Notifications"
        />
        <M.Divider />
        <M.CardContent />
      </M.Card>
    );
  };
}

export default M.withStyles(style)(NotificationForm);
