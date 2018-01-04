/**
 * Yu Player - React-Player fork designed for Yura.
 * thoralf21@gmail.com
 */

import * as React from "react";
import ReactPlayer from "react-player";
import Duration from "./Duration";
import screenfull from "screenfull";
import * as Moment from "moment";
import "./yu.css";
import * as localForage from "localforage";
import Grid from "material-ui/Grid";
import Card from "material-ui/Card";
import { Database } from "../../utils/firebase";
import Twist from "../../twist-api";
import Segoku from "../../utils/segoku/segoku";
import Y from "../../utils/y";
import queryString from "query-string";
import { withStyles } from "material-ui/styles";

const styles = theme => ({
  root: {
    position: "relative",
    overFlow: "hidden",
    fontFamily: "Roboto"
  },
});

// TODO - proper quality settings, more modular structure in case of usage outside of yura

class Yu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      fullscreen: false,
      played: 0,
      loaded: 0,
      volume: 0.5,
      duration: 0,
      playbackRate: 1.0,
      buffering: true,
      menuOpen: false,
      theater: false,
      currentEp: 0,
      currentURL: "",
      showWatermark: true,
      resumeMenu: false,
      recentlyWatched: "",
      parsingError: false,
      anime: null,
      user: this.props.user,
      pip: false
    };
  }

  componentWillMount = async () => {
    const streamDate = Moment().toISOString();
    this.setState({ recentlyWatched: streamDate });

    const playerVolume = await localForage.getItem("player-settings-volume");

    if (playerVolume) this.setState({ volume: playerVolume });
    else return;

    localForage
      .getItem("player-settings-volume")
      .then(a => {
        this.setState({ volume: a });
      })
      .catch(e => {});

    localForage
      .getItem("player-settings-watermark")
      .then(a => {
        this.setState({ showWatermark: a });
      })
      .catch(e => {});
    if (this.state.active) {
      if (!this.state.anime) {
        document.getElementById("yu-toolbar").classList.add("inactive");
      } else document.getElementById("yu-toolbar").classList.remove("inactive");
      if (!this.state.anime) {
        if (document.getElementById("playindi")) {
          document.getElementById("playindi").style.opacity = "0";
        } else if (document.getElementById("playindi")) {
          document.getElementById("playindi").style.opacity = "1";
        }
      }
    }
  };

  componentDidMount = async () => {

      let id = queryString.parse(this.props.history.location.search);
            const { data } = await new Segoku().getSingle({ id: id.s });
            if (data) {
              const anime = await new Y(
                data.Media.title.romaji,
                data.Media.coverImage.large,
                data.Media.id,
                data.Media.description,
                data.Media.title.english
              ).init();
              if (anime) {
                this.setState({ anime }, async () => this.askToResume());
              }
            }
          };

  indi = () => {
    let pIndi = document.getElementById("playindi");
    pIndi.style.opacity = "1";
    setTimeout(() => {
      pIndi.style.opacity = "0";
    }, 300);
  };
  playPause = () => {
    this.indi();
    this.setState({ playing: !this.state.playing });
  };
  stop = () => {
    this.setState({ url: null, playing: false });
  };
  // TODO - When the mouse is hovered over the volume button and slider, make the super-small border between them both not avaliable to the pointer.
  setVolume = e => {
    this.setState({ volume: parseFloat(e.target.value) }, async () => {
      await localForage.setItem("player-settings-volume", this.state.volume);
    });
  };
  mute = e => {
    if (this.state.volume > 0) {
      this.setState({ volume: 0 });
    } else {
      this.setState({ volume: 0.5 });
    }
  };
  setPlaybackRate = e => {
    console.log(parseFloat(e.target.value));
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
  onProgress = state => {
    if (!this.state.seeking) {
      this.setState(state, async () => {
        if (!this.state.resumeMenu) {
          await localForage.setItem("player-metadata", this.state);
        }
      });
    }
  };
  onClickFullscreen = e => {
    if (screenfull.enabled) {
      screenfull.toggle(document.getElementById("yu"));
      this.setState({ fullscreen: !this.state.fullscreen });
    }
  };
  onClickTheaterMode = e => {
    this.setState({ theater: !this.state.theater });
  };
  onClickMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen }, () => {
      if (this.state.menuOpen) {
        document.getElementById("menuPanel").classList.add("visible");
        document.querySelector(".yu-container").classList.add("menuOpen");
        document.getElementById("yu-toolbar").classList.add("menuOpen");
      } else {
        document.getElementById("menuPanel").classList.remove("visible");
        document.querySelector(".yu-container").classList.remove("menuOpen");
        document.getElementById("yu-toolbar").classList.remove("menuOpen");
      }
    });
  };
  revealPlayer = e => {
    document.getElementById("yu-filename").style.opacity = 1;
    document.getElementById("yu-toolbar").style.opacity = 1;
  };
  hidePlayer = e => {
    if (!this.state.currentURL) {
      document.getElementById("yu-toolbar").style.opacity = 1;
      document.getElementById("yu-filename").style.opacity = 1;
    } else {
      document.getElementById("yu-toolbar").style.opacity = 0;
      document.getElementById("yu-filename").style.opacity = 0;
      document.getElementById("yu").style.borderRadius = 0;
    }
  };
  buffering = e => {
    this.setState({ buffering: true }, () => {
      this.indi();
    });
  };

  // TODO - Leave a less shitty delay on skipping (currently lags a little when skipping)
  backTenSec = () => {
    this.player.seekTo(this.state.played - 6 / 1000);
  };
  skipTenSec = () => {
    this.player.seekTo(this.state.played + 6 / 1000);
  };
  skipToNextEp = () => {
    let nextEp = this.state.currentEp;
    this.loadEp(this.state.anime.data[nextEp++], null);
  };
  skipToPrevEp = () => {
    let prevEp = this.state.currentEp;
    this.loadEp(this.state.anime.data[prevEp - 2], null);
  };

  // TODO - If the source fucks up, please trigger a error and show it so the user isn't left all confused like Dahlia in every single conversation on fucking AD.
  loadEp = async (e, resume) => {
    if (this.state.menuOpen) this.onClickMenu();
    this.setState({ currentURL: null }, async () => {
      try {
        const owo = await Twist.getSource(e.link);
        console.log(owo);
        if (owo)
          this.setState(
            {
              currentURL: owo,
              currentEp: e.ep,
              parsingError: false
            },
            async () => {
              console.log(e);
              if (resume) this.player.seekTo(resume);
            }
          );
        else throw new Error("Parsing error");
      } catch (error) {
        console.error(error);
        this.setState({ parsingError: true });
      }
    });
  };
  askToResume = async () => {
    localForage
      .getItem("player-metadata")
      .then(a => {
        if (a.anime.meta.i === this.state.anime.meta.i) {
          this.loadEp(this.state.anime.data[a.currentEp - 1], a.played);
        } else throw new Error("");
      })
      .catch(async s => {
        console.log(this.state.anime);
        if (this.state.user.episodeProgress) {
          if (
            this.state.user.episodeProgress.hasOwnProperty(
              this.state.anime.meta.i
            )
          ) {
            this.loadEp(
              this.state.anime.data[
                this.state.user.episodeProgress[this.state.anime.meta.i]
                  .currentEp - 1
              ],
              this.state.user.episodeProgress[this.state.anime.meta.i].played
            );
          } else this.loadEp(this.state.anime.data[0]);
        } else {
          this.loadEp(this.state.anime.data[0]);
        }
      });
  };
  toggleWatermark = async () =>
    this.setState({ showWatermark: !this.state.showWatermark }, async () => {
      await localForage.setItem(
        "player-settings-watermark",
        this.state.showWatermark
      );
    });
  componentWillUnmount = async () => {
    if (this.state.user) {
      const episodePro = Database.ref("users")
        .child(`${this.state.user.userID}`)
        .child("episodeProgress");
      localForage
        .getItem("player-metadata")
        .then(async a => episodePro.child(`${a.anime.meta.i}`).update(a));
    }
  };
  render() {
    const {
      playing,
      fullscreen,
      loaded,
      volume,
      duration,
      playbackRate,
      buffering,
      played,
      menuOpen,
      theater,
      currentEp,
      currentURL,
      showWatermark,
      resumeMenu,
      parsingError,
      anime,
      user,
      pip,
      active
    } = this.state;
    const { props } = this;
    return (
      <div
        id="yu"
        className={
          fullscreen
            ? "yu full"
            : theater ? "yu theater" : pip ? "yu pip" : 'yu'
        }
        onMouseEnter={this.revealPlayer}
        onMouseLeave={this.hidePlayer}
      >
        {pip ? (
          <div
            id="yu-pip-close"
            onClick={() =>
              this.setState({
                active: false,
                anime: null,
                currentURL: "",
                currentEp: 0,
                pip: true
              })
            }
          >
            <span>{anime && anime.meta.t}</span>
            <i className="mdi mdi-close" />
          </div>
        ) : null}
        <div className="yu-container" onClick={this.playPause}>
          {currentURL ? (
            showWatermark ? (
              <div id="yu-channel">
                {anime && anime.data ? (
                  anime.data[currentEp - 1].provider.includes("yura") ? (
                    <i className="mdi mdi-circle" />
                  ) : anime.data[currentEp - 1].provider.includes("Twist") ? (
                    <TwistLogo />
                  ) : (
                    ""
                  )
                ) : null}
              </div>
            ) : null
          ) : null}
          <div id="yu-filename">
            {currentURL
              ? anime.data[currentEp - 1].name.includes("Movie")
                ? `${anime.meta.t ? anime.meta.t : anime.meta.r}`
                : `Episode ${currentEp} of ${
                    anime.meta.t ? anime.meta.t : anime.meta.r
                  }`
              : parsingError ? "Parsing error" : "Loading episode..."}
            <br />
            {currentURL ? (
              <span>
                Provider:{" "}
                {anime.data ? anime.data[currentEp - 1].provider : null}
              </span>
            ) : null}
          </div>
          <div id="playindi">
            <i
              className={
                buffering
                  ? "mdi spinner"
                  : playing ? "mdi mdi-play" : "mdi mdi-pause"
              }
            />
          </div>
          <ReactPlayer
            id="yu-renderer"
            width="100%"
            height="100%"
            url={currentURL}
            playing={playing}
            playbackRate={playbackRate}
            volume={volume}
            onStart={() =>
              this.setState(
                { buffering: false, playing: true },
                () => (document.getElementById("playindi").style.opacity = 0)
              )
            }
            onBuffer={this.buffering}
            onReady={() => this.setState({ playing: true, buffering: false })}
            onPause={() => this.setState({ playing: false })}
            onPlay={() => {
              this.setState({ playing: true }, () => this.indi());
            }}
            onEnded={() => this.setState({ playing: false })}
            onError={e => console.error(e)}
            onProgress={this.onProgress}
            onDuration={duration => this.setState({ duration })}
            ref={player => {
              this.player = player;
            }}
          />
        </div>
        <div
          id="yu-toolbar"
          className="yu-toolbar"
          style={currentURL ? null : { display: "none" }}
        >
          <section className="seeker">
            <input
              type="range"
              step="any"
              onMouseDown={this.onSeekMouseDown}
              onChange={this.onSeekChange}
              onMouseUp={this.onSeekMouseUp}
              min={0}
              max={0.999}
              value={played}
              id="lengthSeeker"
            />
            <progress className="progress" value={played} min={0} max={0.999}>
              <span id="progress-bar" />
            </progress>
            <progress
              className="progress buffering"
              value={loaded}
              min={0}
              max={0.999}
            >
              <span id="progress-bar" />
            </progress>
          </section>
          <section>
            {currentEp === 1 ? null : (
              <button
                data-tip="Skip to previous episode"
                className="yu-button"
                onClick={this.skipToPrevEp}
              >
                <i className="mdi mdi-skip-previous" />
              </button>
            )}
            <button
              data-tip="Go back 10 seconds"
              className="yu-button"
              onClick={this.backTenSec}
            >
              <i className="mdi material-icons">replay_10</i>
            </button>
            <button
              data-tip="Play/pause"
              className="yu-button"
              onClick={this.playPause}
            >
              <i className={playing ? "mdi mdi-pause" : "mdi mdi-play"} />
            </button>
            <button
              data-tip="Go forward by 10 seconds"
              className="yu-button"
              onClick={this.skipTenSec}
            >
              <i className="mdi material-icons">forward_10</i>
            </button>
            {anime && currentEp === anime.data.length ? null : (
              <button
                data-tip="Skip ahead to next episode"
                className="yu-button"
                onClick={this.skipToNextEp}
              >
                <i className="mdi mdi-skip-next" />
              </button>
            )}
            <button
              data-tip="Mute volume"
              id="volume-button"
              className="yu-button"
              onClick={this.mute}
            >
              <i
                className={
                  volume > 0
                    ? volume === 1
                      ? "mdi mdi-volume-high"
                      : "mdi mdi-volume-medium"
                    : "mdi mdi-volume-low"
                }
              />
            </button>
            <div data-tip="Change volume" className="yu-volume-slider">
              <input
                type="range"
                step="any"
                onChange={this.setVolume}
                min={0}
                max={1}
                value={volume}
              />
              <progress className="progress" value={volume} min={0} max={1}>
                <span id="progress-bar" />
              </progress>
            </div>
            <div className="yu-time">
              <Duration seconds={duration * played} /> /{" "}
              <Duration seconds={duration} />
            </div>
            <div style={{ flexGrow: 1 }} />
            <button
              data-tip="Show provider watermark"
              className="yu-button"
              onClick={this.toggleWatermark}
            >
              <i
                className={
                  showWatermark
                    ? "mdi mdi-toggle-switch"
                    : "mdi mdi-toggle-switch-off"
                }
              />
            </button>
            <button
              data-tip="Fullscreen mode"
              className="yu-button"
              onClick={this.onClickFullscreen}
            >
              <i
                className={
                  fullscreen ? "mdi mdi-fullscreen-exit" : "mdi mdi-fullscreen"
                }
              />
            </button>
            {currentURL ? (
              anime.data[currentEp - 1].name.includes(
                "Movie"
              ) ? null : resumeMenu ? null : (
                <button
                  data-tip="Episode list"
                  className="yu-button"
                  onClick={this.onClickMenu}
                >
                  <i className={menuOpen ? "mdi mdi-close" : "mdi mdi-apps"} />
                </button>
              )
            ) : null}
          </section>
        </div>
        <div id="menuPanel">
          <div
            style={{
              padding: 16,
              display: "flex",
              flexFlow: "column wrap",
              height: "inherit",
              overflow: "hidden"
            }}
          >
            <h1>Episodes</h1>
            <Grid container className="horiPadding vertPadding" spacing={8}>
              {anime && anime.data
                ? anime.data.map((p, i) => (
                    <Grid
                      item
                      xs
                      className={
                        currentEp === p.ep ? "ep-link current" : "ep-link"
                      }
                      key={i}
                      onClick={() => this.loadEp(p)}
                    >
                      <div>
                        <Card>{p.ep}</Card>
                      </div>
                    </Grid>
                  ))
                : null}
            </Grid>
            <div style={{ flexGrow: 1 }} />
          </div>
        </div>
      </div>
    );
  }
}

const TwistLogo = props => (
  <svg viewBox="0 0 16 10">
    <polygon points="0,10 5,0 10,10 9,10 5,2 1,10" />
    <polygon points="11,10 6,0 16,0 15.5,1 7.5,1 11.5,9" />
  </svg>
);

export default withStyles(styles)(Yu);
