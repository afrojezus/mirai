// TODO: Fix every single eslint-airbnb issue
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import { firebaseConnect, firebase } from 'react-redux-firebase';
import Typography from 'material-ui/Typography/Typography';
import Divider from 'material-ui/Divider/Divider';
import {
	Root,
	CommandoBar,
	Container,
	LoadingIndicator,
	TitleHeader,
} from '../components/layouts';

const style = theme => ({
	column: {
		display: 'flex',
		flexFlow: 'column wrap',
		width: '100%',
	},
	headline: {
		marginBottom: theme.spacing.unit,
	},
	title: {
		fontWeight: 700,
		marginBottom: theme.spacing.unit * 2,
		fontSize: theme.typography.pxToRem(24),
	},
	divider: {
		marginTop: theme.spacing.unit * 3,
		marginBottom: theme.spacing.unit * 3,
	},
	paragraph: {
		fontSize: theme.typography.pxToRem(16),
	},
});

class Tos extends Component {
	componentDidMount = () => {};

	render = () => (
		<div>
			<TitleHeader title="Terms of Usage" color={"#000"} />
			<Root>
				<Container hasHeader>
					<div className={this.props.classes.column}>
						<Typography
							className={this.props.classes.headline}
							variant="headline"
						>
							{"Mirai should be used for what it's intended and only that."}
						</Typography>
						<Typography
							variant="body1"
							className={this.props.classes.paragraph}
						>
							Watching anime, reading manga, making use of the social features
							and engaging in what it has to offer is primarly the intent with
							Mirais usage. <br />
							That implies anything of pornographic nature will not be tolerated
							on this platform.
						</Typography>
						<Divider className={this.props.classes.divider} />
						<Typography
							className={this.props.classes.headline}
							variant="headline"
						>
							Mirai should not be used in conjunction with any form of threat or
							violence.
						</Typography>
						<Typography
							variant="body1"
							className={this.props.classes.paragraph}
						>
							Mirai should not be seen or used as a means of research upon
							creation of recreational harmful matter, nuclear weaponry or
							political violence.
						</Typography>
						<Divider className={this.props.classes.divider} />
						<Typography
							className={this.props.classes.headline}
							variant="headline"
						>
							Mirai is an open platform where everyone, regardless of sex,
							gender, race, ethnicity, are welcome.
						</Typography>
						<Typography
							variant="body1"
							className={this.props.classes.paragraph}
						>
							Any form of the opposite mentioned above will be observed, and the
							users behind will be restricted to further usage of the platform.
						</Typography>
						<Divider className={this.props.classes.divider} />
						<Typography
							className={this.props.classes.headline}
							variant="headline"
						>
							By using Mirai, you also agree to the option of funding it
							using blockchain technology. (Off by default.)
						</Typography>
						<Typography
							variant="body1"
							className={this.props.classes.paragraph}
						>
							This can be disabled if the user wish not to fund us this way, we
							also provide donations as alternative.<br />
							The "Contributer Module" makes an unnoticable impact on the system,
							and should not affect performance in any way.
						</Typography>
						<Divider className={this.props.classes.divider} />
					</div>
				</Container>
			</Root>
		</div>
	);
}

export default firebaseConnect()(
	connect(({ firebase: { profile } }) => ({ profile }))(withStyles(style)(Tos))
);
