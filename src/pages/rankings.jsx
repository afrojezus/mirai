import React, { Component } from 'react';
import { Root, CommandoBar, Container, LoadingIndicator, TitleHeader } from "../components/layouts";
import { withStyles } from 'material-ui/styles'
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import Typography from 'material-ui/Typography/Typography';
import Supertable from '../components/supertable';

const style = theme => ({

})

class Rankings extends Component {
	state = {
		loading: true
	}

	componentDidMount = () => {

	}


	render = () => (
		<Root>
			<LoadingIndicator
				loading={this.state.loading}
			/>
			<TitleHeader title={'Rankings'} />
			<Container hasHeader style={this.state.loading ? { opacity: 0 } : null}>
				<Typography type='title'>Top 10 animes</Typography>
				<Supertable data={[]} type='s' typeof='rankings' limit={8}></Supertable>
			</Container>
		</Root>
	)
}

export default firebaseConnect()(
	connect(({ firebase: { profile } }) => ({ profile }))(
		withStyles(style)(Rankings)
	)
);
