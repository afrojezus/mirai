import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import Typography from "material-ui/Typography/Typography";
import blue from "material-ui/colors/blue";
import SwipeableViews from "react-swipeable-views";
import Tab from "material-ui/Tabs/Tab";
import Tabs from "material-ui/Tabs/Tabs";
import queryString from "query-string";
import moment from "moment";
import Hidden from 'material-ui/Hidden/Hidden'
import {
  Root,
  CommandoBarTop,
  Container,
  LoadingIndicator,
  TitleHeader,
  Header,
  Column
} from "../components/layouts";
import Avatar from "material-ui/Avatar/Avatar";
import SuperComment from "../components/supercomment";

const style = theme => ({
  tabLabel: {
    opacity: 0.5,
    fontSize: 16,
    color: "white",
    textTransform: "initial"
  },
  tabLabelActive: {
    fontWeight: 700,
    fontSize: 16,
    opacity: 1,
    color: "white",
    textTransform: "initial"
  },
  tabLine: {
    filter: "drop-shadow(0 1px 12px rgba(0,0,255,.2))",
    height: 2,
    background: "white"
  },
  tab: {
    height: 64
  },
  feedTitle: {
    fontWeight: 800,
    textShadow: "0 2px 24px rgba(0,0,0,.07)",
    marginBottom: theme.spacing.unit * 3,
    zIndex: 20,
    color: "white"
  },
  infoBox: {
    display: "flex",
    marginBottom: theme.spacing.unit * 2
  },
  feedContext: {
    fontSize: theme.typography.pxToRem(16)
  },
    commandoText: {
        margin: 'auto',
        textAlign: 'center',
    },
    commandoTextBox: {
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        margin: 'auto',
    },
});

class History extends Component {
  state = {
    index: 0
  };

  componentDidMount = () => {};

  render() {
    const { classes } = this.props;
    const { index } = this.state;
    return (
      <div>
        <TitleHeader color={blue.A200} />
        <CommandoBarTop title="History">
          <Hidden smDown>
          <div className={classes.commandoTextBox} style={{marginRight: 16, marginLeft: 16}}>
            <Typography variant={'title'} className={classes.commandoText}>History</Typography>
          </div>
          </Hidden>
          <Tabs
            value={this.state.index}
            onChange={(e, val) => this.setState({ index: val })}
            indicatorClassName={classes.tabLine}
          >
            <Tab
              label="Overview"
              classes={{
                root: classes.tab,
                label:
                  this.state.index === 0
                    ? classes.tabLabelActive
                    : classes.tabLabel
              }}
            />
            <Tab
              label="Anime log"
              classes={{
                root: classes.tab,
                label:
                  this.state.index === 1
                    ? classes.tabLabelActive
                    : classes.tabLabel
              }}
            />
            <Tab
              label="Manga log"
              classes={{
                root: classes.tab,
                label:
                  this.state.index === 2
                    ? classes.tabLabelActive
                    : classes.tabLabel
              }}
            />
            <Tab
              label="User log"
              classes={{
                root: classes.tab,
                label:
                  this.state.index === 3
                    ? classes.tabLabelActive
                    : classes.tabLabel
              }}
            />
          </Tabs>
          <div style={{ flex: 1 }} />
        </CommandoBarTop>
        <Root hasTab>
          <SwipeableViews
            index={index}
            onChangeIndex={index => this.setState({ index })}
          >
            <Container>
              <Column>
                <Typography variant="display3" className={classes.feedTitle}>
                  Overview
                </Typography>
              </Column>
            </Container>
            <Container>
              <Column>
                <Typography variant="display3" className={classes.feedTitle}>
                  Anime log
                </Typography>
              </Column>
            </Container>
            <Container>
              <Column>
                <Typography variant="display3" className={classes.feedTitle}>
                  Manga log
                </Typography>
              </Column>
            </Container>
            <Container>
              <Column>
                <Typography variant="display3" className={classes.feedTitle}>
                  User log
                </Typography>
              </Column>
            </Container>
          </SwipeableViews>
        </Root>
      </div>
    );
  }
}

export default firebaseConnect()(
  connect(({ firebase: { profile } }) => ({ profile }))(
    withStyles(style)(History)
  )
);
