import React, { Component } from 'react';
import * as M from 'material-ui';
import * as Icon from 'material-ui-icons';
import queryString from 'query-string';
import Segoku from '../utils/segoku/segoku';
import * as Vibrant from 'node-vibrant';

import { MIR_SET_TITLE } from '../constants';

import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { LoadingIndicator, TitleHeader, Root } from '../components/layouts';
import red from 'material-ui/colors/red';

const style = theme => ({
	root: {
		height: '100%',
		width: '100%',
		position: 'relative',
		transition: theme.transitions.create(['all']),
	},
	bgImage: {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		opacity: 0.4,
		height: '100vh',
		objectFit: 'cover',
		width: '100%',
		zIndex: -1,
		transform: 'scale(10)',
	},
	content: {
		width: '100%',
		paddingTop: theme.spacing.unit * 8,
	},
	header: {
		position: 'relative',
		margin: 'auto',
		paddingTop: theme.spacing.unit * 3,
	},
	title: {
		color: 'white',
		fontSize: 64,
		fontWeight: 700,
		textShadow: '0 3px 16px rgba(0,0,0,.4)',
		padding: theme.spacing.unit,
		textAlign: 'center',
		margin: 'auto',
	},
	icon: {
		boxShadow: '0 1px 12px rgba(0,0,0,.2)',
		color: 'white',
		height: 92,
		width: 92,
		zIndex: -1,
		background: 'linear-gradient(to top, #9900ff 0%, #ff00ff 70%)',
		borderRadius: '50%',
		padding: theme.spacing.unit * 2,
	},
	fillImg: {
		height: '100%',
		width: '100%',
		objectFit: 'cover',
		background: 'white',
	},
	peopleCard: {
		height: 'auto',
		width: 183,
		flexGrow: 'initial',
		flexBasis: 'initial',
		margin: theme.spacing.unit / 2,
		transition: theme.transitions.create(['all']),
		'&:hover': {
			transform: 'scale(1.05)',
			overflow: 'initial',
			zIndex: 200,
			boxShadow: `0 2px 14px rgba(0,55,230,.3)`,
			background: M.colors.blue.A200,
		},
		'&:hover > * > h1': {
			transform: 'scale(1.1)',
			textShadow: '0 2px 12px rgba(0,0,0,.7)',
		},
		position: 'relative',
		overflow: 'hidden',
	},
	peopleImage: {
		height: 156,
		width: 156,
		margin: 'auto',
		zIndex: 1,
		borderRadius: '50%',
		boxShadow: '0 2px 12px rgba(0,0,0,.2)',
		transition: theme.transitions.create(['all']),
		'&:hover': {
			boxShadow: '0 3px 16px rgba(0,0,0,.5)',
		},
		top: 0,
		left: 0,
	},
	peopleCharImage: {
		height: 64,
		width: 64,
		margin: 'auto',
		zIndex: 2,
		position: 'absolute',
		borderRadius: '50%',
		boxShadow: '0 2px 12px rgba(0,0,0,.2)',
		transition: theme.transitions.create(['all']),
		'&:hover': {
			boxShadow: '0 3px 16px rgba(0,0,0,.5)',
			transform: 'scale(1.2)',
		},
		right: theme.spacing.unit * 3,
		bottom: theme.spacing.unit * 7,
	},
	entityContext: {
		'&:last-child': {
			paddingBottom: 12,
		},
	},
	peopleTitle: {
		fontSize: 14,
		fontWeight: 500,
		padding: theme.spacing.unit,
		paddingBottom: theme.spacing.unit / 2,
		transition: theme.transitions.create(['transform']),
		bottom: 0,
		zIndex: 5,
		margin: 'auto',
		textAlign: 'center',
		textShadow: '0 1px 12px rgba(0,0,0,.2)',
	},
	peopleSubTitle: {
		fontSize: 14,
		color: 'rgba(255,255,255,.7)',
		fontWeight: 600,
		margin: 'auto',
		transition: theme.transitions.create(['transform']),
		zIndex: 5,
		textShadow: '0 1px 12px rgba(0,0,0,.2)',
		textAlign: 'center',
		whiteSpace: 'nowrap',
	},
	entityCard: {
		height: 200,
		width: 183,
		flexGrow: 'initial',
		flexBasis: 'initial',
		margin: theme.spacing.unit / 2,
		transition: theme.transitions.create(['all']),
		'&:hover': {
			transform: 'scale(1.05)',
			overflow: 'initial',
			zIndex: 200,
			boxShadow: `0 2px 14px rgba(0,55,230,.3)`,
			background: M.colors.blue.A200,
		},
		'&:hover > div': {
			boxShadow: 'none',
		},
		'&:hover > * > h1': {
			transform: 'scale(1.4)',
			fontWeight: 700,
			textShadow: '0 2px 12px rgba(0,0,0,.7)',
		},
		position: 'relative',
		overflow: 'hidden',
	},
	entityCardDisabled: {
		height: 200,
		width: 183,
		flexGrow: 'initial',
		flexBasis: 'initial',
		margin: theme.spacing.unit / 2,
		transition: theme.transitions.create(['all']),
		filter: 'brightness(.8)',
		position: 'relative',
		overflow: 'hidden',
	},
	entityImage: {
		height: '100%',
		width: '100%',
		objectFit: 'cover',
		position: 'absolute',
		zIndex: -1,
		transition: theme.transitions.create(['filter']),
		'&:hover': {
			filter: 'brightness(0.8)',
		},
		top: 0,
		left: 0,
	},
	entityTitle: {
		fontSize: 14,
		fontWeight: 500,
		position: 'absolute',
		padding: theme.spacing.unit * 2,
		transition: theme.transitions.create(['transform']),
		bottom: 0,
		zIndex: 5,
		left: 0,
		textShadow: '0 1px 12px rgba(0,0,0,.2)',
	},
	entitySubTitle: {
		fontSize: 14,
		fontWeight: 600,
		position: 'absolute',
		padding: theme.spacing.unit * 2,
		transition: theme.transitions.create(['transform']),
		top: 0,
		left: 0,
		zIndex: 5,
		textShadow: '0 1px 12px rgba(0,0,0,.2)',
	},
	itemcontainer: {
		paddingBottom: theme.spacing.unit * 2,
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
	},
	gradientCard: {
		position: 'relative',
		background: 'linear-gradient(to top, transparent, rgba(0,0,0,.6))',
		height: 183,
		width: '100%',
	},
	sectDivide: {
		marginTop: theme.spacing.unit * 2,
	},
	progressCon: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		maxWidth: 400,
		margin: 'auto',
	},
	progressTitle: {
		display: 'flex',
		fontSize: 12,
		margin: 'auto',
		textAlign: 'center',
	},
	progressBar: {
		background: 'rgba(255,255,255,.3)',
		margin: theme.spacing.unit / 2,
	},
	progressBarActive: {
		background: 'white',
	},
	commandoBar: {
		width: '100%',
		padding: theme.spacing.unit,
		display: 'inline-flex',
		boxSizing: 'border-box',
		background: '#222',
		boxShadow: '0 3px 18px rgba(0,0,0,.1)',
	},
	commandoText: {
		margin: 'auto',
		textAlign: 'center',
	},
	commandoTextBox: {
		paddingLeft: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		margin: 'auto',
	},
	commandoTextLabel: {
		fontSize: 10,
		textAlign: 'center',
		color: 'rgba(255,255,255,.8)',
	},
	smallTitlebar: {
		display: 'flex',
	},
	secTitle: {
		padding: theme.spacing.unit,
		fontWeight: 700,
		fontSize: 22,
		zIndex: 'inherit',
		paddingBottom: theme.spacing.unit * 2,
	},
	loading: {
		height: '100%',
		width: '100%',
		zIndex: -5,
		position: 'fixed',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%,-50%)',
		padding: 0,
		margin: 'auto',
		transition: theme.transitions.create(['all']),
	},
	backToolbar: {
		marginTop: theme.spacing.unit * 8,
	},
	bigBar: {
		width: '100%',
		height: 'auto',
		boxShadow: '0 2px 24px rgba(0,0,0,.2)',
		background: '#111',
		marginTop: theme.spacing.unit * 8,
		position: 'relative',
		overflow: 'hidden',
		paddingBottom: theme.spacing.unit * 4,
		marginBottom: theme.spacing.unit * 8,
		transition: theme.transitions.create(['all']),
	},
	glassEffect: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		opacity: 0.4,
		height: '100vh',
		objectFit: 'cover',
		width: '100%',
		transform: 'scale(20)',
	},
	rootInactive: {
		opacity: 0,
		pointerEvents: 'none',
		transition: theme.transitions.create(['all']),
	},
	container: {
		marginLeft: 'auto',
		marginRight: 'auto',
		maxWidth: 1200,
		[theme.breakpoints.up('md')]: {
			maxWidth: 'calc(100% - 64px)',
			paddingTop: 24,
		},
	},
	frame: {
		height: '100%',
		width: '100%',
		position: 'relative',
		transition: theme.transitions.create(['all']),
	},
	grDImage: {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		opacity: 1,
		height: '100vh',
		width: '100%',
		zIndex: -1,
		overflow: 'hidden',
		transition: theme.transitions.create(['all']),
	},
	mainFrame: {
		marginLeft: 24,
	},
	bigTitle: {
		fontWeight: 700,
		color: 'white',
		textShadow: '0 2px 12px rgba(0,0,0,.2)',
	},
	smallTitle: {
		fontWeight: 600,
		color: 'white',
		fontSize: 16,
		textShadow: '0 2px 12px rgba(0,0,0,.17)',
	},
	tagBox: {
		marginTop: theme.spacing.unit,
	},
	tagTitle: {
		fontSize: 16,
		fontWeight: 600,
		color: 'white',
		textShadow: '0 2px 12px rgba(0,0,0,.17)',
		marginBottom: theme.spacing.unit,
	},
	desc: {
		marginTop: theme.spacing.unit,
		color: 'white',
		textShadow: '0 0 12px rgba(0,0,0,.1)',
		marginBottom: theme.spacing.unit * 6,
	},
	boldD: {
		marginTop: theme.spacing.unit,
		color: 'white',
		textShadow: '0 0 12px rgba(0,0,0,.1)',
		marginBottom: theme.spacing.unit,
		fontWeight: 600,
	},
	smallD: {
		marginLeft: theme.spacing.unit,
		marginTop: theme.spacing.unit,
		color: 'white',
		textShadow: '0 0 12px rgba(0,0,0,.1)',
		marginBottom: theme.spacing.unit,
	},
	sepD: {
		display: 'flex',
		marginLeft: theme.spacing.unit,
	},
	artworkimg: {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
		background: 'white',
		transition: theme.transitions.create(['all']),
		zIndex: -1,
	},
	artwork: {
		width: 400,
		height: 400,
		borderRadius: '50%',
		overflow: 'hidden',
		margin: 'auto',
		boxShadow: '0 3px 18px rgba(0,0,0,.5)',
		transition: theme.transitions.create(['all']),
		position: 'relative',
		zIndex: 500,
	},
});

const tagQuery = `
query($id: Int) {
    Staff(id: $id) {
        id
        name {
            first
            last
            native
        }
        language
        image {
            large
            medium
        }
        description(asHtml: true)
        staffMedia {
            edges {
                node {
                    id
                    title {
                        english
                        romaji
                        native
                    }
                    coverImage {
                        large
                        medium
                    }
                    description(asHtml: true)
                    type
                }
                id
                relationType
                staffRole
            }
        }
        characters {
            edges {
                node {
                    id
                    name {
                        first
                        last
                        native
                        alternative
                    }
                    image {
                        large
                        medium
                    }
                    description(asHtml: true)
                }
                id
                role
            }
        }
    }
}
`;

const genreQuery = `
query($id: Int) {
    Character(id: $id) {
        id
        name {
            first
            last
            native
            alternative
        }
        image {
            large
            medium
        }
        description(asHtml: true)
        media {
            edges {
                node {
                    id
                    title {
                        english
                        romaji
                        native
                    }
                    coverImage {
                        large
                        medium
                    }
                    description(asHtml: true)
                    type
                }
                id
                relationType
                characterRole
            }
        }
    }
}
`;

const studioQuery = `
query($id: Int) {
    Studio(id: $id) {
        id
        name
        media {
            edges {
                node {
                    id
                    title {
                        english
                        romaji
                        native
                    }
                    coverImage {
                        large
                        medium
                    }
                    description(asHtml: true)
                    type
                }
            }
        }
    }
}
`;

const nameSwapper = (first, last) => (last ? first + ' ' + last : first);

class Tag extends Component {
	state = {
		data: null,
		loading: true,
		id: 0,
		type: '',
		hue: '#111',
		hueVib: '#222',
		hueVibN: '#222',
		fav: false,
		title: '',
	};

	unlisten = this.props.history.listen((location, action) => {
		let id = queryString.parse(location.search);
		if (location.pathname === '/tag') {
			if (this.state.type === 'TAG') if (id.t !== this.state.id) this.init();
			if (this.state.type === 'GENRE') if (id.g !== this.state.id) this.init();
			if (this.state.type === 'STUDIO') if (id.s !== this.state.id) this.init();
		} else {
			return false;
		}
	});

	componentDidMount = () => {
		this.init();
	};

	init = async () =>
		this.setState({ data: null, loading: true }, () =>
			setTimeout(async () => {
				const id = queryString.parse(this.props.history.location.search);
				try {
					if (id && this.props.history.location.pathname === '/tag') {
						const { data } = this.props.history.location.search.includes('?s=')
							? await new Segoku().customQuery(studioQuery, { id: id.s })
							: this.props.history.location.search.includes('?g=')
								? await new Segoku().customQuery(genreQuery, { id: id.g })
								: await new Segoku().customQuery(tagQuery, { id: id.t });
						if (data) {
							console.log(data);
							this.setState(
								{
									data,
								},
								() =>
									setTimeout(
										() =>
											this.setState(
												{
													loading: false,
													id: this.props.history.location.search.includes('?s=')
														? id.s
														: this.props.history.location.search.includes('?g=')
															? id.g
															: id.c,
													type: this.props.history.location.search.includes(
														'?s='
													)
														? 'STUDIO'
														: this.props.history.location.search.includes('?g=')
															? 'GENRE'
															: 'TAG',
													title: this.props.history.location.search.includes(
														'?g='
													)
														? this.state.data.title
														: this.props.history.location.search.includes('?s=')
															? this.state.data.Studio.name
															: id.t,
													fav: this.props.history.location.search.includes(
														'?s='
													)
														? this.props.profile.favs &&
															this.props.profile.favs.studio &&
															this.props.profile.favs.studio.hasOwnProperty(
																id.c
															)
															? true
															: false
														: null,
												},
												() => this.vibrance()
											),
										300
									)
							);
						}
					}
				} catch (error) {
					console.error(error);
				}
			}, 300)
		);

	vibrance = () => {
		/*let superBar = document.getElementById('superBar');
		if (superBar) superBar.style.background = this.state.hue;*/
	};

	openEntity = link => {
		this.props.history.push(link);
	};

	like = async () => {
		if (this.props.profile)
			this.props.firebase
				.update(
					`users/${this.props.profile.userID}/favs/studio/${this.state.id}`,
					{
						name: this.state.data.Studio.name,
						id: this.state.id,
						link:
							this.props.history.location.pathname +
							this.props.history.location.search,
					}
				)
				.then(() => {
					this.setState({ fav: true });
				});
	};

	unlike = async () => {
		if (this.props.profile)
			this.props.firebase
				.remove(
					`users/${this.props.profile.userID}/favs/studio/${this.state.id}`
				)
				.then(() => this.setState({ fav: false }));
	};

	componentWillUnmount = () => {
		let superBar = document.getElementById('superBar');
		if (superBar) superBar.style.background = null;
		this.props.sendTitleToMir('');
		this.unlisten();
	};

	render() {
		const { classes } = this.props;
		const user = this.props.profile;
		const { data, loading, hue, fav, title } = this.state;
		return (
			<div>
				<TitleHeader title={title} color={red.A200} />
				<LoadingIndicator loading={loading} />
				<Root style={loading ? { opacity: 0 } : null} />
			</div>
		);
	}
}

const mapPTS = dispatch => {
	return {
		sendTitleToMir: title => dispatch(updateMirTitle(title)),
	};
};

export const updateMirTitle = title => ({
	type: MIR_SET_TITLE,
	title,
});

export default firebaseConnect()(
	connect(({ firebase: { profile } }) => ({ profile }), mapPTS)(
		M.withStyles(style)(Tag)
	)
);
