// TODO: Fix every single eslint-airbnb issue
import React, { Component } from "react";
import {
  Root,
  CommandoBar,
  Container,
  LoadingIndicator,
  TitleHeader,
  Header
} from "../components/layouts";
import { withStyles } from "material-ui/styles";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import Typography from "material-ui/Typography/Typography";
import blue from "material-ui/colors/blue";

const style = theme => ({});

class Feeds extends Component {
  render = () => (
    <div>
      <TitleHeader title="Feeds" color={blue.A700} />
      <Header color={blue[800]} />
      <Root>
        <Container />
      </Root>
    </div>
  );
}

export default firebaseConnect()(
  connect(({ firebase: { profile } }) => ({ profile }))(
    withStyles(style)(Feeds)
  )
);
