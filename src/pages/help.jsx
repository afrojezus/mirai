// TODO: Fix every single eslint-airbnb issue
import React, { Component } from 'react';
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
	TitleHeader
} from '../components/layouts';

const style = theme => ({
	column: {
		display: 'flex',
		flexFlow: 'column wrap',
		width: '100%'
	},
	headline: {
		marginBottom: theme.spacing.unit
	},
	title: {
		fontWeight: 700,
		marginBottom: theme.spacing.unit * 2,
		fontSize: theme.typography.pxToRem(24)
	},
	divider: {
		marginTop: theme.spacing.unit * 3,
		marginBottom: theme.spacing.unit * 3
	}
});

class Help extends Component {
	static propTypes = {
		classes: style,
		firebase
	};
	static defaultProps = {
		classes: style,
		firebase
	};
	state = {
		articles: null
	};
	componentDidMount = () =>
		this.props.firebase
			.database()
			.ref('/articles')
			.child('help')
			.on('value', value =>
				this.setState({ articles: Object.values(value.val()) })
			);
	// TODO: All information-related matters handled dynamically from firebase. Also eslint, go fuck yourself with the entities rule.
	render = () => (
  <div>
    <TitleHeader title="Help" />
    <Root>
      <Container hasHeader>
        <div className={this.props.classes.column}>
          <Typography className={this.props.classes.title} type="title">
							FAQ
          </Typography>
          {this.state.articles.map(paragraph => (
            <div>
              <Typography
                className={this.props.classes.headline}
                type="headline"
              >
                {paragraph.headline}
              </Typography>
              <Typography type="body1">{paragraph.text}</Typography>
              <Divider className={this.props.classes.divider} />
            </div>
						))}
        </div>
      </Container>
    </Root>
  </div>
	);
}

export default firebaseConnect()(
	connect(({ firebase: { profile } }) => ({ profile }))(withStyles(style)(Help))
);
