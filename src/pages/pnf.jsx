// TODO: Fix every single eslint-airbnb issue
import React, { Component } from 'react';
import withStyles from 'material-ui/styles/withStyles';
import ReactPlayer from 'react-player';
import { LoadingIndicator, Root, TitleHeader } from '../components/layouts';

const style = theme => ({
	awoo: {
		position: 'fixed',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		width: '100%',
		height: '100%',
		pointerEvents: 'none'
	}
});

class PageNotFound extends Component {
	state = {
		loading: true
	};

	onReady = () => this.setState({loading: false})

	render() {
		const { classes } = this.props;
		const { loading } = this.state;
		return (
  <div>
    <LoadingIndicator loading={loading} />
		<ReactPlayer className={classes.awoo} onReady={this.onReady} width={'100%'} height={'100%'} url={'https://www.youtube.com/watch?v=eGslweDOihs'} playing loop volume={0.25} />
  </div>
		);
	}
}

export default withStyles(style)(PageNotFound);
