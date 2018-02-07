// TODO: Fix every single eslint-airbnb issue
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
import React, {Component} from 'react';
import {Draggable} from '@shopify/draggable';
import PropTypes from 'prop-types';
import * as Icon from 'material-ui-icons';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import Button from 'material-ui/Button/Button';
import IconButton from 'material-ui/IconButton/IconButton';
import Typography from 'material-ui/Typography/Typography';
import Divider from 'material-ui/Divider/Divider';
import Card from 'material-ui/Card/Card';
import CardContent from 'material-ui/Card/CardContent';
import LinearProgress from 'material-ui/Progress/LinearProgress';
import CardActions from 'material-ui/Card/CardActions';
import Menu from 'material-ui/Menu/Menu';
import CardHeader from 'material-ui/Card/CardHeader';
import grey from 'material-ui/colors/grey';
import MenuItem from 'material-ui/Menu/MenuItem';
import Tooltip from 'material-ui/Tooltip/Tooltip';
import FormGroup from 'material-ui/Form/FormGroup';
import FormControlLabel from 'material-ui/Form/FormControlLabel';
import Switch from 'material-ui/Switch/Switch';
import TextField from 'material-ui/TextField/TextField';
import withStyles from 'material-ui/styles/withStyles';
import ReactPlayer from 'react-player';
import localForage from 'localforage';
import queryString from 'query-string';
import FadeIn from 'react-fade-in';
import {connect} from 'react-redux';
import {firebaseConnect, isEmpty, firebase} from 'react-redux-firebase';
import blue from 'material-ui/colors/blue';
import {history} from '../store';
import Aqua3 from '../assets/aqua3.gif';
import Duration from '../components/yuplayer/Duration';
import Twist from '../twist-api';
import Segoku from '../utils/segoku/segoku';
import corrector from '../utils/bigfuck';
import hsfetcher from '../torrent';
import {getState, loadEp, loadFile} from '../utils/mirfetch';
import {MIR_PLAY_SHOW} from '../constants';

const style = theme => ({
    root: {
        minHeight: '100vh',
        minWidth: '100%',
        position: 'fixed',
        bottom: 0,
        top: 0,
        right: 0,
        left: 0,
        overflow: 'hidden',
        animation: 'playerLoad .5s ease',
        transition: theme.transitions.create(['all'])
    },
    rootSmol: {
        minHeight: 280,
        minWidth: 500,
        position: 'fixed',
        right: theme.spacing.unit * 3,
        bottom: theme.spacing.unit * 3,
        overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(0,0,0,.3)',
        zIndex: 3000,
        animation: 'playerLoad .5s ease',
        transition: theme.transitions.create(['all']),
        display: 'flex'
    },
    player: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'black',
        transition: theme.transitions.create(['all'])
    },
    controlpanel: {
        position: 'fixed',
        bottom: theme.spacing.unit * 6,
        width: 'calc(100% - 128px)',
        marginLeft: 64,
        marginRight: 64,
        background: window.safari ? 'rgba(0,0,0,.2)' : grey[800],
        boxShadow: '0 2px 32px rgba(0,0,0,.3)',
        transition: theme.transitions.create(['all']),
        backdropFilter: 'blur(10px)'
    },
    backToolbar: {
        zIndex: 10,
        transition: theme.transitions.create(['all'])
    },
    indicator: {
        flexDirection: 'row',
        padding: 0,
        display: 'flex',
        position: 'relative'
    },
    progress: {
        flex: 1
    },
    progressLoaded: {
        zIndex: -1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
    },
    progressBg: {
        backgroundColor: grey[900]
    },
    progressBgOver: {
        backgroundColor: 'transparent'
    },
    progressBar: {
        transition: 'none'
    },
    progressBarLoaded: {
        transition: 'none',
        backgroundColor: grey[700]
    },
    duration: {
        padding: theme.spacing.unit,
        fontFamily: 'SF Mono'
    },
    left: {
        padding: theme.spacing.unit
    },
    epListCont: {
        maxHeight: 300,
        overflowY: 'scroll',
        padding: 0
    },
    epListItem: {},
    volumeSlider: {
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        outline: 'none'
    },
    progressInput: {
        background: 'transparent',
        position: 'absolute',
        margin: '-5px 0',
        width: '100%',
        '-webkit-appearance': 'none',
        outline: 'none',
        transition: theme.transitions.create(['all']),
        opacity: 0,
        '&:hover': {
            opacity: 1
        }
    },
    loading: {
        height: '100%',
        width: '100%',
        zIndex: 1000,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        padding: 0,
        margin: 'auto',
        transition: theme.transitions.create(['all']),
        color: 'white'
    },
    showInfo: {
        margin: 'auto',
        width: '100%',
        padding: theme.spacing.unit * 8,
        display: 'flex',
        zIndex: 500,
        boxSizing: 'border-box'
    },
    showInfoColumn: {
        display: 'flex',
        flexDirection: 'column',
        margin: 8
    },
    showInfoTitle: {
        fontWeight: 700,
        padding: theme.spacing.unit,
        paddingLeft: 0,
        color: 'white'
    },
    showInfoDesc: {
        paddingTop: theme.spacing.unit * 2,
        fontSize: 16
    },
    showInfoArtwork: {
        width: 300,
        objectFit: 'cover',
        boxShadow: '0 2px 16px rgba(0,0,0,.2)'
    },
    nextButton: {},
    nextButtonWrapper: {
        margin: theme.spacing.unit,
        position: 'relative'
    },
    nextButtonProgress: {
        color: blue.A200,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12
    },
    qualityTitle: {
        border: '2px solid white',
        borderRadius: 2,
        padding: theme.spacing.unit / 2,
        boxSizing: 'border-box',
        fontSize: 14,
        fontWeight: 500
    },
    menuPaper: {
        outline: 'none'
    },
    pipcontrols: {
        margin: 'auto',
        display: 'flex',
        flexFlow: 'column wrap',
        zIndex: '3000',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        transition: theme.transitions.create(['all']),
        opacity: 0
    }
});

class MirPlayer extends Component {
    static propTypes = {
        profile: PropTypes.shape({
            userID: PropTypes.string
        }),
        mir: PropTypes.shape({
            play: PropTypes.shape({
                eps: PropTypes.arrayOf(PropTypes.shape({})),
                id: PropTypes.number,
                meta: PropTypes.shape({})
            })
        }),
        history: PropTypes.shape({
            goBack: PropTypes.func,
            location: PropTypes.shape({
                pathname: PropTypes.string,
                state: PropTypes.shape({
                    eps: PropTypes.arrayOf(PropTypes.shape({}))
                })
            }),
            push: PropTypes.func
        }),
        firebase: PropTypes.shape({
            database: PropTypes.func
        }),
        theme: PropTypes.shape({}),
        location: PropTypes.shape({
            state: PropTypes.shape({}),
            search: PropTypes.string,
            pathname: PropTypes.string
        }),
        removeDataFromMir: PropTypes.func,
        classes: style,
        fullSize: PropTypes.bool
    };

    static defaultProps = {
        profile: null,
        history,
        location: null,
        firebase: null,
        classes: style,
        theme: {},
        mir: null,
        fullSize: false,
        removeDataFromMir: PropTypes.func
    };
    state = {
        playing: false,
        buffering: true,
        source: '',
        duration: 0,
        volume: 0.5,
        status: '',
        title: '',
        fullscreen: false,
        played: 0,
        loaded: 0,
        seeking: false,
        menu: false,
        rate: null,
        ep: 0,
        eps: [],
        error: false,
        menuEl: null,
        showId: 0,
        recentlyWatched: 0,
        volEl: null,
        counter: 5,
        torrent: false,
        quality: 480,
        torrentFile: null,
        quaEl: null,
        native: false
    };

    componentWillMount = async () => {
        const playerVolume = await localForage.getItem('player-settings-volume');
        const playerUseTorrent = await localForage.getItem(
            'player-setting-torrent'
        );

        if (playerVolume) this.setState({volume: playerVolume});

        /* if (playerUseTorrent) this.setState({ torrent: playerUseTorrent });
                else return; */

        /*	this.draggable = new Draggable(document.getElementById('frame'), {
            draggable: !this.props.fullSize ? '#frame' : null
        }) */
    };
    // TODO: Fix loading
    componentWillReceiveProps = async nextProps => {
        if (this.props.mir !== nextProps.mir) {
            if (this.props.profile !== nextProps.profile) return false;
            await getState(this);
        }
        return false;
    };

    componentWillUnmount = async () => {
        if (!isEmpty(this.props.profile) && this.state.loaded > 0) {
            const episodePro = this.props.firebase
                .database()
                .ref('users')
                .child(`${this.props.profile.userID}`)
                .child('episodeProgress');
            localForage.getItem('player-state').then(async a => {
                if (a && a.showId) {
                    episodePro.child(`${a.showId}`).update(a);
                    return true;
                }
                return false;
            });
        }

        if (this.state.torrent && this.state.torrentFile)
            hsfetcher.destroyClient(this.state.torrentFile);

        this.props.removeDataFromMir(null);
    };

    onSeekMouseDown = e => {
        this.setState({seeking: true});
    };

    onSeekChange = e => {
        this.setState({played: parseFloat(e.target.value)});
    };

    onSeekMouseUp = e => {
        this.setState({seeking: false, buffering: true});
        this.player.seekTo(parseFloat(e.target.value));
    };

    onBuffer = () => {
        this.setState({buffering: true, status: 'Buffering...'}, () => {
        });
    };

    onProgress = state => {
        const play = this.state.played;
        if (!this.state.seeking)
            this.setState(state, async () => {
                this.setState({
                    videoQuality: this.player.getInternalPlayer().videoHeight,
                    recentlyWatched: Date.now()
                });
                switch (this.player.getInternalPlayer().networkState) {
                    case 1:
                        console.log('IDLE');
                        this.setState({buffering: false});
                        break;
                    case 2:
                        console.log('LOADING');
                        this.setState({buffering: false});
                        break;
                    default:
                        break;
                }

                if (this.state.resume) {
                    const {resume} = this.state;
                    this.setState({resume: null, buffering: true}, () => {
                        this.player.seekTo(resume);
                        if (resume === this.state.played)
                            this.setState({buffering: false});
                    });
                }
                if (!this.state.menuEl && !this.state.volEl)
                    await localForage.setItem('player-state', this.state);
            });
    };

    setVolume = e => {
        this.setState({volume: parseFloat(e.target.value)}, async () => {
            await localForage.setItem('player-settings-volume', this.state.volume);
        });
    };

    setPlaybackRate = e => {
        this.setState({playbackRate: parseFloat(e.target.value)});
    };

    draggable = undefined;

    mute = e => {
        const prevVol = this.state.volume;
        if (this.state.volume > 0) {
            this.setState({volume: 0});
        } else {
            this.setState({volume: prevVol});
        }
    };

    inactivityTimeout;
    /* stop = () => {
        this.setState({ source: null, playing: false });
      }; */

    playPause = resume => {
        this.setState({playing: !this.state.playing});
        if (this.timer && this.timer !== undefined) clearInterval(this.timer);
    };

    skip30Sec = () => {
        this.player.seekTo(this.state.played + 18 / 1000, null);
    };

    skipToNextEp = () => {
        let nextEp = this.state.ep;
        nextEp += 0;
        loadEp(this, this.state.eps[nextEp], null);
        if (this.state.willLoadNextEp) this.setState({willLoadNextEp: false});
    };

    player = HTMLMediaElement;
    closeMenu = () => this.setState({menuEl: null});

    mouseResetDelay = () => {
        clearTimeout(this.inactivityTimeout);
        this.inactivityTimeout = setTimeout(() => {
            this.hide();
        }, 4000);
    };

    reveal = event => {
        const back = document.getElementById('backbutton');
        const controls = document.getElementById('controls');
        const pcontrols = document.getElementById('pipcontrols');
        const player = document.getElementById('player');
        if (back && (controls || pcontrols) && player) {
            back.style.opacity = 1;
            if (controls) controls.style.opacity = 1;
            if (pcontrols) pcontrols.style.opacity = 1;
            player.style.cursor = 'initial';
            this.mouseResetDelay();
        }
    };

    hide = () => {
        const back = document.getElementById('backbutton');
        const controls = document.getElementById('controls');
        const pcontrols = document.getElementById('pipcontrols');
        const player = document.getElementById('player');
        if (
            back &&
            (controls || pcontrols) &&
            player &&
            this.state.loaded > 0 &&
            this.state.played < 1
        ) {
            player.style.cursor = 'none';
            back.style.opacity = 0;
            if (controls) controls.style.opacity = 0;
            if (pcontrols) pcontrols.style.opacity = 0;
        }
    };

    handleFullscreen = e =>
        this.setState({fullscreen: !this.state.fullscreen}, () => {
            const docElm = document.documentElement;
            if (this.state.fullscreen) {
                if (docElm.requestFullscreen) {
                    docElm.requestFullscreen();
                } else if (docElm.mozRequestFullScreen) {
                    docElm.mozRequestFullScreen();
                } else if (docElm.webkitRequestFullScreen) {
                    docElm.webkitRequestFullScreen();
                } else if (docElm.msRequestFullscreen) {
                    docElm.msRequestFullscreen();
                }
            } else if (!this.state.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        });

    handleEnded = () => {
        this.reveal();
        if (!isEmpty(this.props.profile) && this.state.loaded > 0) {
            const episodePro = this.props.firebase
                .database()
                .ref('users')
                .child(`${this.props.profile.userID}`)
                .child('episodeProgress');
            localForage.getItem('player-state').then(async a => {
                if (a && a.showId) {
                    episodePro.child(`${a.showId}`).update(a);
                    return true;
                }
                return false;
            });
        }

        if (this.state.eps.length < this.state.ep) {
            this.setState({willLoadNextEp: true}, () => {
                this.timer = setTimeout(
                    () =>
                        this.setState({willLoadNextEp: false}, () => this.skipToNextEp()),
                    5000
                );
            });
        }
    };

    timer = undefined;

    changeQuality = int => {
        switch (int) {
            case 1080:
                if (this.state.torrentFile)
                    hsfetcher.destroyClient(this.state.torrentFile);
                this.setState(
                    {
                        source: null,
                        playing: false,
                        quality: 1080,
                        quaEl: null,
                        buffering: true,
                        status: 'Downloading...',
                        loaded: 0,
                        played: 0,
                        videoQuality: null
                    },
                    async () => getState(this)
                );
                break;
            case 720:
                if (this.state.torrentFile)
                    hsfetcher.destroyClient(this.state.torrentFile);
                this.setState(
                    {
                        source: null,
                        playing: false,
                        quality: 720,
                        quaEl: null,
                        buffering: true,
                        status: 'Downloading...',
                        loaded: 0,
                        played: 0,
                        videoQuality: null
                    },
                    async () => getState(this)
                );
                break;
            case 480:
                if (this.state.torrentFile)
                    hsfetcher.destroyClient(this.state.torrentFile);
                this.setState(
                    {
                        source: null,
                        playing: false,
                        quality: 480,
                        quaEl: null,
                        buffering: true,
                        status: 'Downloading...',
                        loaded: 0,
                        played: 0,
                        videoQuality: null
                    },
                    async () => getState(this)
                );
                break;
            default:
                break;
        }
    };

    switchMode = () =>
        this.setState({torrent: !this.state.torrent}, async () => {
            const {torrent} = this.state;
            if (torrent) {
                await localForage.setItem('player-setting-torrent', true);
                if (this.state.torrentFile)
                    hsfetcher.destroyClient(this.state.torrentFile);
                this.setState(
                    {
                        source: null,
                        playing: false,
                        buffering: true,
                        status: 'Downloading...',
                        loaded: 0,
                        played: 0,
                        videoQuality: null
                    },
                    async () => getState(this)
                );
            } else {
                await localForage.setItem('player-setting-torrent', false);
                if (this.state.torrentFile)
                    hsfetcher.destroyClient(this.state.torrentFile);
                this.setState(
                    {
                        playing: false,
                        source: null,
                        buffering: true,
                        status: 'Loading...',
                        loaded: 0,
                        played: 0,
                        videoQuality: null
                    },
                    async () => getState(this)
                );
            }
        });

    render() {
        const {classes, mir, fullSize} = this.props;
        const {
            playing,
            buffering,
            source,
            duration,
            played,
            loaded,
            volume,
            rate,
            seeking,
            fullscreen,
            status,
            title,
            menuEl,
            eps,
            ep,
            showArtwork,
            showHeaders,
            showDesc,
            volEl,
            willLoadNextEp,
            counter,
            videoQuality,
            torrent,
            quaEl,
            quality
        } = this.state;
        const menu = Boolean(menuEl);
        const volumeMenu = Boolean(volEl);
        const qualityMenu = Boolean(quaEl);
        return (
          <div
            id="frame"
            style={!mir.play ? {display: 'none'} : null}
            className={!fullSize ? classes.rootSmol : classes.root}
            onMouseLeave={played === 1 ? null : this.hide}
            onMouseMove={this.reveal}
            onTouchMove={this.reveal}
          >
            {!fullSize ? (
              <div
                className={classes.pipcontrols}
                style={!loaded > 0 ? {opacity: 0} : null}
                id="pipcontrols"
              >
                <Typography type="title" style={{textAlign: 'center'}}>
                  {status} {loaded > 0 ? `EP ${ep}` : null}
                </Typography>
                <div style={{display: 'flex', margin: 'auto'}}>
                    {loaded > 0 ? <IconButton onClick={this.playPause}>
                    {playing ? <Icon.Pause /> : <Icon.PlayArrow />}
                    </IconButton> : null}
                  <IconButton onClick={() => this.props.history.push('/watch')}>
                    <Icon.PictureInPicture />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                                    this.props.removeDataFromMir(null);
                                    this.setState({
                                        playing: false,
                                        buffering: true,
                                        source: '',
                                        duration: 0,
                                        status: '',
                                        title: '',
                                        fullscreen: false,
                                        played: 0,
                                        loaded: 0,
                                        seeking: false,
                                        menu: false,
                                        rate: null,
                                        ep: 0,
                                        eps: [],
                                        error: false,
                                        menuEl: null,
                                        showId: 0,
                                        recentlyWatched: 0,
                                        volEl: null,
                                        counter: 5,
                                        torrent: false,
                                        quality: 480,
                                        torrentFile: null,
                                        quaEl: null,
                                        native: false
                                    });
                                }}
                  >
                    <Icon.Close />
                  </IconButton>
                </div>
              </div>
                ) : null}
            <div
              style={
                        !fullSize
                            ? {position: 'relative', height: 280, width: '100%'}
                            : null
                    }
            >
              <CircularProgress
                className={classes.loading}
                style={!buffering ? {opacity: 0} : null}
              />
            </div>
            <Toolbar
              id="backbutton"
              className={classes.backToolbar}
              style={!fullSize ? {display: 'none'} : null}
            >
              <IconButton
                style={{
                            marginLeft: -12,
                            marginRight: 20
                        }}
                onClick={() => this.props.history.goBack()}
              >
                <Icon.ArrowBack />
              </IconButton>
              {!playing && !source ? (
                <Typography type="title">{title}</Typography>
                    ) : null}
            </Toolbar>
            <ReactPlayer
              id="player"
              ref={player => {
                        this.player = player;
                    }}
              url={source}
              volume={volume}
              playing={playing}
              onProgress={this.onProgress}
              className={classes.player}
              width="100%"
              height="100%"
              onBuffer={this.onBuffer}
              onReady={() =>
                        this.setState({playing: true, buffering: false, status: title})
                    }
              onPause={() => this.setState({playing: false})}
              onEnded={this.handleEnded}
              onError={e => console.error(e)}
              onDuration={dura => this.setState({duration: dura})}
              style={played === 1 ? {filter: 'brightness(.2)'} : null}
            />
            {played === 1 ? (
              <FadeIn>
                <div className={classes.showInfo}>
                  <div className={classes.showInfoColumn}>
                    <img
                      src={showArtwork}
                      alt=""
                      className={classes.showInfoArtwork}
                      style={{opacity: 0}}
                      onLoad={e => e.currentTarget.style.opacity == null}
                    />
                  </div>
                  <div className={classes.showInfoColumn} style={{flex: 1}}>
                    <Typography type="display2" className={classes.showInfoTitle}>
                      {title}
                    </Typography>
                    <Divider />
                    <Typography
                      type="body1"
                      className={classes.showInfoDesc}
                      dangerouslySetInnerHTML={{__html: showDesc}}
                    />
                  </div>
                </div>
              </FadeIn>
                ) : null}
            <Card
              id="controls"
              className={classes.controlpanel}
              style={!fullSize ? {display: 'none'} : null}
            >
              <CardContent className={classes.indicator}>
                <LinearProgress
                  classes={{
                                root: classes.progress,
                                primaryColor: classes.progressBgOver,
                                primaryColorBar: classes.progressBar
                            }}
                  mode="determinate"
                  value={played * 100}
                  valueBuffer={loaded * 100}
                />
                <LinearProgress
                  classes={{
                                root: classes.progressLoaded,
                                primaryColor: classes.progressBg,
                                primaryColorBar: classes.progressBarLoaded
                            }}
                  mode="determinate"
                  value={loaded * 100}
                />
                <input
                  className={classes.progressInput}
                  type="range"
                  step="any"
                  max={0.999}
                  min={0}
                  value={played}
                  onMouseDown={this.onSeekMouseDown}
                  onChange={this.onSeekChange}
                  onMouseUp={this.onSeekMouseUp}
                />
              </CardContent>
              <CardActions>
                <IconButton
                  disabled={!!(loaded === 0 || !source)}
                  onClick={this.playPause}
                >
                  {playing ? (
                    <Icon.Pause />
                            ) : played === 1 ? (
                              <Icon.Replay />
                            ) : (
                              <Icon.PlayArrow />
                            )}
                </IconButton>
                <Typography type="title" className={!source ? classes.left : null}>
                  {status} {played > 0 && source ? ` Episode ${ep}` : null}
                </Typography>
                <div style={{flex: 1}} />
                {willLoadNextEp ? (
                  <div className={classes.nextWrapper}>
                    <Button
                      onClick={this.skipToNextEp}
                      className={classes.nextButton}
                    >
                                    Loading next episode in 5 seconds...
                    </Button>
                  </div>
                        ) : null}
                <IconButton
                  disabled={!torrent}
                  aria-owns={qualityMenu ? 'quality-menu' : null}
                  aria-haspopup="true"
                  onClick={e => this.setState({quaEl: e.currentTarget})}
                  color="contrast"
                >
                  {torrent ? (
                                quality === 480 ? (
                                  <Typography type="title" className={classes.qualityTitle}>
                                        480p
                                  </Typography>
                                ) : quality === 720 ? (
                                  <Typography type="title" className={classes.qualityTitle}>
                                        720p
                                  </Typography>
                                ) : quality === 1080 ? (
                                  <Typography type="title" className={classes.qualityTitle}>
                                        1080p
                                  </Typography>
                                ) : null
                            ) : (
                              <Typography
                                type="title"
                                style={torrent ? null : {opacity: '.2'}}
                                className={classes.qualityTitle}
                              >
                                {videoQuality ? `${videoQuality}p` : 'HD'}
                              </Typography>
                            )}
                </IconButton>
                <Typography type="body1" className={classes.duration}>
                  <Duration seconds={duration * played} />
                </Typography>
                <Menu
                  id="quality-menu"
                  anchorEl={quaEl}
                  anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                  transformOrigin={{
                                vertical: 'center',
                                horizontal: 'right'
                            }}
                  open={qualityMenu}
                  classes={{
                                paper: classes.menuPaper
                            }}
                  onClose={() => this.setState({quaEl: null})}
                  PaperProps={{
                                style: {
                                    width: 300,
                                    padding: 0,
                                    outline: 'none',
                                    background: grey[800]
                                }
                            }}
                  MenuListProps={{
                                style: {
                                    padding: 0,
                                    outline: 'none'
                                }
                            }}
                >
                  <Card style={{background: grey[800]}}>
                    <CardHeader style={{background: grey[900]}} title="Quality" />
                    <Divider />
                    <CardContent className={classes.epListCont}>
                      <MenuItem
                        onClick={() => this.changeQuality(1080)}
                        selected={quality === 1080}
                        className={classes.epListItem}
                      >
                                        1080p
                        <div style={{flex: 1}} />
                        {quality === 1080 ? <Icon.PlayArrow /> : null}
                      </MenuItem>
                      <MenuItem
                        onClick={() => this.changeQuality(720)}
                        selected={quality === 720}
                        className={classes.epListItem}
                      >
                                        720p
                        <div style={{flex: 1}} />
                        {quality === 720 ? <Icon.PlayArrow /> : null}
                      </MenuItem>
                      <MenuItem
                        onClick={() => this.changeQuality(480)}
                        selected={quality === 480}
                        className={classes.epListItem}
                      >
                                        480p
                        <div style={{flex: 1}} />
                        {quality === 480 ? <Icon.PlayArrow /> : null}
                      </MenuItem>
                    </CardContent>
                  </Card>
                </Menu>
                <IconButton
                  aria-owns={volumeMenu ? 'volume-menu' : null}
                  aria-haspopup="true"
                  onClick={e => this.setState({volEl: e.currentTarget})}
                  color="contrast"
                >
                  {volume > 0 ? <Icon.VolumeUp /> : <Icon.VolumeOff />}
                </IconButton>
                <Menu
                  id="volume-menu"
                  anchorEl={volEl}
                  anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                  transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                  open={volumeMenu}
                  onClose={() => this.setState({volEl: null})}
                  PaperProps={{
                                style: {
                                    outline: 'none',
                                    background: grey[800]
                                }
                            }}
                  MenuListProps={{
                                style: {
                                    padding: 8,
                                    outline: 'none'
                                }
                            }}
                >
                  <input
                    step="any"
                    type="range"
                    className={classes.volumeSlider}
                    max={1}
                    min={0}
                    value={volume}
                    onChange={this.setVolume}
                  />
                </Menu>
                <IconButton
                  disabled={
                                loaded === 0 ? (eps.length > 0 ? eps.length < ep : true) : false
                            }
                  onClick={this.skipToNextEp}
                >
                  <Icon.SkipNext />
                </IconButton>
                <IconButton disabled={loaded === 0} onClick={this.skip30Sec}>
                  <Icon.Forward30 />
                </IconButton>
                <IconButton onClick={this.handleFullscreen}>
                  {fullscreen ? <Icon.FullscreenExit /> : <Icon.Fullscreen />}
                </IconButton>
                <div>
                  <IconButton
                    disabled={!(eps.length > 0)}
                    aria-owns={menu ? 'ep-menu' : null}
                    aria-haspopup="true"
                    onClick={e => this.setState({menuEl: e.currentTarget})}
                    color="contrast"
                  >
                    <Icon.ViewList />
                  </IconButton>
                  <Menu
                    id="ep-menu"
                    anchorEl={menuEl}
                    anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}
                    transformOrigin={{
                                    vertical: 'center',
                                    horizontal: 'right'
                                }}
                    open={menu}
                    classes={{
                                    paper: classes.menuPaper
                                }}
                    onClose={this.closeMenu}
                    PaperProps={{
                                    style: {
                                        width: 300,
                                        padding: 0,
                                        outline: 'none',
                                        background: grey[800]
                                    }
                                }}
                    MenuListProps={{
                                    style: {
                                        padding: 0,
                                        outline: 'none'
                                    }
                                }}
                  >
                    <Card style={{background: grey[800]}}>
                      <CardHeader
                        style={{background: grey[900]}}
                        title="Episodes"
                      />
                      <Divider />
                      <CardContent className={classes.epListCont}>
                        {eps &&
                                        eps.map(e => (
                                          <MenuItem
                                            onClick={() => {
                                                    this.setState({ep: e.ep}, async () =>
                                                        loadEp(this, e, null)
                                                    );
                                                }}
                                            key={e.ep}
                                            selected={e.ep === ep}
                                            className={classes.epListItem}
                                          >
                                                Episode {e.ep}
                                            <div style={{flex: 1}} />
                                            {e.ep === ep ? <Icon.PlayArrow /> : null}
                                          </MenuItem>
                                        ))}
                      </CardContent>
                    </Card>
                  </Menu>
                </div>
                {/* <Tooltip
          PopperProps={{ PaperProps: { style: { fontSize: 16 } } }}
          title="Switch between Twist mode (recommended) or Nyaa mode (highly experimental)"
        >
          <FormGroup>
            <FormControlLabel
              disabled
              control={
                <Switch checked={torrent} onChange={this.switchMode} />
									}
              label={torrent ? 'Nyaa' : 'Twist'}
            />
          </FormGroup>
        </Tooltip> */}
              </CardActions>
            </Card>
          </div>
        );
    }
}

export const loadPlayer = play => ({
    type: MIR_PLAY_SHOW,
    play
});

const mapPTS = dispatch => ({
    removeDataFromMir: play => dispatch(loadPlayer(play))
});

export default firebaseConnect()(
    connect(({firebase: {profile}, mir}) => ({profile, mir}), mapPTS)(
        withStyles(style)(MirPlayer)
    )
);
