import React, { Component } from "react";
import localForage from "localforage";
import * as M from "material-ui";
import * as Icon from "material-ui-icons";
import queryString from "query-string";
import Segoku from "../utils/segoku/segoku";
import * as Vibrant from "node-vibrant";

const styles = theme => ({
  loading: {
    height: "100%",
    width: "100%",
    zIndex: -5,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    padding: 0,
    margin: "auto",
    transition: theme.transitions.create(["all"])
  },
  root: {
    paddingTop: theme.spacing.unit * 8,
    transition: theme.transitions.create(["all"]),
    animation: "load .3s ease"
  },
  backToolbar: {
    marginTop: theme.spacing.unit * 8
  },
  bigBar: {
    width: "100%",
    height: "auto",
    boxShadow: "0 2px 24px rgba(0,0,0,.2)",
    background: "#111",
    marginTop: theme.spacing.unit * 8,
    position: "relative",
    overflow: "hidden",
    paddingBottom: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 8,
    transition: theme.transitions.create(["all"])
  },
  glassEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
    height: "100vh",
    objectFit: "cover",
    width: "100%",
    transform: "scale(20)"
  },
  rootInactive: {
    opacity: 0,
    pointerEvents: "none",
    transition: theme.transitions.create(["all"])
  },
  container: {
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 1200,
    [theme.breakpoints.up("md")]: {
      maxWidth: "calc(100% - 64px)",
      paddingTop: 24
    }
  },
  frame: {
    height: "100%",
    width: "100%",
    position: "relative",
    transition: theme.transitions.create(["all"])
  },
  bgImage: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
    height: "100vh",
    objectFit: "cover",
    width: "100%",
    zIndex: -1,
    overflow: "hidden"
  },
  grDImage: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 1,
    height: "100vh",
    width: "100%",
    zIndex: -1,
    overflow: "hidden",
    transition: theme.transitions.create(["all"])
  },
  mainFrame: {
    marginLeft: 24
  },
  bigTitle: {
    fontWeight: 700,
    color: "white",
    textShadow: "0 2px 12px rgba(0,0,0,.2)"
  },
  smallTitle: {
    fontWeight: 600,
    color: "white",
    fontSize: 16,
    textShadow: "0 2px 12px rgba(0,0,0,.17)"
  },
  tagBox: {
    marginTop: theme.spacing.unit
  },
  tagTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "white",
    textShadow: "0 2px 12px rgba(0,0,0,.17)",
    marginBottom: theme.spacing.unit
  },
  desc: {
    marginTop: theme.spacing.unit,
    color: "white",
    textShadow: "0 0 12px rgba(0,0,0,.1)",
    marginBottom: theme.spacing.unit * 6
  },
  boldD: {
    marginTop: theme.spacing.unit,
    color: "white",
    textShadow: "0 0 12px rgba(0,0,0,.1)",
    marginBottom: theme.spacing.unit,
    fontWeight: 600
  },
  smallD: {
    marginLeft: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    color: "white",
    textShadow: "0 0 12px rgba(0,0,0,.1)",
    marginBottom: theme.spacing.unit
  },
  sepD: {
    display: "flex",
    marginLeft: theme.spacing.unit
  },
  artworkimg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    background: "white",
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      filter: "brightness(0.8)"
    }
  },
  artwork: {
    maxWidth: 400,
    height: 400,
    margin: "auto",
    boxShadow: "0 3px 18px rgba(0,0,0,.5)",
    transition: theme.transitions.create(["all"]),
    position: "relative",
    "&:hover": {
      transform: "scale(1.05)",
      overflow: "initial",
      boxShadow: `0 2px 14px rgba(0,0,0,.3)`,
      background: M.colors.blue.A200
    },
    "&:hover > .artworktitle": {
      transform: "scale(1.2)"
    },
    "&:hover > img": {
      transform: "scale(0.9)"
    },
    "&:active": {
      opacity: 0.7
    },
    zIndex: 500
  },
  genreRow: {
    display: "flex"
  },
  tagChip: {
    margin: theme.spacing.unit / 2,
    background: "white",
    color: "#111",
    boxShadow: "0 2px 12px rgba(0,0,0,.17)"
  },
  secTitle: {
    padding: theme.spacing.unit,
    fontWeight: 700,
    fontSize: 22,
    zIndex: "inherit",
    paddingBottom: theme.spacing.unit * 2
  },
  fillImg: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    background: "white"
  },
  peopleCard: {
    height: "auto",
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
      background: M.colors.blue.A200
    },
    "&:hover > * > h1": {
      transform: "scale(1.1)",
      textShadow: "0 2px 12px rgba(0,0,0,.7)"
    },
    position: "relative",
    overflow: "hidden"
  },
  peopleImage: {
    height: 156,
    width: 156,
    margin: "auto",
    zIndex: -1,
    borderRadius: "50%",
    boxShadow: "0 2px 12px rgba(0,0,0,.2)",
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      boxShadow: "0 3px 16px rgba(0,0,0,.5)",
      filter: "brightness(0.8)",
      transform: "scale(0.9)"
    },
    top: 0,
    left: 0
  },
  entityContext: {
    "&:last-child": {
      paddingBottom: 12
    }
  },
  peopleTitle: {
    fontSize: 14,
    fontWeight: 500,
    padding: theme.spacing.unit,
    paddingBottom: theme.spacing.unit / 2,
    transition: theme.transitions.create(["transform"]),
    bottom: 0,
    zIndex: 5,
    margin: "auto",
    textAlign: "center",
    textShadow: "0 1px 12px rgba(0,0,0,.2)"
  },
  peopleSubTitle: {
    fontSize: 14,
    color: "rgba(255,255,255,.7)",
    fontWeight: 600,
    margin: "auto",
    transition: theme.transitions.create(["transform"]),
    zIndex: 5,
    textShadow: "0 1px 12px rgba(0,0,0,.2)",
    textAlign: "center"
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
      background: M.colors.blue.A200
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
  sectDivide: {
    marginTop: theme.spacing.unit * 2
  },
  progressCon: {
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing.unit,
    maxWidth: 400,
    margin: "auto"
  },
  progressTitle: {
    display: "flex",
    "& > h2": {
      fontSize: 14
    }
  },
  progressBar: {
    background: "rgba(255,255,255,.3)"
  },
  progressBarActive: {
    background: "white"
  }
});

class Show extends Component {
  state = {
    data: {},
    tabVal: 0,
    loading: true,
    playerActive: false,
    id: 0,
    hue: "#111",
    hueVib: M.colors.blue.A200,
    hueVibN: M.colors.grey.A700
  };

  frame = document.getElementById("previewFrame");

  componentWillMount = () => {
    window.scrollTo(0, 0);
  };

  componentDidMount = async () => {
    this.init();

    this.props.history.listen((location, action) => {
      let id = queryString.parse(location.search);
      if (id.s !== this.state.id) {
        this.init();
      }
    });
  };

  componentWillReceiveProps = nextProps => {
    if (
      this.props.history.location.search !== nextProps.history.location.search
    ) {
      window.scrollTo(0, 0);
      this.init();
    }
  };

  init = () =>
    this.setState({ data: {}, loading: true }, async () => {
      let id = queryString.parse(this.props.history.location.search);
      if (id) {
        const { data } = this.props.history.location.search.includes("?m=")
          ? await new Segoku().getSingleManga({ id: id.m })
          : await new Segoku().getSingle({ id: id.s });
        try {
          if (data)
            this.setState({ data, id: data.Media.id }, () => this.pasta());
          else throw new Error("Metadata error");
        } catch (error) {
          this.setState({ error }, () =>
            setTimeout(() => this.setState({ error: "" }), 3000)
          );
        }
      }
    });

  pasta = async () => {
    let data = this.state.data.Media;
    // this.props.meta.showTitle = data.title.english ? data.title.english : data.title.romaji
    let image = this.state.data.Media.bannerImage
      ? this.state.data.Media.bannerImage
      : this.state.data.Media.coverImage.medium;
    Vibrant.from("https://cors-anywhere.herokuapp.com/" + image).getPalette(
      (err, pal) => {
        if (pal) {
          this.setState({
            hue: pal.DarkMuted.getHex(),
            hueVib: pal.LightVibrant && pal.LightVibrant.getHex(),
            hueVibN: pal.DarkVibrant && pal.DarkVibrant.getHex()
          });
        }
      }
    );
    this.setState(
      {
        loading: false
      },
      () => {
        if (this.frame)
          setTimeout(() => (this.frame.style.opacity = "initial"), 400);
      }
    );
  };

  componentWillUnmount = () => {
    let data = this.state.data.Media;
    this.props.meta.showTitle = "";
  };

  tabChange = (e, val) => this.setState({ tabVal: val });

  play = () => {
    window.scrollTo(0, 0);
    if (this.state.data.Media && this.state.data.Media.type.includes("ANIME"))
      this.props.history.push("/watch?w=" + this.state.data.Media.id);
    else this.props.history.push("/read?r=" + this.state.data.Media.id);
  };

  componentWillUnmount = () => {};

  openEntity = link => {
    this.props.history.push(link);
    if (
      this.props.history.location.pathname +
        this.props.history.location.search ===
      link
    ) {
      window.scrollTo(0, 0);
      this.init();
    }
  };

  atLeave = () => {
    if (this.state.data.Media && this.state.data.Media.trailer) {
      let tbg = document.getElementById("trailerbg");
      tbg.remove();
    }
  };

  render() {
    const { classes, user, history, meta } = this.props;
    const { data, loading, playerActive, hue, hueVib, hueVibN } = this.state;
    return (
      <div className={classes.frame}>
        {playerActive ? (
          <M.Toolbar className={classes.backToolbar}>
            <M.IconButton onClick={this.play}>
              <Icon.ArrowBack />
            </M.IconButton>
          </M.Toolbar>
        ) : null}
        <M.CircularProgress
          className={classes.loading}
          style={!loading ? { opacity: 0 } : null}
        />
        {data && data.Media ? (
          <div
            id="previewFrame"
            className={classes.root}
            style={loading ? { opacity: 0 } : null}
          >
            <div className={classes.grImage}>
              <div className={classes.grDImage} style={{ background: hueVibN }}>
                <img
                  src={
                    data.Media.bannerImage
                      ? data.Media.bannerImage
                      : data.Media.coverImage.large
                  }
                  alt=""
                  className={classes.bgImage}
                />
              </div>
            </div>
            <M.Grid container spacing={16} className={classes.container}>
              <M.Grid item xs={3}>
                <div
                  className={classes.artwork}
                  style={{ background: hueVib }}
                  onClick={this.play}
                >
                  <img
                    src={data.Media.coverImage.large}
                    alt=""
                    className={classes.artworkimg}
                  />
                  <M.Typography className="artworktitle" type="display1">
                    {data.Media.type.includes("MANGA") ? "Read" : "Play"}
                  </M.Typography>
                </div>
                {user &&
                user.episodeProgress &&
                user.episodeProgress.hasOwnProperty(data.Media.id) ? (
                  <div className={classes.progressCon}>
                    <M.LinearProgress
                      mode="determinate"
                      value={user.episodeProgress[data.Media.id].played * 100}
                      classes={{
                        primaryColor: classes.progressBar,
                        primaryColorBar: classes.progressBarActive
                      }}
                    />
                    <div className={classes.progressTitle}>
                      <div style={{ flex: 1 }} />
                      <M.Typography type="title">
                        EPISODE {user.episodeProgress[data.Media.id].ep}
                      </M.Typography>
                    </div>
                  </div>
                ) : null}
              </M.Grid>
              <M.Grid item xs className={classes.mainFrame}>
                <M.Typography className={classes.smallTitle} type="display2">
                  {data.Media.title.native} {"• " + data.Media.startDate.year}{" "}
                  {"• " +
                    Math.floor(data.Media.duration / 60) +
                    " h " +
                    data.Media.duration % 60 +
                    " min"}
                </M.Typography>
                <M.Typography className={classes.bigTitle} type="display3">
                  {data.Media.title.english
                    ? data.Media.title.english
                    : data.Media.title.romaji}
                </M.Typography>
                <M.Divider />
                <M.Typography
                  className={classes.desc}
                  type="body1"
                  dangerouslySetInnerHTML={{ __html: data.Media.description }}
                />
                {data.Media.characters.edges[0] &&
                data.Media.characters.edges[0].voiceActors ? (
                  <div style={{ display: "flex" }}>
                    <M.Typography className={classes.boldD} type="headline">
                      Starring{" "}
                    </M.Typography>
                    {data.Media.characters.edges
                      .filter(s => s.role === "MAIN")
                      .map((o, i) => (
                        <M.Typography
                          className={classes.smallD}
                          type="headline"
                        >
                          {o.voiceActors[0].name.last
                            ? o.voiceActors[0].name.first +
                              " " +
                              o.voiceActors[0].name.last
                            : o.voiceActors[0].name.first}{" "}
                          as{" "}
                          {o.node.name.last
                            ? o.node.name.first + " " + o.node.name.last
                            : o.node.name.first}
                        </M.Typography>
                      ))}
                  </div>
                ) : null}
                <div style={{ display: "flex" }}>
                  {data.Media.staff.edges.filter(
                    s => s.role === "Director"
                  )[0] ? (
                    <M.Typography className={classes.boldD} type="headline">
                      Directed by{" "}
                    </M.Typography>
                  ) : null}
                  {data.Media.staff.edges.filter(
                    s => s.role === "Director"
                  )[0] ? (
                    <M.Typography className={classes.smallD} type="headline">
                      {
                        data.Media.staff.edges.filter(
                          s => s.role === "Director"
                        )[0].node.name.first
                      }{" "}
                      {data.Media.staff.edges.filter(
                        s => s.role === "Director"
                      )[0].node.name.last
                        ? data.Media.staff.edges.filter(
                            s => s.role === "Director"
                          )[0].node.name.last
                        : null}
                    </M.Typography>
                  ) : null}
                  {data.Media.staff.edges.filter(
                    s => s.role === "Original Creator"
                  )[0] ? (
                    <div className={classes.sepD}>
                      <M.Typography className={classes.boldD} type="headline">
                        {data.Media.staff.edges.filter(
                          s => s.role === "Director"
                        )[0]
                          ? "and written by"
                          : "Written by"}
                      </M.Typography>
                      <M.Typography className={classes.smallD} type="headline">
                        {
                          data.Media.staff.edges.filter(
                            s => s.role === "Original Creator"
                          )[0].node.name.first
                        }{" "}
                        {data.Media.staff.edges.filter(
                          s => s.role === "Original Creator"
                        )[0].node.name.last
                          ? data.Media.staff.edges.filter(
                              s => s.role === "Original Creator"
                            )[0].node.name.last
                          : null}
                      </M.Typography>
                    </div>
                  ) : null}
                </div>
                <M.Divider />
                <M.Grid container>
                  <M.Grid item xs className={classes.tagBox}>
                    <M.Typography className={classes.tagTitle} type="title">
                      Genres
                    </M.Typography>
                    <div className={classes.genreRow}>
                      {data.Media.genres
                        ? data.Media.genres.map((o, i) => (
                            <M.Chip
                              className={classes.tagChip}
                              key={i}
                              label={o}
                            />
                          ))
                        : null}
                    </div>
                  </M.Grid>
                  <M.Grid item xs className={classes.tagBox}>
                    <M.Typography className={classes.tagTitle} type="title">
                      Tags
                    </M.Typography>
                    <div className={classes.genreRow}>
                      {data.Media.tags.map((o, i) => (
                        <M.Chip
                          className={classes.tagChip}
                          key={i}
                          label={o.name}
                        />
                      ))}
                    </div>
                  </M.Grid>
                  {data.Media.type.includes("MANGA") ? null : (
                    <M.Grid item xs className={classes.tagBox}>
                      <M.Typography className={classes.tagTitle} type="title">
                        Studios
                      </M.Typography>
                      <div className={classes.genreRow}>
                        {data.Media.studios.edges.map((o, i) => (
                          <M.Chip
                            className={classes.tagChip}
                            key={i}
                            label={o.node.name}
                          />
                        ))}
                      </div>
                    </M.Grid>
                  )}
                </M.Grid>
              </M.Grid>
            </M.Grid>
            <div className={classes.bigBar} style={{ background: hue }}>
              <M.Grid container className={classes.container}>
                <M.Grid item xs style={{ zIndex: 10 }}>
                  <M.Typography type="title" className={classes.secTitle}>
                    Similar to this one
                  </M.Typography>
                  <M.Grid container className={classes.itemcontainer}>
                    {data.Media.relations.edges.map((anime, index) => (
                      <M.Grid
                        className={classes.entityCard}
                        item
                        xs
                        key={index}
                      >
                        <M.Card
                          style={{ background: "transparent" }}
                          onClick={() =>
                            this.openEntity(
                              `/show?${
                                anime.node.type.includes("ANIME") ? "s" : "m"
                              }=${anime.node.id}`
                            )
                          }
                        >
                          <div className={classes.gradientCard}>
                            <M.CardMedia
                              className={classes.entityImage}
                              image={anime.node.coverImage.large}
                            />
                          </div>
                          <M.Typography
                            type="headline"
                            className={classes.entityTitle}
                          >
                            {anime.node.title.english
                              ? anime.node.title.english
                              : anime.node.title.romaji}
                          </M.Typography>
                          <M.Typography
                            type="headline"
                            className={classes.entitySubTitle}
                          >
                            {anime.node.type} {anime.relationType}
                          </M.Typography>
                        </M.Card>
                      </M.Grid>
                    ))}
                  </M.Grid>
                  <M.Divider />
                  <M.Typography type="title" className={classes.secTitle}>
                    {data.Media.type.includes("ANIME") ? "Cast" : "Characters"}
                  </M.Typography>
                  <M.Grid container className={classes.itemcontainer}>
                    {data.Media.characters.edges.map((cast, index) => (
                      <M.Grid
                        className={classes.peopleCard}
                        item
                        xs
                        key={index}
                      >
                        <M.Card
                          style={{
                            background: "transparent",
                            boxShadow: "none"
                          }}
                          onClick={() =>
                            this.props.history.push(`/fig?c=${cast.node.id}`)
                          }
                        >
                          <M.Avatar
                            className={classes.peopleImage}
                            classes={{ img: classes.fillImg }}
                            src={cast.node.image.large}
                          />
                          <M.Typography
                            type="headline"
                            className={classes.peopleTitle}
                          >
                            {cast.node.name.last
                              ? cast.node.name.first + " " + cast.node.name.last
                              : cast.node.name.first}
                          </M.Typography>
                          <M.Typography
                            type="headline"
                            className={classes.peopleSubTitle}
                          >
                            {cast.role}
                          </M.Typography>
                        </M.Card>
                      </M.Grid>
                    ))}
                  </M.Grid>
                  <M.Divider />
                  <M.Typography type="title" className={classes.secTitle}>
                    Staff
                  </M.Typography>
                  <M.Grid container className={classes.itemcontainer}>
                    {data.Media.staff.edges.map((staff, index) => (
                      <M.Grid
                        className={classes.peopleCard}
                        item
                        xs
                        key={index}
                      >
                        <M.Card
                          style={{
                            background: "transparent",
                            boxShadow: "none"
                          }}
                          onClick={() =>
                            this.props.history.push(`/fig?s=${staff.node.id}`)
                          }
                        >
                          <M.Avatar
                            className={classes.peopleImage}
                            classes={{ img: classes.fillImg }}
                            src={staff.node.image.large}
                          />
                          <M.Typography
                            type="headline"
                            className={classes.peopleTitle}
                          >
                            {staff.node.name.last
                              ? staff.node.name.first +
                                " " +
                                staff.node.name.last
                              : staff.node.name.first}
                          </M.Typography>
                          <M.Typography
                            type="headline"
                            className={classes.peopleSubTitle}
                          >
                            {staff.role}
                          </M.Typography>
                        </M.Card>
                      </M.Grid>
                    ))}
                  </M.Grid>
                </M.Grid>
              </M.Grid>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default M.withStyles(styles)(Show);
