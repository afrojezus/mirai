import Segoku from "./segoku/segoku";
import queryString from "query-string";
import hsfetcher from "../torrent";
import localForage from "localforage";
import Twist from "../twist-api";
import {isEmpty} from "react-redux-firebase";

/**
 * mirfetch getState
 * @param {this} parent - React Component wielding a state, a history as prop, firebase profile as prop, and several playing methods.
 * @returns {Promise<void>}
 */
export const getState = async (parent) => {
    const id = queryString.parse(parent.props.history.location.search);
    try {
        if (parent.state.torrent) {
            if (parent.props.history.location.state) {
                console.info('Nyaa mode, found location state.');
                parent.setState({status: 'Setting up...'});
                getTorrent(parent, parent.props.history.location.state)
            } else {
                console.info('Nyaa mode, location state not found. Requesting metadata...');
                parent.setState({status: 'Fetching...'});
                const {data} = await new Segoku().getSingle({id: id.w});
                if (data)
                    getTorrent(parent, {meta: data.Media});
            }
        }
        else {
            if (parent.props.history.location.state) {
                console.info('Location state found! No need for refetching.');
                parent.setState({status: 'Setting up...'});
                await getSource(parent, parent.props.history.location.state);
            } else {
                console.info('Location state not found! Refetching...');
                parent.setState({status: 'Fetching...'});
                const {data} = await new Segoku().getSingle({id: id.w});
                if (data)
                   await getSource(parent, {meta: data.Media});
            }
        }
    } catch (error) {
        console.error(error);
        parent.setState({
            error: true,
            status: 'Error 1: Failed to fetch metadata',
        });
    }
}

const getTorrent = (parent, data) => parent.setState({
    title: data.meta.title.english
        ? data.meta.title.english
        : data.meta.title.romaji,
    showId: data.meta.id,
    showArtwork: data.meta.coverImage.large,
    showDesc: data.meta.description,
    showHeaders: data.meta.bannerImage
        ? data.meta.bannerImage
        : data.meta.coverImage.large,
}, async () => {
    const list = await hsfetcher.getList(data.meta.title.romaji);
    try {
        if (list) {
            let eps = [];
            list.filter(e => e.quality === parent.state.quality).reverse().forEach((s, i) => {
                return eps.push({
                    name: s.title,
                    link: s.torrent,
                    ep: i + 1,
                    provider: 'Nyaa'
                })
            });
            parent.setState({ eps, status: 'Initiating client...' }, async () => loadEp(parent, parent.state.eps[0], null))
        } else return new Error('fuck');
    } catch (error) {
       return console.error(error)
    }
});

const getSource = async (parent, data) => {
    parent.setState({
        title: data.meta.title.english
            ? data.meta.title.english
            : data.meta.title.romaji,
        showId: data.meta.id,
        showArtwork: data.meta.coverImage.large,
        showDesc: data.meta.description,
        showHeaders: data.meta.bannerImage
            ? data.meta.bannerImage
            : data.meta.coverImage.large,
    });
    let correctedtitle = data.meta.title.romaji.toLowerCase();
    const meta = Object.values(parent.props.mir.twist).filter(s =>
        s.name.toLowerCase().match(`${correctedtitle}`)
    );
    try {
        if (data.eps) {
            console.log(data.eps);
            console.info('Episodes found from cache!');
            parent.setState({ eps: data.eps, status: 'Loading...' }, async () => {
                localForage
                    .getItem('player-state')
                    .then(a => {
                        if (a.showId === parent.state.showId) {
                            console.info('Metadata found.');
                            loadEp(parent, parent.state.eps[a.ep - 1], a.played);
                        } else throw new Error('');
                    })
                    .catch(async a => {
                        if (
                            !isEmpty(parent.props.profile) &&
                            parent.props.profile.episodeProgress[parent.state.showId]
                        ) {
                            console.info('No metadata found locally, attempting remote.');
                            loadEp(parent,
                                parent.state.eps[
                                parent.props.profile.episodeProgress[parent.state.showId].ep - 1
                                    ],
                                parent.props.profile.episodeProgress[parent.state.showId].played
                            );
                        } else {
                            console.info(
                                'No metadata found locally and remotely, starting new session.'
                            );
                            loadEp(parent, parent.state.eps[0], null);
                        }
                    });
            });
        } else if (meta && meta[0].link) {
            console.info('Episodes not found from cache! Scratching...');
            const eps = await Twist.get(meta[0].link);
            if (eps) {
                console.log(eps);

                parent.setState({ eps, status: 'Loading...' }, async () => {
                    localForage
                        .getItem('player-state')
                        .then(a => {
                            if (a.showId === parent.state.showId) {
                                console.info('Metadata found.');
                                loadEp(parent, parent.state.eps[a.ep - 1], a.played);
                            } else throw new Error('');
                        })
                        .catch(async a => {
                            if (
                                !isEmpty(parent.props.profile) &&
                                parent.props.profile.episodeProgress[parent.state.showId]
                            ) {
                                console.info('No metadata found locally, attempting remote.');
                                loadEp(parent,
                                    parent.state.eps[
                                    parent.props.profile.episodeProgress[parent.state.showId].ep -
                                    1
                                        ],
                                    parent.props.profile.episodeProgress[parent.state.showId].played
                                );
                            } else {
                                console.info(
                                    'No metadata found locally and remotely, starting new session.'
                                );
                                loadEp(parent, parent.state.eps[0], null);
                            }
                        });
                });
            }
        } else {
            throw new Error('Failed to load videodata.');
        }
    } catch (error) {
        console.error(error);
        parent.setState({
            error: true,
            status: 'Error 2: Failed to load videodata.',
        });
    }
};

export const loadEp = (parent, ep, resume) =>
    parent.setState(
        {
            playing: false,
            source: null,
            buffering: true,
            status: 'Loading...',
            loaded: 0,
            played: 0,
            videoQuality: null,
        },
        async () => {
            if (document.getElementById('player'))
                document.getElementById('player').style.opacity = 1;
            if (parent.state.menuEl) {
                parent.closeMenu();
            }
            if (parent.state.torrent) {
                hsfetcher.getSource(ep.link, (torrent, file) => {
                    file.getBlobURL(function (err, url) {
                        if (err) throw err;
                        if (url)
                            parent.setState({ torrentFile: torrent, source: url, ep: ep.ep, resume: resume ? resume : null }, () => parent.playPause())
                    })
                })
            }
            else {
                const source = await Twist.getSource(ep.link);
                try {
                    if (source) {
                        parent.setState(
                            { source, ep: ep.ep, resume: resume ? resume : null },
                            () => {
                                parent.playPause();
                            }
                        );
                    }
                } catch (error) {
                    console.error(error);
                    parent.setState({ error: true, status: 'Error' });
                }
            }
        }
    );

export const loadFile = (parent, link) =>
    parent.setState(
        {
            playing: false,
            source: null,
            buffering: true,
            status: 'Loading...',
            loaded: 0,
            played: 0,
            videoQuality: null,
        },
        async () => {
            console.log(link)
            if (document.getElementById('player'))
                document.getElementById('player').style.opacity = 1;
            if (parent.state.menuEl) {
                parent.closeMenu();
            }
            if (link) {
                parent.setState(
                    {source: link.preview, status: link.name.trim(), ep: null, resume: null},
                    () => {
                        parent.playPause();
                    }
                );
            } else {
                console.error("File couldn't be played.");
                parent.setState({error: true, status: 'Error'});
            }
        }
    );
