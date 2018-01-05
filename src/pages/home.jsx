import MenuItem from "material-ui/Menu/MenuItem";
import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import { Database } from "../utils/firebase";
import localForage from "localforage";
import Grid from "material-ui/Grid";
import Divider from "material-ui/Divider";
import Avatar from "material-ui/Avatar";
import Card, {
  CardContent,
  CardMedia,
  CardHeader,
  CardActions
} from "material-ui/Card";
import { grey } from "material-ui/colors";
import IconButton from "material-ui/IconButton";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { Auth } from "../utils/firebase";
import PlusOneIcon from "material-ui-icons/PlusOne";
import Button from "material-ui/Button";
import MoreVertIcon from "material-ui-icons/MoreVert";
import ShareIcon from "material-ui-icons/Share";
import { Menu } from "material-ui";
import miraiIcon from "../assets/mirai-icon.png";

import { blue } from "material-ui/colors";

import Rx from "rxjs/Rx";
import "localforage-observable";

import Snackbar from "material-ui/Snackbar";
import CloseIcon from "material-ui-icons/Close";

const OngoingAnimes = ({ data: { Page, refetch } }) => (
  <Grid container>
    {Page &&
      Page.media.map((media, i) => (
        <Grid item xs key={i}>
          <Card>
            <CardMedia image={media.coverImage.large} />
            <CardContent>
              <Typography type="headline">{media.title.romaji}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
  </Grid>
);

const OngoingAnimesQuery = graphql(gql`
  query(
    $id: Int
    $page: Int
    $season: MediaSeason
    $seasonYear: Int
    $search: String
    $status: MediaStatus
    $isAdult: Boolean
    $sort: [MediaSort]
  ) {
    Page(page: $page) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(
        id: $id
        search: $search
        season: $season
        seasonYear: $seasonYear
        sort: $sort
        status: $status
        isAdult: $isAdult
        type: ANIME
      ) {
        id
        title {
          romaji
          english
          native
        }
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        coverImage {
          large
          medium
        }
        bannerImage
        format
        type
        status
        episodes
        chapters
        volumes
        description
        averageScore
        meanScore
        genres
        season
        isAdult
        popularity
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
      }
    }
  }
`)(OngoingAnimes);

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 8
  },
  container: {
    marginLeft: "auto",
    marginRight: "auto",
    padding: 24,
    maxWidth: 1200,
    [theme.breakpoints.up("md")]: {
      maxWidth: "calc(100% - 64px)"
    }
  },
  itemContainer: {
    margin: theme.spacing.unit
  },
  bgImage: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
    height: "100vh",
    objectFit: "cover",
    width: "100%",
    zIndex: -1
  },
  topHeader: {
    width: 700,
    minHeight: 256,
    position: "relative",
    display: "flex",
    margin: "auto",
    boxShadow: "0 3px 16px rgba(0,0,0,.4)",
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      transform: "scale(0.8)",
      overflow: "initial",
      zIndex: 200,
      boxShadow: "0 2px 14px rgba(0,0,0,.4)"
    },
    "&:hover > h1": {
      transform: "scale(1.5) translateX(-20%)",
      fontWeight: 700,
      textShadow: "0 2px 12px rgba(0,0,0,.7)"
    }
  },
  cardBg: {
    objectFit: "cover",
    height: "100%",
    width: "100%",
    position: "absolute",
    textIndent: -999,
    top: 0,
    left: 0,
    zIndex: 0
  },
  cardContent: {
    textAlign: "center",
    height: "100%",
    zIndex: 2,
    display: "flex",
    background: grey[800]
  },
  divide: {
    width: "100%",
    marginTop: 24,
    marginBottom: 24
  },
  spacer: {
    flex: 1
  },
  headline: {
    marginBottom: 24
  },
  fullWidth: {
    width: "100%"
  },
  entityCard: {
    height: 200,
    width: 183,
    flexGrow: "initial",
    flexBasis: "initial",
    margin: theme.spacing.unit / 2,
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      transform: "scale(1.05)",
      overflow: "initial",
      zIndex: 200,
      boxShadow: `0 2px 14px rgba(0,55,230,.3)`,
      background: blue.A200
    },
    "&:hover > div": {
      boxShadow: "none"
    },
    "&:hover > * > h1": {
      transform: "scale(1.4)",
      fontWeight: 700,
      textShadow: "0 2px 12px rgba(0,0,0,.7)"
    },
    position: "relative",
    overflow: "hidden"
  },
  entityCardDisabled: {
    height: 200,
    width: 183,
    flexGrow: "initial",
    flexBasis: "initial",
    margin: theme.spacing.unit / 2,
    transition: theme.transitions.create(["all"]),
    filter: "brightness(.8)",
    position: "relative",
    overflow: "hidden"
  },
  entityImage: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    position: "absolute",
    zIndex: -1,
    transition: theme.transitions.create(["filter"]),
    "&:hover": {
      filter: "brightness(0.8)"
    },
    top: 0,
    left: 0
  },
  entityContext: {
    "&:last-child": {
      paddingBottom: 12
    }
  },
  entityTitle: {
    fontSize: 14,
    fontWeight: 500,
    position: "absolute",
    padding: theme.spacing.unit * 2,
    transition: theme.transitions.create(["transform"]),
    bottom: 0,
    zIndex: 5,
    left: 0,
    textShadow: "0 1px 12px rgba(0,0,0,.2)"
  },
  entitySubTitle: {
    fontSize: 14,
    fontWeight: 600,
    position: "absolute",
    padding: theme.spacing.unit * 2,
    transition: theme.transitions.create(["transform"]),
    top: 0,
    left: 0,
    zIndex: 5,
    textShadow: "0 1px 12px rgba(0,0,0,.2)"
  },
  itemcontainer: {
    paddingBottom: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  gradientCard: {
    position: "relative",
    background: "linear-gradient(to top, transparent, rgba(0,0,0,.6))",
    height: 183,
    width: "100%"
  },
  likeCount: {},
  cardColor: {},
  snackBar: {
    position: "fixed",
    marginTop: 64
  },
  avatar: {
    marginLeft: -theme.spacing.unit * 4,
    height: 82,
    width: 82,
    boxShadow: "0 3px 16px rgba(0,0,0,.5)"
  },
  frame: {
    transition: theme.transitions.create(["all"])
  }
});

class Home extends Component {
  state = {
    user: this.props.user,
    feeds: null,
    anchorEl: null,
    es: false,
    loading: true
  };

  componentDidMount = async () => {
    this.feedsObserve();
    setTimeout(() => this.setState({ loading: false }), 300);
  };

  feedsObserve = () =>
    Database.ref("social")
      .child("public_feed")
      .on("value", feed => this.setState({ feeds: Object.values(feed.val()) }));

  openEntity = link => this.props.history.push(link);

  easterEggOne = () => this.setState({ es: !this.state.es });

  render() {
    const { classes, status } = this.props;
    const { user, feeds, anchorEl, es, loading } = this.state;
    const openFeed = Boolean(anchorEl);

    return (
      <div className={classes.frame} style={loading ? { opacity: 0 } : null}>
        {user && user.headers ? (
          <img src={user.headers} alt="" className={classes.bgImage} />
        ) : null}
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          open={es}
          autoHideDuration={6000}
          onRequestClose={this.easterEggOne}
          SnackbarContentProps={{
            "aria-describedby": "message-id"
          }}
          className={classes.snackBar}
          message={<span id="message-id">hahahahahah.</span>}
          action={
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.easterEggOne}
            >
              <CloseIcon />
            </IconButton>
          }
        />
        <div className={classes.root}>
          <Card className={classes.topHeader}>
            <Typography type="display2" className="specialTitleHeader">
              未来
            </Typography>
          </Card>
          <Grid container spacing={16} className={classes.container}>
            <Grid item xs className={classes.itemContainer}>
              <Typography type="title" className={classes.headline}>
                Public feeds
              </Typography>
              <Grid container spacing={16}>
                {feeds &&
                  feeds.map((feed, index) => (
                    <Grid item xs key={index}>
                      <Card classes={{ root: classes.cardColor }}>
                        <CardHeader
                          avatar={
                            <Avatar
                              alt=""
                              src={miraiIcon}
                              className={classes.avatar}
                            />
                          }
                          title={feed.name}
                          subheader={feed.user.name + " - " + feed.date}
                          action={
                            <IconButton
                              aria-label="More"
                              aria-owns={openFeed ? "feed-menu" : null}
                              aria-haspopup="true"
                              onClick={e =>
                                this.setState({ anchorEl: e.currentTarget })
                              }
                            >
                              <MoreVertIcon />
                            </IconButton>
                          }
                        />
                        {feed.image ? <CardMedia image={feed.image} /> : null}
                        <CardContent>
                          <Typography type="body1">{feed.context}</Typography>
                        </CardContent>
                        <Divider />
                        <CardActions>
                          <Button
                            color="contrast"
                            className={classes.likeCount}
                          >
                            {feed.likes.length}{" "}
                            {feed.likes.length === 1 ? "Like" : "Likes"}
                          </Button>
                          <Button
                            color="contrast"
                            className={classes.likeCount}
                          >
                            {feed.comments.length}{" "}
                            {feed.comments.length === 1
                              ? "Comment"
                              : "Comments"}
                          </Button>
                          <div className={classes.spacer} />
                          <IconButton>
                            <PlusOneIcon />
                          </IconButton>
                          <IconButton>
                            <ShareIcon />
                          </IconButton>
                        </CardActions>
                      </Card>
                      <Menu
                        id="feed-menu"
                        anchorEl={anchorEl}
                        open={openFeed}
                        onRequestClose={() => this.setState({ anchorEl: null })}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right"
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right"
                        }}
                      >
                        <MenuItem
                          onClick={() => {
                            this.setState({ anchorEl: null });
                            this.easterEggOne();
                          }}
                        >
                          I have issues with different opinions
                        </MenuItem>
                      </Menu>
                    </Grid>
                  ))}
              </Grid>
              <Divider className={classes.divide} />
              {user && user.episodeProgress ? (
                <div className={classes.fullWidth}>
                  <Typography type="title" className={classes.headline}>
                    Animes you've watched previously
                  </Typography>
                  <Grid container>
                    {Object.values(user.episodeProgress).map((anime, index) => (
                      <Grid className={classes.entityCard} item xs key={index}>
                        <Card
                          style={{ background: "transparent" }}
                          onClick={() =>
                            this.openEntity(
                              `/show?s=${
                                anime.anime ? anime.anime.meta.i : anime.showId
                              }`
                            )
                          }
                        >
                          <div className={classes.gradientCard}>
                            <CardMedia
                              className={classes.entityImage}
                              image={
                                anime.anime
                                  ? anime.anime.meta.a
                                  : anime.showArtwork
                              }
                            />
                          </div>
                          <Typography
                            type="headline"
                            className={classes.entityTitle}
                          >
                            {anime.anime
                              ? anime.anime.meta.t
                                ? anime.anime.meta.t
                                : anime.anime.meta.r
                              : anime.title}
                          </Typography>
                          <Typography
                            type="headline"
                            className={classes.entitySubTitle}
                          >
                            {anime.ep ? "EPISODE " + anime.ep : null}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              ) : null}
              {user && user.favs && user.favs.show && user.favs.show ? (
                <div className={classes.fullWidth}>
                  <Divider className={classes.divide} />
                  <Typography type="title" className={classes.headline}>
                    Your favourites
                  </Typography>
                  <Grid container>
                    {Object.values(user.favs.show).map((anime, index) => (
                      <Grid className={classes.entityCard} item xs key={index}>
                        <Card
                          style={{ background: "transparent" }}
                          onClick={() => this.openEntity(anime.link)}
                        >
                          <div className={classes.gradientCard}>
                            <CardMedia
                              className={classes.entityImage}
                              image={anime.image}
                            />
                          </div>
                          <Typography
                            type="headline"
                            className={classes.entityTitle}
                          >
                            {anime.name}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              ) : null}
              <Divider className={classes.divide} />
              <Typography type="title" className={classes.headline}>
                Currently ongoing anime
              </Typography>
              <OngoingAnimesQuery />
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
