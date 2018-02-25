import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import Typography from "material-ui/Typography/Typography";
import green from "material-ui/colors/green";
import grey from "material-ui/colors/grey";
import SwipeableViews from "react-swipeable-views";
import Tab from "material-ui/Tabs/Tab";
import Tabs from "material-ui/Tabs/Tabs";
import SuperTable from "../components/supertable";
import Button from "material-ui/Button/Button";
import AddIcon from "material-ui-icons/Add";
import Hidden from "material-ui/Hidden/Hidden";
import checklang from "../checklang";
import strings from "../strings.json";
import {
  Root,
  CommandoBar,
  Container,
  LoadingIndicator,
  TitleHeader,
  Header,
  CommandoBarTop,
  Column,
  Dialogue
} from "../components/layouts";
import CardButton from "../components/cardButton";

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
  fabContainer: {
    transition: theme.transitions.create(["all"]),
    zIndex: 10000
  },
  fabPlayButton: {
    position: "fixed",
    bottom: theme.spacing.unit * 4,
    right: theme.spacing.unit * 4,
    zIndex: 10000,
    transform: "translateZ(0)"
  },
  fabProgress: {
    color: "white",
    zIndex: 10001,
    transition: theme.transitions.create(["all"])
  },
  fabWrapper: {
    transition: theme.transitions.create(["all"]),
    margin: theme.spacing.unit,
    position: "relative",
    zIndex: 10000
  }
});

class Live extends Component {
  state = {
    loading: true,
    index: 0,
    streams: null,
    streamModal: false,
    lang: strings.enus
  };

  componentWillMount = () => {
    checklang(this);
  };

  componentDidMount = () => {
    this.props.firebase
      .database()
      .ref("/streams")
      .on("value", value =>
        this.setState({ streams: value.val() }, () =>
          this.setState({ loading: false })
        )
      );
  };

  showHelp = () => this.setState({ streamModal: !this.state.streamModal });

  render() {
    const { classes } = this.props;
    const { index, streams, streamModal, lang } = this.state;
    return (
      <div>
        <LoadingIndicator loading={this.state.loading} />
        <TitleHeader color={grey.A700} />
        <Header color={grey[900]} />
        <div id="fabShowButton" className={classes.fabContainer}>
          <Button
            color="primary"
            className={classes.fabPlayButton}
            variant={"fab"}
            onClick={this.showHelp}
          >
            <AddIcon />
          </Button>
        </div>
        <Dialogue
          aria-labelledby="stream-modal"
          aria-describedby="stream"
          open={streamModal}
          onClose={() => this.setState({ streamModal: false })}
          title={lang.live.streamHelp.title}
        />
        <CommandoBarTop title="Live">
          <Hidden smDown>
            <div style={{ flex: 1 }} />
          </Hidden>
          <Tabs
            value={this.state.index}
            onChange={(e, val) => this.setState({ index: val })}
            indicatorClassName={classes.tabLine}
            centered
            fullWidth
          >
            <Tab
              label="Streams"
              classes={{
                root: classes.tab,
                label:
                  this.state.index === 0
                    ? classes.tabLabelActive
                    : classes.tabLabel
              }}
            />
            <Tab
              label="Friends"
              classes={{
                root: classes.tab,
                label:
                  this.state.index === 1
                    ? classes.tabLabelActive
                    : classes.tabLabel
              }}
            />
            <Tab
              label="Live TV"
              classes={{
                root: classes.tab,
                label:
                  this.state.index === 2
                    ? classes.tabLabelActive
                    : classes.tabLabel
              }}
            />
          </Tabs>
          <Hidden smDown>
            <div style={{ flex: 1 }} />
          </Hidden>
        </CommandoBarTop>
        <Root hasTab>
          <SwipeableViews
            index={index}
            onChangeIndex={index => this.setState({ index })}
          >
            <Container>
              <Column>
                <Typography variant="display3" className={classes.feedTitle}>
                  Streams
                </Typography>
                <Container>
                  {streams &&
                    Object.values(streams)
                      .filter(u => u.id !== "example")
                      .map((stream, index) => (
                        <CardButton
                          key={index}
                          onClick={() =>
                            this.props.history.push(`/stream?s=${stream.id}`)
                          }
                          image={stream.cover}
                          title={stream.title}
                          subtitle={stream.hoster + "'s stream"}
                        />
                      ))}
                </Container>
              </Column>
            </Container>
            <Container>
              <Column>
                <Typography variant="display3" className={classes.feedTitle}>
                  Friends streams
                </Typography>
              </Column>
            </Container>
            <Container>
              <Column>
                <Typography variant="display3" className={classes.feedTitle}>
                  Live TV
                </Typography>
              </Column>
            </Container>
            <Container>
              <Column />
            </Container>
          </SwipeableViews>
        </Root>
      </div>
    );
  }
}

export default firebaseConnect()(
  connect(({ firebase: { profile } }) => ({ profile }))(withStyles(style)(Live))
);
