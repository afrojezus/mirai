import React, { Component } from 'react';
import {
	Root,
	CommandoBar,
	Container,
	LoadingIndicator,
	TitleHeader,
} from '../components/layouts';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import Typography from 'material-ui/Typography/Typography';
import Divider from 'material-ui/Divider/Divider';

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
});

class Help extends Component {
	render = () => (
		<div>
			<TitleHeader title={'Help'} />
			<Root>
				<Container hasHeader>
					<div className={this.props.classes.column}>
						<Typography className={this.props.classes.title} type="title">
							FAQ
						</Typography>
						<Typography className={this.props.classes.headline} type="headline">
							Is it legal to watch anime or read manga on here?
						</Typography>
						<Typography type="body1">
							TL;DR: Yes.
							<br />
							As stated by several other big anime sites, it is legal to watch
							anime on here due to the fact it's not hosted by the site.<br />
							The provider is technically the one at fault, and as a secondary
							measure we've not allowed users to download any of the episodes
							provided here. <br />We want to keep it fair to a level in the
							same manner as 9anime and Masteranime does, but by not necessarily
							roaming the ocean of piracy.
							<br />
							Nyaa mode (which is under testing) is a doubtful legal feature; it
							streams the episodes from a torrent source, and due to the
							questionable nature of torrenting these days, we've kept it
							disabled for now.
							<br />
							<br />
							As an addition, we provide links where you can support the
							creators by referring to a Blu-ray set of the same anime, or a
							copy of their manga at Amazon.
							<br />
							<br />
							Any complaints regarding copyright will be observed, and we will
							ensure the copyrighted content will no longer be avaliable on
							Mirai.
						</Typography>
						<Divider className={this.props.classes.divider} />
						<Typography className={this.props.classes.headline} type="headline">
							The site is slow/laggy/chuggy.
						</Typography>
						<Typography type="body1">
							Mirai uses optimized measures to give maximum performance out of
							the styling profile it has.<br />
							On Blink-based browsers such as Google Chrome and Opera; the
							performance should be at the best due to their consistent hardware
							acceleration measures.<br />
							On other browsers such as Firefox; the performance will be worse,
							not due by the styling effects, but by design. Consider enabling
							WebRenderer if the problem is too apparent.<br />
							<br />
							Microsoft Edge has a special case scenario where as the
							performance exceeds that of Blink-based browsers, the styling is
							broken on several areas. We're working on solving this.
						</Typography>
						<Divider className={this.props.classes.divider} />
						<Typography className={this.props.classes.headline} type="headline">
							The anime/manga I want to watch/read isn't avaliable, what do?
						</Typography>
						<Typography type="body1">
							You have to wait. As of now, we currently do not host the episodes
							and rely on Anime Twist to providing them. However, with
							sufficient funds we could eventually host anime, with the endgoal
							of having licenses to host them.<br />
							In the meanwhile we recommend similar services as{' '}
							<a href="https://masterani.me/">Masteranime</a> for keeping up
							with anime, and <a href="https://mangarock.com/">MangaRock</a> for
							manga.
							<br />
							Feel free to use the big ones as well. (Crunchyroll, Netflix,
							Amazon Prime, etc.)
						</Typography>
						<Divider className={this.props.classes.divider} />
						<Typography className={this.props.classes.headline} type="headline">
							I have an account on Yura, how will it work in Mirai?
						</Typography>
						<Typography type="body1">
							Accounts that were made during the Yura phase will work fine in
							Mirai.<br />
							The format will be updated and after that, you're good to go.
						</Typography>
						<Divider className={this.props.classes.divider} />
						<Typography className={this.props.classes.headline} type="headline">
							How do you sync your AniList account with your Mirai account?
						</Typography>
						<Typography type="body1">
							AniList syncing works in the manner of preferring Mirai data
							first, then AniList.<br />
							You'll see data marked as AL if it's from AniList; this is to
							seperate conflicting data from both ends.
							<br />
							Everything you do in Mirai that will trigger an event in AniList
							will be synced with your AniList account. That implies watching
							anime, reading manga, updating favorites and what you add to your
							History.
						</Typography>
						<Divider className={this.props.classes.divider} />
						<Typography className={this.props.classes.headline} type="headline">
							How do you sync your MyAnimeList account with your Mirai account?
						</Typography>
						<Typography type="body1">
							In the similar way to how AniList syncing works.<br />
							You'll see data marked as MAL if it's from MyAnimeList.
						</Typography>
						<Divider className={this.props.classes.divider} />
					</div>
				</Container>
			</Root>
		</div>
	);
}

export default firebaseConnect()(
	connect(({ firebase: { profile } }) => ({ profile }))(withStyles(style)(Help))
);
