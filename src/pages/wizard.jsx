import React, { Component } from "react";
import localForage from "localforage";
import Grid from "material-ui/Grid";
import { withStyles } from "material-ui/styles";

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 8
  }
});

class Wizard extends Component {
  state = {
    data: {}
  };
  render() {
    const { classes } = this.props;
    return <div className={classes.root} />;
  }
}

export default withStyles(styles)(Wizard);
