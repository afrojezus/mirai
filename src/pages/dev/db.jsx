import React, { Component } from "react";
import PropTypes from 'prop-types'
import { withStyles } from "material-ui/styles";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import Typography from 'material-ui/Typography/Typography';
import SwipeableViews from 'react-swipeable-views'
import Tab from 'material-ui/Tabs/Tab';
import Tabs from 'material-ui/Tabs/Tabs';
import Grid from 'material-ui/Grid/Grid'
import Card, { CardHeader, CardContent } from 'material-ui/Card'
import JSONTree from 'react-json-tree';
import {
  Root,
  CommandoBar,
  Container,
  LoadingIndicator,
  TitleHeader,
    MainCard
} from "../../components/layouts";
import SuperTable from '../../components/supertable';
import { PeopleButton } from "../../components/cardButton";


const style = theme => ({
    tagBox: {
        marginTop: theme.spacing.unit
    },
    tagTitle: {
        fontSize: 16,
        fontWeight: 600,
        color: "white",
        textShadow: "0 2px 12px rgba(0,0,0,.17)",
        marginBottom: theme.spacing.unit
    },
    tabLabel: {
        opacity: 0.5,
        fontSize: 16,
        color: "white",
        textTransform: "initial"
    },
    tabLabelActive: {
        fontWeight: 700,
        fontSize: 16,
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
});

class DB extends Component {
    static propTypes = {
        classes: PropTypes.shape({}),
        firebase: PropTypes.shape({
            database: PropTypes.func
        }),
        history: PropTypes.shape({
            push: PropTypes.func,
            listen: PropTypes.func
        })
    };
    static defaultProps = {
        classes: style,
        firebase: null,
        history: null
    };
    state = {
        index: 0,
        collections: null,
        feeds: null,
        users: null,
        database: null,
        streams: null,
    };
  componentDidMount = () => {
      const { firebase } = this.props;

      firebase.database().ref('/').on('value', (value) => this.setState({database: value.val()}))
      firebase.database().ref('/rankings').on('value', (value) => this.setState({collections: value.val()}));
      firebase.database().ref('/social').on('value', (value) => this.setState({feeds: value.val()}));
      firebase.database().ref('/users').on('value', (value) => this.setState({users: value.val()}));

      this.listen()
  };

  listen = () => {
      switch(window.location.pathname) {
          case '/dev/db#db':
              this.setState({index: 0});
              break;
          case '/dev/db#collec':
              this.setState({index: 1});
              break;
          case '/dev/db#user':
              this.setState({index: 2});
              break;
          case '/dev/db#feed':
              this.setState({index: 3});
              break;
          case '/dev/db#live':
              this.setState({index: 4});
              break;
          default:
              break;
      }
  };

  render () {
    const { classes } = this.props;
    const {
        collections,
        users,
        feeds,
        database
    } = this.state;
    return (

      <div>
        <TitleHeader title="Developer Dashboard" color="black" subtitle="Control everything in Mirai" />
        <Root>
          <Container hasHeader>
            <MainCard>
              <CommandoBar>
                <Tabs
                  value={this.state.index}
                  onChange={(e, val) => this.setState({index: val})}
                  className={classes.contextBar}
                  indicatorClassName={classes.tabLine}
                >
                  <Tab
                    onClick={() => this.props.history.push('/dev/db#db')}
                    label="Database"
                    classes={{
    root: classes.tab,
    label:
        this.state.index === 0 ? classes.tabLabelActive : classes.tabLabel
}}
                  />
                  <Tab
                    onClick={() => this.props.history.push('/dev/db#collect')}
                    label="Collections"
                    classes={{
    root: classes.tab,
    label:
        this.state.index === 1 ? classes.tabLabelActive : classes.tabLabel
}}
                  />
                  <Tab
                    onClick={() => this.props.history.push('/dev/db#user')}
                    label="Users"
                    classes={{
                            root: classes.tab,
                            label:
                                this.state.index === 2 ? classes.tabLabelActive : classes.tabLabel
                        }}
                  />
                  <Tab
                    onClick={() => this.props.history.push('/dev/db#feed')}
                    label="Feeds"
                    classes={{
                            root: classes.tab,
                            label:
                                this.state.index === 3 ? classes.tabLabelActive : classes.tabLabel
                        }}
                  />
                  <Tab
                    onClick={() => this.props.history.push('/dev/db#live')}
                    label="Live"
                    classes={{
                            root: classes.tab,
                            label:
                                this.state.index === 4 ? classes.tabLabelActive : classes.tabLabel
                        }}
                  />
                </Tabs>
              </CommandoBar>
              <SwipeableViews index={this.state.index} onChangeIndex={(index) => this.setState({index})}>
                <div>
                  <Container>
                    {database && <JSONTree data={database} style={{fontFamily: 'SF Mono'}} />}
                  </Container>
                </div>
                <div>
                  <Container>
                    <Typography type='title'>Current collections</Typography>
                    {collections ?<SuperTable
                      data={Object.values(collections.collections)}
                      type="c"
                      typeof="ranking"
                      limit={12}
                    /> : null}
                  </Container>
                </div>
                <div>
                  <Container>
                    <Typography type='title'>Current users</Typography>
                    <Container>
                      {users && Object.values(users).map(user => <PeopleButton key={user.userID} name={{first: user.username}} image={user.avatar} onClick={() => this.props.history.push(`/user?u=${user.userID}`)}  />)}
                    </Container>
                  </Container>
                </div>
                <div>
                  <Container>
                    <Typography type='title'>Current public feeds</Typography>
                    <Container>
                      {feeds && Object.values(feeds.public_feed).map(feed => <Card key={feed.id}><CardHeader title={feed.name} subheader={`${feed.user.name} - ${feed.date}`} /><CardContent><Typography type="body1">{feed.context}</Typography></CardContent></Card>)}
                    </Container>
                  </Container>
                </div>
                <div>
                  <Container>
                    <Typography type='title'>Current streams</Typography>
                  </Container>
                </div>
                <div />
              </SwipeableViews>
            </MainCard>
          </Container>
        </Root>
      </div>
)
    ;
}
}

export default firebaseConnect()(
  connect(({ firebase: { profile } }) => ({ profile }))(withStyles(style)(DB))
);
