// TODO: Fix every single eslint-airbnb issue
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import Typography from 'material-ui/Typography/Typography';
import orange from 'material-ui/colors/orange';
import Supertable from '../components/supertable';
import {
	Root,
	CommandoBar,
	Container,
	LoadingIndicator,
	TitleHeader,
	Header
} from '../components/layouts';

const style = theme => ({});

class Rankings extends Component {
	state = {
		loading: true
	};

	componentDidMount = () => {};

	render = () => (
  <div>
    <TitleHeader title="Rankings" color={orange.A400} />
    <Header color={orange[800]} />
    <Root>
      <LoadingIndicator loading={this.state.loading} />
      <Container hasHeader style={this.state.loading ? { opacity: 0 } : null}>
        <Typography type="title">Top 10 animes</Typography>
        <Supertable data={[]} type="s" typeof="rankings" limit={8} />
      </Container>
    </Root>
  </div>
	);
}

export default firebaseConnect()(
	connect(({ firebase: { profile } }) => ({ profile }))(
		withStyles(style)(Rankings)
	)
);
