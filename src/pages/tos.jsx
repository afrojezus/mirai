// TODO: Fix every single eslint-airbnb issue
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { connect } from "react-redux";
import { firebaseConnect, firebase } from "react-redux-firebase";
import Typography from "material-ui/Typography/Typography";
import Divider from "material-ui/Divider/Divider";
import checklang from "../checklang";
import strings from "../strings.json";
import {
  Root,
  CommandoBar,
  Container,
  LoadingIndicator,
  TitleHeader,
  Header
} from "../components/layouts";
import { scrollFix } from "./../utils/scrollFix";

const style = theme => ({
  column: {
    display: "flex",
    flexFlow: "column wrap",
    width: "100%"
  },
  headline: {
    marginBottom: theme.spacing.unit
  },
  title: {
    fontWeight: 700,
    marginBottom: theme.spacing.unit * 2,
    fontSize: theme.typography.pxToRem(24)
  },
  divider: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  },
  paragraph: {
    fontSize: theme.typography.pxToRem(16)
  }
});

class Tos extends Component {
  state = {
    lang: strings.enus
  };

  componentWillMount = () => {
    checklang(this);
    scrollFix();
    this.getColors();
  };

  getColors = () => {
    const hue = localStorage.getItem("user-hue");
    if (hue) {
      let hues = JSON.parse(hue);
      return this.setState({
        hue: hues.hue,
        hueVib: hues.hueVib,
        hueVibN: hues.hueVibN
      });
    } else {
      return null;
    }
  };

  componentDidMount = () => {};

  render = () => (
    <div>
      <TitleHeader
        title={this.state.lang.tos.title}
        color={this.state.hue ? this.state.hue : "#000"}
      />
      <Header color={this.state.hue ? this.state.hue : null} />
      <Root>
        <Container hasHeader>
          <div className={this.props.classes.column}>
            <Typography
              className={this.props.classes.headline}
              variant="headline"
            >
              {"Mirai should be used for what it's intended and only that."}
            </Typography>
            <Typography
              variant="body1"
              className={this.props.classes.paragraph}
            >
              Watching anime, reading manga, making use of the social features
              and engaging in what it has to offer is primarly the intent with
              Mirais usage. <br />
              That implies anything of pornographic nature will not be tolerated
              on this platform.
            </Typography>
            <Divider className={this.props.classes.divider} />
            <Typography
              className={this.props.classes.headline}
              variant="headline"
            >
              Mirai is an open platform where everyone, regardless of sex,
              gender, race, ethnicity, are welcome.
            </Typography>
            <Typography
              variant="body1"
              className={this.props.classes.paragraph}
            >
              Any form of the discrimination will be observed, and the users
              behind will be restricted to further usage of the platform.
            </Typography>
          </div>
        </Container>
      </Root>
    </div>
  );
}

export default firebaseConnect()(
  connect(({ firebase: { profile } }) => ({ profile }))(withStyles(style)(Tos))
);
