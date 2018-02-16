import React, { Component } from 'react';
import withStyles from 'material-ui/styles/withStyles';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

const style = theme => ({
	root: {
		height: '100vh',
		width: '100%',
		position: 'relative',
		top: 0,
		left: 0,
		overflow: 'hidden'
	},
});

class Watch extends Component {
	state = {};

	componentWillMount = () => {};

	componentDidMount = () => {};

	componentWillReceiveProps = nextProps => {};

	componentWillUnmount = () => {};

	render() {
		const { classes } = this.props;
		return <div id="frame" className={classes.root} />;
	}
}

export default firebaseConnect()(
	connect(({ firebase: { profile }, mir }) => ({ profile, mir }))(
		withStyles(style)(Watch)
	)
);
