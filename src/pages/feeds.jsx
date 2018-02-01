import React, { Component } from 'react';
import { Root, CommandoBar, Container, LoadingIndicator, TitleHeader } from "../components/layouts";
import { withStyles } from 'material-ui/styles'
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import Typography from 'material-ui/Typography/Typography';

const style = theme => ({

});

class Feeds extends Component {
	render = () => (
		<Root>
			<TitleHeader title={'Feeds'} />
			<Container>

			</Container>
		</Root>
	)
}

export default firebaseConnect()(
	connect(({ firebase: { profile } }) => ({ profile }))(
		withStyles(style)(Feeds)
	)
);
