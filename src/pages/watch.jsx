import React, { Component } from "react";
import * as M from "material-ui";
import * as Icon from "material-ui-icons";
import { Database } from "../utils/firebase";
import Aqua3 from "../assets/aqua3.gif";
import Duration from "../components/yuplayer/Duration";
import ReactPlayer from "react-player";
import Twist from "../twist-api";
import Segoku from "../utils/segoku/segoku";
import localForage from "localforage";
import queryString from "query-string";
import corrector from "../utils/bigfuck";

import FadeIn from "react-fade-in";

const style = theme => ({
  root: {
    height: "100vh",
    width: "100%",
    position: "relative",
    top: 0,
    left: 0,
    overflow: "hidden"
  },
  player: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    background: "black"
  },
  controlpanel: {
    position: "fixed",
    bottom: theme.spacing.unit * 8,
    width: "calc(100% - 256px)",
    marginLeft: 128,
    marginRight: 128,
    background: M.colors.grey[800],
    boxShadow: "0 2px 32px rgba(0,0,0,.3)",
    transition: theme.transitions.create(["all"])
  },
  backToolbar: {
    paddingTop: theme.spacing.unit * 8,
    zIndex: 10,
    transition: theme.transitions.create(["all"])
  },
  indicator: {
    flexDirection: "row",
    padding: 0,
    display: "flex"
  },
  progress: {
    flex: 1
  },
  progressBg: {
    backgroundColor: M.colors.grey[900]
  },
  progressBar: {
    transition: "none"
  },
  duration: {
    padding: theme.spacing.unit
  },
  left: {
    padding: theme.spacing.unit
  },
  epListCont: {
    maxHeight: 300,
    overflowY: "scroll",
    padding: 0
  },
  epListItem: {},
  volumeSlider: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    outline: "none"
  },
  progressInput: {
    background: "transparent",
    position: "absolute",
    margin: "-5px 0",
    width: "100%",
    "-webkit-appearance": "none",
    outline: "none",
    transition: theme.transitions.create(["all"]),
    opacity: 0,
    "&:hover": {
      opacity: 1
    }
  }
});

class Watch extends Component {
  state = {
    playing: false,
    buffering: false,
    source: "",
    duration: 0,
    volume: 0.5,
    status: "Fetching...",
    title: "",
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
    recentlyWatched: Date.now(),
    volEl: null
  };

  player = HTMLMediaElement;

  componentWillMount = async () => {
    const playerVolume = await localForage.getItem("player-settings-volume");

    if (playerVolume) this.setState({ volume: playerVolume });
    else return;
  };

  componentDidMount = async () => {
    const id = queryString.parse(this.props.history.location.search);
    try {
      const { data } = await new Segoku().getSingle({ id: id.w });
      if (data) await this.getSource(data.Media);
    } catch (error) {
      console.error(error);
      this.setState({
        error: true,
        status: "Error 1: Failed to fetch metadata"
      });
    }
  };

  getSource = async data => {
    this.setState({
      title: data.title.english ? data.title.english : data.title.romaji,
      showId: data.id,
      showArtwork: data.coverImage.large,
      showDesc: data.description
    });
    const meta = this.props.twist.filter(
      s => s.name.toLowerCase() === corrector(data.title.romaji.toLowerCase())
    );
    console.log(meta);
    try {
      if (meta && meta[0].link) {
        const eps = await Twist.get(meta[0].link);
        if (eps) {
          this.setState({ eps, status: "Loading..." }, async () => {
            localForage
              .getItem("player-state")
              .then(a => {
                if (a.showId === this.state.showId) {
                  console.info("Metadata found.");
                  this.loadEp(this.state.eps[a.ep - 1], a.played);
                } else throw new Error("");
              })
              .catch(async a => {
                if (
                  this.props.user &&
                  this.props.user.episodeProgress[this.state.showId]
                ) {
                  console.info("No metadata found locally, attempting remote.");
                  this.loadEp(
                    this.state.eps[
                      this.props.user.episodeProgress[this.state.showId].ep
                    ],
                    this.props.user.episodeProgress[this.state.showId].played
                  );
                } else {
                  console.info(
                    "No metadata found locally and remotely, starting new session."
                  );
                  this.loadEp(this.state.eps[0], null);
                }
              });
          });
        }
      }
    } catch (error) {
      console.error(error);
      this.setState({
        error: true,
        status: "Error 2: Failed to load videodata."
      });
    }
  };

  loadEp = async (ep, resume) => {
    if (this.state.menuEl) {
      this.closeMenu();
    }
    const source = await Twist.getSource(ep.link);
    try {
      if (source) {
        this.setState({ source, ep: ep.ep }, () => {
          this.playPause();
          if (resume && this.state.loaded > 0) this.player.seekTo(resume);
        });
      }
    } catch (error) {
      console.error(error);
      this.setState({ error: true, status: "Error" });
    }
  };

  closeMenu = () => this.setState({ menuEl: null });

  onProgress = state => {
    const seekableEnd = this.player
      .getInternalPlayer()
      .seekable.end(this.player.getInternalPlayer().seekable.length - 1);

    if (!seekableEnd) this.setState({ buffering: true });
    else this.setState({ buffering: false });

    if (!this.state.seeking)
      this.setState(state, async () => {
        if (!this.state.menuEl && !this.state.volEl)
          await localForage.setItem("player-state", this.state);
      });
  };

  playPause = resume => {
    this.setState({ playing: !this.state.playing });
  };

  /*stop = () => {
        this.setState({ source: null, playing: false });
      };*/

  setVolume = e => {
    this.setState({ volume: parseFloat(e.target.value) }, async () => {
      await localForage.setItem("player-settings-volume", this.state.volume);
    });
  };

  mute = e => {
    let prevVol = this.state.volume;
    if (this.state.volume > 0) {
      this.setState({ volume: 0 });
    } else {
      this.setState({ volume: prevVol });
    }
  };

  setPlaybackRate = e => {
    this.setState({ playbackRate: parseFloat(e.target.value) });
  };

  onSeekMouseDown = e => {
    this.setState({ seeking: true });
  };

  onSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) });
  };

  onSeekMouseUp = e => {
    this.setState({ seeking: false });
    this.player.seekTo(parseFloat(e.target.value));
  };

  skip30Sec = () => {
    this.player.seekTo(this.state.played + 18 / 1000, null);
  };

  skipToNextEp = () => {
    let nextEp = this.state.ep;
    this.loadEp(this.state.eps[nextEp++], null);
  };

  onBuffer = () => {
    this.setState({ buffering: true, status: "Buffering..." }, () => {});
  };

  inactivityTimeout;

  mouseResetDelay = () => {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.hide();
    }, 4000);
  };

  reveal = event => {
    let back = document.getElementById("backbutton");
    let controls = document.getElementById("controls");
    let player = document.getElementById("player");
    if (back && controls && player) {
      back.style.opacity = 1;
      controls.style.opacity = 1;
      player.style.cursor = "initial";
      this.mouseResetDelay();
    }
  };

  hide = () => {
    let back = document.getElementById("backbutton");
    let controls = document.getElementById("controls");
    let player = document.getElementById("player");
    if (back && controls && player && this.state.loaded > 0) {
      player.style.cursor = "none";
      back.style.opacity = 0;
      controls.style.opacity = 0;
    }
  };

  handleFullscreen = e =>
    this.setState({ fullscreen: !this.state.fullscreen }, () => {
      var docElm = document.documentElement;
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

  componentWillUnmount = async () => {
    if (this.props.user) {
      const episodePro = Database.ref("users")
        .child(`${this.props.user.userID}`)
        .child("episodeProgress");
      localForage.getItem("player-state").then(async a => {
        if (a && a.showId) episodePro.child(`${a.showId}`).update(a);
      });
    }
  };

  render() {
    const { classes, user, history, meta } = this.props;
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
      volEl
    } = this.state;
    const menu = Boolean(menuEl);
    const volumeMenu = Boolean(volEl);
    return (
      <div
        id="frame"
        className={classes.root}
        onMouseLeave={this.hide}
        onMouseMove={this.reveal}
        onTouchMove={this.reveal}
      >
        <M.Toolbar id="backbutton" className={classes.backToolbar}>
          <M.IconButton onClick={() => this.props.history.goBack()}>
            <Icon.ArrowBack />
          </M.IconButton>
          {!playing && !source ? (
            <M.Typography type="title">{title}</M.Typography>
          ) : null}
        </M.Toolbar>
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
            this.setState({ playing: true, buffering: false, status: title })
          }
          onPause={() => this.setState({ playing: false })}
          /*onPlay={() => {
                this.setState({ playing: true });
              }}*/
          /*onEnded={() => this.setState({ playing: false })}*/
          onError={e => console.error(e)}
          onDuration={duration => this.setState({ duration })}
        />
        <M.Card id="controls" className={classes.controlpanel}>
          <M.CardContent className={classes.indicator}>
            <M.LinearProgress
              classes={{
                root: classes.progress,
                primaryColor: classes.progressBg,
                primaryColorBar: classes.progressBar
              }}
              mode={buffering ? "buffer" : "determinate"}
              value={played * 100}
              valueBuffer={loaded * 100}
            />
            <input
              className={classes.progressInput}
              type="range"
              step="any"
              max={1}
              min={0}
              value={played}
              onMouseDown={this.onSeekMouseDown}
              onChange={this.onSeekChange}
              onMouseUp={this.onSeekMouseUp}
            />
          </M.CardContent>
          <M.CardActions>
            {source ? (
              <M.IconButton onClick={this.playPause}>
                {playing ? (
                  loaded === 0 ? (
                    <M.CircularProgress />
                  ) : (
                    <Icon.Pause />
                  )
                ) : (
                  <Icon.PlayArrow />
                )}
              </M.IconButton>
            ) : null}
            <M.Typography
              type="title"
              className={!source ? classes.left : null}
            >
              {status}
            </M.Typography>
            <div style={{ flex: 1 }} />
            <M.Typography type="body1" className={classes.duration}>
              <Duration seconds={duration * played} />
            </M.Typography>
            <M.IconButton
              aria-owns={volumeMenu ? "volume-menu" : null}
              aria-haspopup="true"
              onClick={e => this.setState({ volEl: e.currentTarget })}
              color="contrast"
            >
              {volume > 0 ? <Icon.VolumeUp /> : <Icon.VolumeOff />}
            </M.IconButton>
            <M.Menu
              id="volume-menu"
              anchorEl={volEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "right"
              }}
              open={volumeMenu}
              onRequestClose={() => this.setState({ volEl: null })}
              PaperProps={{
                style: {
                  outline: "none",
                  background: M.colors.grey[800]
                }
              }}
              MenuListProps={{
                style: {
                  padding: 8,
                  outline: "none"
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
            </M.Menu>
            <M.IconButton onClick={this.skipToNextEp}>
              <Icon.SkipNext />
            </M.IconButton>
            <M.IconButton onClick={this.skip30Sec}>
              <Icon.Forward30 />
            </M.IconButton>
            <M.IconButton onClick={this.handleFullscreen}>
              {fullscreen ? <Icon.FullscreenExit /> : <Icon.Fullscreen />}
            </M.IconButton>
            {eps.length > 0 ? (
              <div>
                <M.IconButton
                  aria-owns={menu ? "ep-menu" : null}
                  aria-haspopup="true"
                  onClick={e => this.setState({ menuEl: e.currentTarget })}
                  color="contrast"
                >
                  <Icon.ViewList />
                </M.IconButton>
                <M.Menu
                  id="ep-menu"
                  anchorEl={menuEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  transformOrigin={{
                    vertical: "center",
                    horizontal: "right"
                  }}
                  open={menu}
                  onRequestClose={this.closeMenu}
                  PaperProps={{
                    style: {
                      width: 300,
                      padding: 0,
                      outline: "none",
                      background: M.colors.grey[800]
                    }
                  }}
                  MenuListProps={{
                    style: {
                      padding: 0,
                      outline: "none"
                    }
                  }}
                >
                  <M.Card style={{ background: M.colors.grey[800] }}>
                    <M.CardHeader
                      style={{ background: M.colors.grey[900] }}
                      title="Episodes"
                    />
                    <M.Divider />
                    <M.CardContent className={classes.epListCont}>
                      {eps &&
                        eps.map((e, i) => (
                          <M.MenuItem
                            onClick={() => {
                              this.setState({ ep: e.ep }, async () =>
                                this.loadEp(e, null)
                              );
                            }}
                            key={i}
                            selected={e.ep === ep}
                            className={classes.epListItem}
                          >
                            Episode {e.ep}
                            <div style={{ flex: 1 }} />
                            {e.ep === ep ? <Icon.PlayArrow /> : null}
                          </M.MenuItem>
                        ))}
                    </M.CardContent>
                  </M.Card>
                </M.Menu>
              </div>
            ) : null}
          </M.CardActions>
        </M.Card>
      </div>
    );
  }
}

export default M.withStyles(style)(Watch);
