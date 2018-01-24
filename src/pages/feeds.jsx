import React, { Component } from 'react';
import * as M from 'material-ui';
import * as Icon from 'material-ui-icons';
import Aqua2 from '../assets/aqua2.mp4';

import { firebaseConnect } from 'react-redux-firebase';
import { LoadingIndicator, Container, Root } from '../components/layouts';

const specialColor = M.colors.red.A700;

const styles = theme => ({

});

class Feeds extends Component {
	state = {
		feeds: null,
		anchorEl: null,
		es: false,
		loading: true,
		ongoing: null,
		rankingMentionable: null,
	};

	componentDidMount = async () => {
		//this.makeTitlebarColored();
		this.feedsObserve().then(() =>
			setTimeout(() => this.setState({ loading: false }), 300)
		);
	};

	feedsObserve = async () =>
		this.props.firebase
			.ref('social')
			.child('public_feed')
			.on('value', feed => this.setState({ feeds: Object.values(feed.val()) }));

	makeTitlebarColored = () => {
		let superbar = document.getElementById('superBar');
		if (superbar) {
			superbar.style.background = specialColor;
			superbar.style.boxShadow = 'none';
		}
	};

	componentWillUnmount = () => { };
	render() {
		const { classes, user, history, meta } = this.props;
		const { publicfeed, loading } = this.state;
		return (
			<div>
				<LoadingIndicator
					loading={loading}
				/>
				<div className={classes.frame} style={loading ? { opacity: 0 } : null}>
					<Root>
						<Container
							container
							spacing={0}

						/>
					</Root>
				</div>
			</div>
		);
	}
}

export default firebaseConnect()(M.withStyles(styles)(Feeds));
