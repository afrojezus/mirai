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
import green from "material-ui/colors/green";

const style = theme => ({});

class Live extends Component {
  render = () => (
    <div>
      <TitleHeader title="Live" color={green.A400} />
      <Header color={green[800]} />
      <Root>
        <Container hasHeader>
          <Typography type="title">What do you want to do?</Typography>
        </Container>
      </Root>
    </div>
  );
}

export default firebaseConnect()(
  connect(({ firebase: { profile } }) => ({ profile }))(withStyles(style)(Live))
);
