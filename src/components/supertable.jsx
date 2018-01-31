import React from "react";
import PropTypes from "prop-types";
import * as M from "material-ui";
import * as Icon from "material-ui-icons";
import Dotdotdot from "react-dotdotdot";
import Slider from "react-slick";

import { connect } from "react-redux";
import { push } from "react-router-redux";
import GridList from "material-ui/GridList/GridList";
import GridListTile from "material-ui/GridList/GridListTile";
import moment from 'moment';

const style = theme => ({
  bigCard: {
    display: "flex",
    '& > div': {
      width: '100%',
      boxShadow: "0 2px 18px rgba(0,0,0,.4)",
      background: "rgba(255,255,255,0)",
      boxSizing: "border-box",
      transition: theme.transitions.create(["all"]),
      position: "relative",
      overflow: 'hidden',
      cursor: 'default',
      "&:hover": {
        background: `rgba(0,55,230,.3)`
      },
      "&:hover > div:nth-of-type(2) > img": {
        zIndex: 200,
        margin: theme.spacing.unit * 2
      },
      margin: 'auto'
    },
    overflowX: 'hidden',
  },
  bigCardIcon: {
    background: "white",
    zIndex: 4,
    width: 182,
    boxShadow: "0 3px 24px rgba(0,0,0,.6)",
    objectFit: "cover",
    marginRight: theme.spacing.unit * 2,
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      filter: "brightness(0.8)"
    }
  },
  bigCardImage: {
    position: "absolute",
    height: "100%",
    width: "100%",
    objectFit: "cover",
    top: 0,
    left: 0,
    display: "inline-block",
    background: "rgba(0,0,0,.7)"
  },
  bigCardImageImg: {
    position: "relative",
    height: "100%",
    width: "100%",
    objectFit: "cover",
    top: 0,
    left: 0,
    zIndex: -1,
    display: "block"
  },
  bigCardRow: {
    display: "flex",
    zIndex: 3,
    position: "absolute",
    width: "100%",
    margin: 'auto',
    height: '100%'
  },
  bigCardTitle: {
    zIndex: 3,
    color: "white",
    fontWeight: 700,
    fontSize: 32,
    textShadow: "0 3px 20px rgba(0,0,0,.87)",
    userSelect: 'none',
    cursor: 'default'
  },
  bigCardText: {
    display: "flex",
    flexDirection: "column",
    margin: "auto 0",
    userSelect: 'none',
    cursor: 'default'
  },
  bigCardSmallTitle: {
    zIndex: 3,
    color: "white",
    fontWeight: 400,
    marginTop: theme.spacing.unit,
    lineHeight: 1,
    fontSize: 18,
    textShadow: "0 3px 20px rgba(0,0,0,.7)",
    userSelect: 'none',
    cursor: 'default'
  },
  bigCardVerySmallTitle: {
    zIndex: 3,
    color: "white",
    fontWeight: 700,
    fontSize: 14,
    textShadow: "0 3px 20px rgba(0,0,0,.7)",
    marginBottom: theme.spacing.unit,
    textTransform: "uppercase",
    userSelect: 'none',
    cursor: 'default'
  },
  dotdot: {
    overflow: "initial !important"
  },
  list: {
    flexFlow: 'row nowrap',
    width: '100%',
    margin: 0,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    transform: 'translateZ(0)',
  }
});

export const timeFormatter = time => {
  let sec_num = parseInt(time, 10); // don't forget the second param
  let hours = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - hours * 3600) / 60);
  let seconds = sec_num - hours * 3600 - minutes * 60;
  let days = Math.floor(sec_num / (3600 * 24));

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (hours === '00') {
    hours = null;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  if (days === 0) {
    days = null;
  }

  return (
    (days ? days + (days > 1 ? " days " : " day ") : "") +
    (hours ? hours +
      " hr " : '') +
    minutes +
    " min"
  );
};

export const timeFormatToReadable = time => {
  return new Date(time).toDateString();
};

export const timeFormatToReadableTime = time => {
  return new Date(time).toLocaleTimeString();
};

const SuperTable = ({ classes, ...props }) => {
  if (props.typeof === 'later') {
    return (<GridList className={classes.list} cellHeight={300}>
      {props.data.splice(0, props.limit).map((anime, index) => (
        <GridListTile className={classes.bigCard} key={index} onClick={() =>
          props.changePage(
            `/show?${props.type}=${anime.id
            }`
          )
        }>
          <div className={classes.bigCardImage} style={anime.bg ? anime.bg.startsWith('#') ? { background: anime.bg } : null : null}>
            {anime.bg && !anime.bg.startsWith('#') ? <img
              src={
                anime.bg ? anime.bg.startsWith('#') ? '' : anime.bg : ''
              }
              alt=""
              className={classes.bigCardImageImg}
            /> : null}
          </div>
          <div className={classes.bigCardRow}>
            <img
              src={
                anime.image
              }
              alt=""
              className={classes.bigCardIcon}
            />
            <div className={classes.bigCardText}>
              <M.Typography
                type="display2"
                className={classes.bigCardVerySmallTitle}
              >
                {anime.avgScore ? `Score ${anime.avgScore}%` : null} {anime.rank ? `• #${anime.rank.rank + ' ' + anime.rank.context + ' ' + anime.rank.format}` : null}
              </M.Typography>
              <Dotdotdot clamp={2} className={classes.dotdot}>
                <M.Typography
                  type="display2"
                  className={classes.bigCardTitle}
                >
                  {anime.name}
                </M.Typography>
                <M.Typography
                  type="display2"
                  className={classes.bigCardSmallTitle}
                >
                  Added {moment(anime.date).from(Date.now())}
                </M.Typography>
              </Dotdotdot>
            </div>
          </div>
        </GridListTile>
      ))}
    </GridList>)
  } else if (props.typeof === 'ranking') {
    return (<GridList className={classes.list} cellHeight={300}>
      {props.data.splice(0, props.limit).map((anime, index) => (
        <GridListTile className={classes.bigCard} key={index} onClick={() =>
          props.changePage(
            `/show?${props.type}=${
            props.typeof === "progress"
              ? anime.anime ? anime.anime.meta.i : anime.showId
              : anime.id
            }`
          )
        }>
          <div className={classes.bigCardImage}>
            <img
              src={
                props.typeof === "ongoing"
                  ? anime.bannerImage ? anime.bannerImage : anime.coverImage.large
                  : props.typeof === "ranking"
                    ? anime.bg
                    : props.typeof === "progress"
                      ? anime.anime
                        ? anime.anime.meta.a
                        : anime.showHeaders
                          ? anime.showHeaders
                          : anime.showArtwork
                      : props.typeof === "favs" ? anime.image : null
              }
              alt=""
              className={classes.bigCardImageImg}
            />
          </div>
          <div className={classes.bigCardRow}>
            <img
              src={
                props.typeof === "ongoing"
                  ? anime.coverImage.large
                  : props.typeof === "ranking"
                    ? anime.bg
                    : props.typeof === "progress"
                      ? anime.anime ? anime.anime.meta.a : anime.showArtwork
                      : props.typeof === "favs" ? anime.image : null
              }
              alt=""
              className={classes.bigCardIcon}
            />
            <div className={classes.bigCardText}>
              <M.Typography
                type="display2"
                className={classes.bigCardVerySmallTitle}
              >
                {props.typeof === "ranking" ? (
                  <span role="img" aria-label="emoji">
                    {anime.emoji}
                  </span>
                ) : null}
                {props.typeof === "ongoing"
                  ? props.type.includes("m")
                    ? null
                    : timeFormatter(anime.nextAiringEpisode.timeUntilAiring) +
                    " till Episode " +
                    anime.nextAiringEpisode.episode
                  : props.typeof === "ranking"
                    ? anime.category
                    : props.typeof === "progress"
                      ? anime.ep ? "EPISODE " + anime.ep : null
                      : null}
              </M.Typography>
              <Dotdotdot clamp={2} className={classes.dotdot}>
                <M.Typography
                  type="display2"
                  className={classes.bigCardTitle}
                >
                  {props.typeof === "ongoing"
                    ? anime.title.english
                      ? anime.title.english
                      : anime.title.romaji
                    : props.typeof === "ranking"
                      ? anime.name
                      : props.typeof === "progress"
                        ? anime.anime
                          ? anime.anime.meta.t
                            ? anime.anime.meta.t
                            : anime.anime.meta.r
                          : anime.title
                        : props.typeof === "favs" ? anime.name : null}
                </M.Typography>
              </Dotdotdot>
              <Dotdotdot clamp={3}>
                <M.Typography
                  type="display2"
                  className={classes.bigCardSmallTitle}
                  dangerouslySetInnerHTML={
                    props.typeof === "ongoing"
                      ? {
                        __html: anime.description
                      }
                      : props.typeof === "ranking"
                        ? {
                          __html: anime.desc
                        }
                        : null
                  }
                >
                  {props.typeof === "progress"
                    ? "Last watched " +
                    moment(anime.recentlyWatched).from(Date.now())
                    : null}
                </M.Typography>
              </Dotdotdot>
            </div>
          </div>
        </GridListTile>
      ))}
    </GridList>)
  } else if (props.typeof === 'progress') {
    return (<GridList className={classes.list} cellHeight={300}>
      {props.data.splice(0, props.limit).map((anime, index) => (
        <GridListTile className={classes.bigCard} key={index} onClick={() =>
          props.changePage(
            `/show?${props.type}=${
            props.typeof === "progress"
              ? anime.anime ? anime.anime.meta.i : anime.showId
              : anime.id
            }`
          )
        }>
          <div className={classes.bigCardImage}>
            <img
              src={
                props.typeof === "ongoing"
                  ? anime.bannerImage ? anime.bannerImage : anime.coverImage.large
                  : props.typeof === "ranking"
                    ? anime.bg
                    : props.typeof === "progress"
                      ? anime.anime
                        ? anime.anime.meta.a
                        : anime.showHeaders
                          ? anime.showHeaders
                          : anime.showArtwork
                      : props.typeof === "favs" ? anime.image : null
              }
              alt=""
              className={classes.bigCardImageImg}
            />
          </div>
          <div className={classes.bigCardRow}>
            <img
              src={
                props.typeof === "ongoing"
                  ? anime.coverImage.large
                  : props.typeof === "ranking"
                    ? anime.bg
                    : props.typeof === "progress"
                      ? anime.anime ? anime.anime.meta.a : anime.showArtwork
                      : props.typeof === "favs" ? anime.image : null
              }
              alt=""
              className={classes.bigCardIcon}
            />
            <div className={classes.bigCardText}>
              <M.Typography
                type="display2"
                className={classes.bigCardVerySmallTitle}
              >
                {props.typeof === "ranking" ? (
                  <span role="img" aria-label="emoji">
                    {anime.emoji}
                  </span>
                ) : null}
                {props.typeof === "ongoing"
                  ? props.type.includes("m")
                    ? null
                    : timeFormatter(anime.nextAiringEpisode.timeUntilAiring) +
                    " till Episode " +
                    anime.nextAiringEpisode.episode
                  : props.typeof === "ranking"
                    ? anime.category
                    : props.typeof === "progress"
                      ? anime.ep ? "EPISODE " + anime.ep : null
                      : null}
              </M.Typography>
              <Dotdotdot clamp={2} className={classes.dotdot}>
                <M.Typography
                  type="display2"
                  className={classes.bigCardTitle}
                >
                  {props.typeof === "ongoing"
                    ? anime.title.english
                      ? anime.title.english
                      : anime.title.romaji
                    : props.typeof === "ranking"
                      ? anime.name
                      : props.typeof === "progress"
                        ? anime.anime
                          ? anime.anime.meta.t
                            ? anime.anime.meta.t
                            : anime.anime.meta.r
                          : anime.title
                        : props.typeof === "favs" ? anime.name : null}
                </M.Typography>
              </Dotdotdot>
              <Dotdotdot clamp={3}>
                <M.Typography
                  type="display2"
                  className={classes.bigCardSmallTitle}
                  dangerouslySetInnerHTML={
                    props.typeof === "ongoing"
                      ? {
                        __html: anime.description
                      }
                      : props.typeof === "ranking"
                        ? {
                          __html: anime.desc
                        }
                        : null
                  }
                >
                  {props.typeof === "progress"
                    ? "Last watched " +
                    moment(anime.recentlyWatched).from(Date.now())
                    : null}
                </M.Typography>
              </Dotdotdot>
            </div>
          </div>
        </GridListTile>
      ))}
    </GridList>)
  } else if (props.typeof === 'ongoing') {
    return (<GridList className={classes.list} cellHeight={300}>
      {props.data.splice(0, props.limit).map((anime, index) => (
        <GridListTile className={classes.bigCard} key={index} onClick={() =>
          props.changePage(
            `/show?${props.type}=${
            props.typeof === "progress"
              ? anime.anime ? anime.anime.meta.i : anime.showId
              : anime.id
            }`
          )
        }>
          <div className={classes.bigCardImage}>
            <img
              src={
                props.typeof === "ongoing"
                  ? anime.bannerImage ? anime.bannerImage : anime.coverImage.large
                  : props.typeof === "ranking"
                    ? anime.bg
                    : props.typeof === "progress"
                      ? anime.anime
                        ? anime.anime.meta.a
                        : anime.showHeaders
                          ? anime.showHeaders
                          : anime.showArtwork
                      : props.typeof === "favs" ? anime.image : null
              }
              alt=""
              className={classes.bigCardImageImg}
            />
          </div>
          <div className={classes.bigCardRow}>
            <img
              src={
                props.typeof === "ongoing"
                  ? anime.coverImage.large
                  : props.typeof === "ranking"
                    ? anime.bg
                    : props.typeof === "progress"
                      ? anime.anime ? anime.anime.meta.a : anime.showArtwork
                      : props.typeof === "favs" ? anime.image : null
              }
              alt=""
              className={classes.bigCardIcon}
            />
            <div className={classes.bigCardText}>
              <M.Typography
                type="display2"
                className={classes.bigCardVerySmallTitle}
              >
                {props.typeof === "ranking" ? (
                  <span role="img" aria-label="emoji">
                    {anime.emoji}
                  </span>
                ) : null}
                {props.typeof === "ongoing"
                  ? props.type.includes("m")
                    ? null
                    : timeFormatter(anime.nextAiringEpisode.timeUntilAiring) +
                    " till Episode " +
                    anime.nextAiringEpisode.episode
                  : props.typeof === "ranking"
                    ? anime.category
                    : props.typeof === "progress"
                      ? anime.ep ? "EPISODE " + anime.ep : null
                      : null}
              </M.Typography>
              <Dotdotdot clamp={2} className={classes.dotdot}>
                <M.Typography
                  type="display2"
                  className={classes.bigCardTitle}
                >
                  {props.typeof === "ongoing"
                    ? anime.title.english
                      ? anime.title.english
                      : anime.title.romaji
                    : props.typeof === "ranking"
                      ? anime.name
                      : props.typeof === "progress"
                        ? anime.anime
                          ? anime.anime.meta.t
                            ? anime.anime.meta.t
                            : anime.anime.meta.r
                          : anime.title
                        : props.typeof === "favs" ? anime.name : null}
                </M.Typography>
              </Dotdotdot>
              <Dotdotdot clamp={3}>
                <M.Typography
                  type="display2"
                  className={classes.bigCardSmallTitle}
                  dangerouslySetInnerHTML={
                    props.typeof === "ongoing"
                      ? {
                        __html: anime.description
                      }
                      : props.typeof === "ranking"
                        ? {
                          __html: anime.desc
                        }
                        : null
                  }
                >
                  {props.typeof === "progress"
                    ? "Last watched " +
                    timeFormatToReadable(anime.recentlyWatched)
                    : null}
                </M.Typography>
              </Dotdotdot>
            </div>
          </div>
        </GridListTile>
      ))}
    </GridList>)
  } else return null;
};

const mapDispatchToProps = dispatch => ({
  changePage: page => dispatch(push(page))
});

SuperTable.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  routing: PropTypes.object,
  typeof: PropTypes.string.isRequired,
  limit: PropTypes.number.isRequired
};

SuperTable.defaultProps = {
  limit: 300
}

export default connect(({ routing }) => ({ routing }), mapDispatchToProps)(
  M.withStyles(style)(SuperTable)
);
