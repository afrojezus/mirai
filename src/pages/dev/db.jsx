import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import {
  Root,
  CommandoBar,
  Container,
  LoadingIndicator,
  TitleHeader
} from "../../components/layouts";

const style = theme => ({});

class DB extends Component {
  componentDidMount = () => {};

  render = () => (
    <div>
      <TitleHeader title="Developer Dashboard" color="black" />
      <Root>
        <Container hasHeader />
      </Root>
    </div>
  );
}

export default firebaseConnect()(
  connect(({ firebase: { profile } }) => ({ profile }))(withStyles(style)(DB))
);
