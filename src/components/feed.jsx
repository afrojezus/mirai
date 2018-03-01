import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card, {
	CardHeader,
	CardActions,
	CardContent,
	CardMedia,
} from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';

const style = theme => ({
	root: {},
});

class Feed extends Component {
	state = {
		id: 0,
	};

	render() {
		const { classes, theme } = this.props;
		return <div className={classes.root} />;
	}
}

export default withStyles(style, { withTheme: true })(Feed);
