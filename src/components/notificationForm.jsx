import React, { Component } from 'react';
import * as Icon from 'material-ui-icons';
import { Database } from '../utils/firebase';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import Divider from 'material-ui/Divider/Divider';
import CardContent from 'material-ui/Card/CardContent';
import withStyles from 'material-ui/styles/withStyles';

const style = theme => ({
	root: {
		width: 300,
		maxHeight: 400,
		boxShadow: 'none',
		padding: 0,
	},
	formTitle: {
		fontSize: 16,
		fontWeight: 500,
	},
});

class NotificationForm extends Component {
	render = () => {
		const { classes, user } = this.props;
		return (
			<Card className={classes.root}>
				<CardHeader
					classes={{ title: classes.formTitle }}
					title="Notifications"
				/>
				<Divider />
				<CardContent />
			</Card>
		);
	};
}

export default withStyles(style)(NotificationForm);
