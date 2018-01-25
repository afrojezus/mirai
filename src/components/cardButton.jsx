import React from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card/Card';
import Grid from 'material-ui/Grid/Grid';
import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography/Typography';
import CardMedia from 'material-ui/Card/CardMedia';
import { blue } from 'material-ui/colors';
import Avatar from 'material-ui/Avatar/Avatar';

const styles = theme => ({
	entityCard: {
		height: 200,
		width: 183,
		flexGrow: 'initial',
		flexBasis: 'initial',
		margin: theme.spacing.unit / 2,
		transition: theme.transitions.create(['all']),
		'&:hover': {
			overflow: 'initial',
			boxShadow: `0 2px 14px rgba(0,55,230,.3)`,
			background: blue.A200,
		},
		'&:hover > div': {
			boxShadow: 'none',
			zIndex: 200,
		},
		'&:hover > * > h1': {
			fontWeight: 700,
			textShadow: '0 2px 12px rgba(0,0,0,.7)',
		},
		position: 'relative',
		overflow: 'hidden',
		willChange: 'auto',
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
		willChange: 'auto',
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
		willChange: 'auto',
	},
	gradientCard: {
		position: 'relative',
		height: 183,
		width: '100%',
		background: 'linear-gradient(to top, rgba(0,0,0,.6), transparent)',
	},
	peopleCard: {
		height: 'auto',
		width: 183,
		flexGrow: 'initial',
		flexBasis: 'initial',
		margin: theme.spacing.unit / 2,
		transition: theme.transitions.create(['all']),
		'&:hover': {
			overflow: 'initial',
			boxShadow: `0 2px 14px rgba(0,55,230,.3)`,
			background: blue.A200,
		},
		'&:hover > * > h1': {
			textShadow: '0 2px 12px rgba(0,0,0,.7)',
		},
		position: 'relative',
		overflow: 'hidden',
		willChange: 'auto',
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
		willChange: 'auto',
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
		willChange: 'auto',
	},
	artworktype: {
		fontSize: 12,
		boxSizing: 'border-box',
		padding: theme.spacing.unit * 2,
		width: '100%',
		margin: 'auto',
		textAlign: 'center',
		background: '#111',
		color: 'white',
		boxShadow: '0 2px 16px rgba(0,0,0,.2)',
		fontWeight: 600,
	},
	loadingArtwork: {
		margin: 'auto',
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		color: 'white',
		filter: 'drop-shadow(0 2px 16px rgba(0,0,0,.3))',
	},
	artworkimg: {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
		background: 'white',
		transition: theme.transitions.create(['all']),
	},
	artwork: {
		maxWidth: 300,
		height: 400,
		margin: 'auto',
		boxShadow: '0 3px 18px rgba(0,0,0,.5)',
		transition: theme.transitions.create(['all']),
		position: 'relative',
		'&:hover': {
			transform: 'scale(1.05)',
			overflow: 'initial',
			boxShadow: `0 2px 14px rgba(0,0,0,.3)`,
			background: blue.A200,
		},
		'&:hover > .artworktitle': {
			transform: 'scale(1.2)',
		},
		'&:hover > img': {
			transform: 'scale(0.9)',
			filter: 'brightness(0.9)',
		},
		'&:active': {
			opacity: 0.7,
		},
		zIndex: 500,
	},
	artworkDisabled: {
		maxWidth: 300,
		height: 400,
		margin: 'auto',
		boxShadow: '0 3px 18px rgba(0,0,0,.5)',
		transition: theme.transitions.create(['all']),
		position: 'relative',
		'& > img': {
			opacity: 0.7,
		},
		zIndex: 500,
	},
});

const nameSwapper = (first, last) => (last ? first + ' ' + last : first);

export const PeopleButton = withStyles(styles, { withTheme: true })(
	({
		classes,
		theme,
		actor,
		name: { first, last },
		image,
		charImg,
		charOnClick,
		role,
		...props
	}) => {
		return (
			<Grid className={classes.peopleCard} item xs>
				<Card
					style={{
						background: 'transparent',
						boxShadow: 'none',
					}}
				>
					<Avatar
						className={classes.peopleImage}
						classes={{ img: classes.fillImg }}
						src={image}
						imgProps={{
							style: { opacity: 0 },
							onLoad: e => (e.currentTarget.style.opacity = null),
						}}
						onClick={props.onClick}
					/>
					{actor ? (
						<Avatar
							className={classes.peopleCharImage}
							classes={{ img: classes.fillImg }}
							src={charImg}
							imgProps={{
								style: { opacity: 0 },
								onLoad: e => (e.currentTarget.style.opacity = null),
							}}
							onClick={charOnClick}
						/>
					) : null}
					<Typography type="headline" className={classes.peopleTitle}>
						{nameSwapper(first, last)}
					</Typography>
					<Typography type="headline" className={classes.peopleSubTitle}>
						{role}
					</Typography>
				</Card>
			</Grid>
		);
	}
);

/*export const PlayButton = withStyles(styles, { withTheme: true })(({ classes, theme,  ...props }) => (
    <div
        className={
            data.Media.type.includes('MANGA')
                ? classes.artwork
                : data.Media.status.includes('NOT_YET_RELEASED') || !eps
                    ? classes.artworkDisabled
                    : classes.artwork
        }
        style={{ background: hueVib }}
        onClick={
            data.Media.type.includes('MANGA')
                ? this.play
                : data.Media.status.includes('NOT_YET_RELEASED') || !eps
                    ? null
                    : this.play
        }
    >
        <img
            src={data.Media.coverImage.large}
            alt=""
            className={classes.artworkimg}
            style={{ opacity: 0 }}
            onLoad={e => (e.currentTarget.style.opacity = null)}
        />
        <M.CircularProgress
            className={classes.loadingArtwork}
            style={
                data.Media.type.includes('MANGA')
                    ? { opacity: 0 }
                    : eps
                        ? { opacity: 0 }
                        : epError ? { opacity: 0 } : null
            }
        />
        <M.Typography className="artworktitle" type="display1">
            {data.Media.status.includes('NOT_YET_RELEASED')
                ? 'TBA'
                : data.Media.type.includes('MANGA')
                    ? 'Read'
                    : eps
                        ? 'Play'
                        : epError ? 'Not avaliable' : 'Loading'}
        </M.Typography>
        <M.Typography
            className={classes.artworktype}
            style={{ background: hue }}
            type="display1"
        >
            {data.Media.status
                .replace('RELEASING', 'ONGOING')
                .replace(/_/gi, ' ')}{' '}
            {data.Media.type} <br />
            {data.Media.nextAiringEpisode
                ? timeFormatter(
                    data.Media.nextAiringEpisode.timeUntilAiring
                ) +
                ' till Episode ' +
                data.Media.nextAiringEpisode.episode
                : null}
        </M.Typography>
    </div>
))
*/

const CardButton = withStyles(styles, { withTheme: true })(
	({ classes, theme, ...props }) => (
		<Grid item xs className={classes.entityCard}>
			<Card style={{ background: 'transparent' }} onClick={props.onClick}>
				<div className={classes.gradientCard}>
					<CardMedia className={classes.entityImage} image={props.image} />
				</div>
				<Typography type="headline" className={classes.entityTitle}>
					{props.title}
				</Typography>
				<Typography type="headline" className={classes.entitySubTitle}>
					{props.subtitle}
				</Typography>
			</Card>
		</Grid>
	)
);

CardButton.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object,
	image: PropTypes.string,
	title: PropTypes.string,
	subtitle: PropTypes.string,
};

export default CardButton;
