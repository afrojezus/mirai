import React from "react";
import PropTypes from "prop-types";
import * as M from "material-ui";
import * as Icon from "material-ui-icons";
import Dotdotdot from "react-dotdotdot";
import Slider from "react-slick";

import { connect } from "react-redux";
import { push } from "react-router-redux";
const style = theme => ({
  bigCard: {
    margin: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    display: "flex",
    boxShadow: "0 2px 18px rgba(0,0,0,.4)",
    background: "rgba(255,255,255,0)",
    height: "100%",
    minHeight: "300px !important",
    width: "100%",
    boxSizing: "border-box",
    transition: theme.transitions.create(["all"]),
    "&:last-child": {
      marginRight: theme.spacing.unit * 9
    },
    "&:first-child": {
      marginLeft: theme.spacing.unit * 9
    },
    position: "relative",
    "&:hover": {
      background: `rgba(0,55,230,.3)`
    },
    "&:hover > div:nth-of-type(2) > img": {
      zIndex: 200,
      boxShadow: `0 2px 14px rgba(0,55,230,.3)`,
      borderColor: M.colors.blue.A200
    }
  },
  bigCardIcon: {
    background: "white",
    zIndex: 4,
    width: 156,
    height: 228,
    boxShadow: "0 3px 24px rgba(0,0,0,.6)",
    objectFit: "cover",
    marginRight: theme.spacing.unit * 2,
    transition: theme.transitions.create(["all"]),
    border: "8px solid transparent",
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
    background: "linear-gradient(to top, rgba(0,0,0,.7), transparent)"
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
    bottom: -theme.spacing.unit * 2,
    left: -theme.spacing.unit * 2
  },
  bigCardTitle: {
    zIndex: 3,
    color: "white",
    fontWeight: 700,
    fontSize: 32,
    textShadow: "0 3px 20px rgba(0,0,0,.87)"
  },
  bigCardText: {
    display: "flex",
    flexDirection: "column",
    margin: "auto 0"
  },
  bigCardSmallTitle: {
    zIndex: 3,
    color: "white",
    fontWeight: 400,
    marginTop: theme.spacing.unit,
    lineHeight: 1,
    fontSize: 18,
    textShadow: "0 3px 20px rgba(0,0,0,.7)"
  },
  bigCardVerySmallTitle: {
    zIndex: 3,
    color: "white",
    fontWeight: 700,
    fontSize: 14,
    textShadow: "0 3px 20px rgba(0,0,0,.7)",
    marginBottom: theme.spacing.unit,
    textTransform: "uppercase"
  },
  dotdot: {
    overflow: "initial !important"
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
    hours +
    " hr " +
    minutes +
    " min"
  );
};

const timeFormatToReadable = time => {
  return new Date(time).toDateString();
};

const superTable = props => (
  <Slider {...props.settings}>
    {props.data.splice(0, props.limit).map((anime, index) => (
      <M.Card className={props.classes.bigCard} key={index}>
        <div className={props.classes.bigCardImage}>
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
            className={props.classes.bigCardImageImg}
          />
        </div>
        <div className={props.classes.bigCardRow}>
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
            className={props.classes.bigCardIcon}
            onClick={() =>
              props.changePage(
                `/show?${props.type}=${
                  props.typeof === "progress"
                    ? anime.anime ? anime.anime.meta.i : anime.showId
                    : anime.id
                }`
              )
            }
          />
          <div className={props.classes.bigCardText}>
            <M.Typography
              type="display2"
              className={props.classes.bigCardVerySmallTitle}
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
            <Dotdotdot clamp={2} className={props.classes.dotdot}>
              <M.Typography
                type="display2"
                className={props.classes.bigCardTitle}
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
                className={props.classes.bigCardSmallTitle}
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
      </M.Card>
    ))}
  </Slider>
);

const mapDispatchToProps = dispatch => ({
  changePage: page => dispatch(push(page))
});

superTable.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  routing: PropTypes.object,
  typeof: PropTypes.string.isRequired,
  limit: PropTypes.number.isRequired
};

export default connect(({ routing }) => ({ routing }), mapDispatchToProps)(
  M.withStyles(style)(superTable)
);
