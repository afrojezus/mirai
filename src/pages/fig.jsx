import React, { Component } from "react";
import PropTypes from "prop-types";
import * as M from "material-ui";
import * as Icon from "material-ui-icons";
import queryString from "query-string";
import * as Vibrant from "node-vibrant";
import { connect } from "react-redux";
import { firebaseConnect, isEmpty, firebase } from "react-redux-firebase";
import Grid from "material-ui/Grid/Grid";

import { history } from "../store";
import { MIR_SET_TITLE } from "../constants";
import Segoku from "../utils/segoku/segoku";
import {
  LoadingIndicator,
  Header,
  Root,
  Container,
  CommandoBar
} from "../components/layouts";
import CardButton, { PeopleButton } from "../components/cardButton";

const style = theme => ({
  root: {
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 1600,
    position: "relative",
    paddingTop: theme.spacing.unit * 8,
    transition: theme.transitions.create(["all"])
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
    zIndex: -1,
    transform: "scale(10)"
  },
  content: {
    padding: theme.spacing.unit * 3,
    boxSizing: "border-box"
  },
  header: {
    position: "relative",
    margin: "auto",
    paddingTop: theme.spacing.unit * 3
  },
  title: {
    color: "white",
    fontSize: 64,
    fontWeight: 700,
    textShadow: "0 3px 16px rgba(0,0,0,.4)",
    padding: theme.spacing.unit,
    textAlign: "center",
    margin: "auto"
  },
  icon: {
    boxShadow: "0 1px 12px rgba(0,0,0,.2)",
    color: "white",
    height: 92,
    width: 92,
    zIndex: -1,
    background: "linear-gradient(to top, #9900ff 0%, #ff00ff 70%)",
    borderRadius: "50%",
    padding: theme.spacing.unit * 2
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
    zIndex: 1,
    borderRadius: "50%",
    boxShadow: "0 2px 12px rgba(0,0,0,.2)",
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      boxShadow: "0 3px 16px rgba(0,0,0,.5)"
    },
    top: 0,
    left: 0
  },
  peopleCharImage: {
    height: 64,
    width: 64,
    margin: "auto",
    zIndex: 2,
    position: "absolute",
    borderRadius: "50%",
    boxShadow: "0 2px 12px rgba(0,0,0,.2)",
    transition: theme.transitions.create(["all"]),
    "&:hover": {
      boxShadow: "0 3px 16px rgba(0,0,0,.5)",
      transform: "scale(1.2)"
    },
    right: theme.spacing.unit * 3,
    bottom: theme.spacing.unit * 7
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
    textAlign: "center",
    whiteSpace: "nowrap"
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
    width: "100%",
    maxWidth: 400,
    margin: "auto"
  },
  progressTitle: {
    display: "flex",
    fontSize: 12,
    margin: "auto",
    textAlign: "center"
  },
  progressBar: {
    background: "rgba(255,255,255,.3)",
    margin: theme.spacing.unit / 2
  },
  progressBarActive: {
    background: "white"
  },
  commandoBar: {
    width: "100%",
    display: "inline-flex",
    boxSizing: "border-box",
    background: "#222",
    boxShadow: "0 3px 18px rgba(0,0,0,.1)"
  },
  commandoText: {
    margin: "auto",
    textAlign: "center"
  },
  commandoTextBox: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    margin: "auto"
  },
  commandoTextLabel: {
    fontSize: 10,
    textAlign: "center",
    color: "rgba(255,255,255,.8)"
  },
  smallTitlebar: {
    display: "flex"
  },
  secTitle: {
    padding: theme.spacing.unit,
    fontWeight: 700,
    fontSize: 22,
    zIndex: "inherit",
    paddingBottom: theme.spacing.unit * 2
  },
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
    zIndex: -1
  },
  artwork: {
    width: 400,
    height: 400,
    borderRadius: "50%",
    overflow: "hidden",
    margin: "auto",
    boxShadow: "0 3px 18px rgba(0,0,0,.5)",
    transition: theme.transitions.create(["all"]),
    position: "relative",
    zIndex: 500
  }
});

const staffQuery = `
query($id: Int) {
    Staff(id: $id) {
        id
        name {
            first
            last
            native
        }
        language
        image {
            large
            medium
        }
        description(asHtml: true)
        staffMedia {
            edges {
                node {
                    id
                    title {
                        english
                        romaji
                        native
                    }
                    coverImage {
                        large
                        medium
                    }
                    description(asHtml: true)
                    type
                }
                id
                relationType
                staffRole
            }
        }
        characters {
            edges {
                node {
                    id
                    name {
                        first
                        last
                        native
                        alternative
                    }
                    image {
                        large
                        medium
                    }
                    description(asHtml: true)
                }
                id
                role
            }
        }
    }
}
`;

const characterQuery = `
query($id: Int) {
    Character(id: $id) {
        id
        name {
            first
            last
            native
            alternative
        }
        image {
            large
            medium
        }
        description(asHtml: true)
        media {
            edges {
                node {
                    id
                    title {
                        english
                        romaji
                        native
                    }
                    coverImage {
                        large
                        medium
                    }
                    description(asHtml: true)
                    type
                }
                id
                relationType
                characterRole
            }
        }
    }
}
`;

const nameSwapper = (first, last) => (last ? `${first} ${last}` : first);

class Fig extends Component {
  static propTypes = {
    profile: {},
    history,
    firebase,
    location: {
      state: {},
      search: PropTypes.string,
      pathname: PropTypes.string
    },
    classes: style,
    sendTitleToMir: PropTypes.func
  };

  static defaultProps = {
    profile: null,
    history,
    location: null,
    firebase: null,
    classes: style,
    sendTitleToMir: PropTypes.func
  };
  state = {
    data: null,
    loading: true,
    id: 0,
    type: "",
    hue: "#111",
    hueVib: "#222",
    hueVibN: "#222",
    fav: false
  };

  componentDidMount = () => {
    this.init();
  };

  componentWillUnmount = () => {
    this.props.sendTitleToMir("");
    this.unlisten();
  };
  init = async () =>
    this.setState({ data: null, loading: true }, () =>
      setTimeout(async () => {
        const id = queryString.parse(this.props.history.location.search);
        try {
          if (id && this.props.history.location.pathname === "/fig") {
            const { data } = this.props.history.location.search.includes("?s=")
              ? await new Segoku().customQuery(staffQuery, { id: id.s })
              : await new Segoku().customQuery(characterQuery, { id: id.c });
            if (data) {
              console.log(data);
              this.setState(
                {
                  data
                },
                () =>
                  setTimeout(
                    () =>
                      this.setState(
                        {
                          loading: false,
                          id: this.props.history.location.search.includes("?s=")
                            ? id.s
                            : id.c,
                          type: this.props.history.location.search.includes(
                            "?s="
                          )
                            ? "STAFF"
                            : "CHARACTER",
                          fav: this.props.history.location.search.includes(
                            "?c="
                          )
                            ? !!(
                                this.props.profile.favs &&
                                this.props.profile.favs.char &&
                                this.props.profile.favs.char[id.c]
                              )
                            : !!(
                                this.props.profile.favs &&
                                this.props.profile.favs.staff &&
                                this.props.profile.favs.staff[id.s]
                              )
                        },
                        () => this.vibrance()
                      ),
                    300
                  )
              );
            }
          }
        } catch (error) {
          console.error(error);
        }
      }, 300)
    );

  vibrance = () => {
    const image = this.state.data.Character
      ? this.state.data.Character.image.medium
      : this.state.data.Staff.image.medium;

    this.props.sendTitleToMir(
      this.state.type.includes("CHARACTER")
        ? nameSwapper(
            this.state.data.Character.name.first,
            this.state.data.Character.name.last
          )
        : nameSwapper(
            this.state.data.Staff.name.first,
            this.state.data.Staff.name.last
          )
    );
    Vibrant.from(`https://cors-anywhere.herokuapp.com/${image}`).getPalette(
      (err, pal) => {
        if (pal) {
          this.setState(
            {
              hue: pal.DarkMuted.getHex(),
              hueVib: pal.LightVibrant && pal.LightVibrant.getHex(),
              hueVibN: pal.DarkVibrant && pal.DarkVibrant.getHex()
            },
            () => {}
          );
        }
      }
    );
  };

  openEntity = link => {
    this.props.history.push(link);
  };

  like = async () => {
    const name = this.state.data.Character
      ? nameSwapper(
          this.state.data.Character.name.first,
          this.state.data.Character.name.last
        )
      : nameSwapper(
          this.state.data.Staff.name.first,
          this.state.data.Staff.name.last
        );
    const image = this.state.data.Character
      ? this.state.data.Character.image.large
      : this.state.data.Staff.image.large;
    const entity = this.state.type.includes("CHARACTER") ? "char" : "staff";
    if (!isEmpty(this.props.profile))
      this.props.firebase
        .update(
          `users/${this.props.profile.userID}/favs/${entity}/${this.state.id}`,
          {
            name,
            image,
            id: this.state.id,
            link:
              this.props.history.location.pathname +
              this.props.history.location.search
          }
        )
        .then(() => {
          this.setState({ fav: true });
        });
  };

  unlike = async () => {
    const entity = this.state.type.includes("CHARACTER") ? "char" : "staff";
    if (!isEmpty(this.props.profile))
      this.props.firebase
        .remove(
          `users/${this.props.profile.userID}/favs/${entity}/${this.state.id}`
        )
        .then(() => this.setState({ fav: false }));
  };
  unlisten = this.props.history.listen(location => {
    const id = queryString.parse(location.search);
    if (location.pathname === "/fig") {
      if (this.state.type === "CHARACTER")
        if (id.c !== this.state.id) this.init();
      if (this.state.type === "STAFF") if (id.s !== this.state.id) this.init();
    } else {
      return false;
    }
    return false;
  });

  render() {
    const { classes } = this.props;
    const user = !isEmpty(this.props.profile) ? this.props.profile : null;
    const { data, loading, hue, fav } = this.state;
    return (
      <div>
        <LoadingIndicator loading={loading} />
        <Root style={loading ? { opacity: 0 } : null}>
          {data ? (
            data.Character || data.Staff ? (
              <Header
                image={
                  data.Character
                    ? data.Character.image.large
                    : data.Staff ? data.Staff.image.large : null
                }
              />
            ) : null
          ) : null}
          {(data && data.Character) || (data && data.Staff) ? (
            <Grid container spacing={0}>
              <M.Grid container spacing={0} className={classes.container}>
                <M.Grid
                  item
                  style={{ width: 400, flexGrow: 0, marginRight: 24 }}
                  xs
                >
                  <div className={classes.artwork}>
                    <img
                      src={
                        data.Character
                          ? data.Character.image.large
                          : data.Staff ? data.Staff.image.large : null
                      }
                      alt=""
                      className={classes.artworkimg}
                    />
                  </div>
                </M.Grid>
                <M.Grid item xs>
                  <M.Typography className={classes.bigTitle} type="display3">
                    {data.Character
                      ? nameSwapper(
                          data.Character.name.first,
                          data.Character.name.last
                        )
                      : data.Staff
                        ? nameSwapper(
                            data.Staff.name.first,
                            data.Staff.name.last
                          )
                        : null}
                  </M.Typography>
                  <M.Divider />
                  <M.Typography
                    className={classes.desc}
                    type="body1"
                    dangerouslySetInnerHTML={{
                      __html: data.Character
                        ? data.Character.description
                        : data.Staff ? data.Staff.description : null
                    }}
                  />
                </M.Grid>
              </M.Grid>
              <div className={classes.bigBar} style={{ background: hue }}>
                <CommandoBar style={{ background: hue }}>
                  <div style={{ flex: 1 }} />
                  {user && data.Character ? (
                    <M.IconButton
                      className={classes.commandoButton}
                      color="contrast"
                      onClick={
                        user.favs &&
                        user.favs.char &&
                        user.favs.char[this.state.id]
                          ? this.unlike
                          : this.like
                      }
                    >
                      {fav ? <Icon.Favorite /> : <Icon.FavoriteBorder />}
                    </M.IconButton>
                  ) : null}
                  {user && data.Staff ? (
                    <M.IconButton
                      className={classes.commandoButton}
                      color="contrast"
                      onClick={
                        user.favs &&
                        user.favs.staff &&
                        user.favs.staff[this.state.id]
                          ? this.unlike
                          : this.like
                      }
                    >
                      {fav ? <Icon.Favorite /> : <Icon.FavoriteBorder />}
                    </M.IconButton>
                  ) : null}
                  <M.IconButton color="contrast">
                    <Icon.MoreVert />
                  </M.IconButton>
                </CommandoBar>
                <M.Grid container className={classes.container}>
                  {data.Staff &&
                  data.Staff.characters &&
                  data.Staff.characters.edges &&
                  data.Staff.characters.edges.length > 0 ? (
                    <M.Grid item xs style={{ zIndex: 10 }}>
                      <M.Typography type="title" className={classes.secTitle}>
                        Voice actor for
                      </M.Typography>
                      <M.Grid container className={classes.itemcontainer}>
                        {data.Staff.characters.edges.map(cast => (
                          <PeopleButton
                            name={{
                              first: cast.node.name.first,
                              last: cast.node.name.last
                            }}
                            key={cast.id}
                            image={cast.node.image.large}
                            onClick={() =>
                              this.openEntity(`/fig?c=${cast.node.id}`)
                            }
                            role={cast.role}
                          />
                        ))}
                      </M.Grid>
                    </M.Grid>
                  ) : null}
                  {data.Staff &&
                  data.Staff.staffMedia &&
                  data.Staff.staffMedia.edges &&
                  data.Staff.staffMedia.edges.length > 0 ? (
                    <M.Grid item xs style={{ zIndex: 10 }}>
                      <M.Typography type="title" className={classes.secTitle}>
                        Works
                      </M.Typography>
                      <M.Grid container className={classes.itemcontainer}>
                        {data.Staff.staffMedia.edges.map(anime => (
                          <CardButton
                            onClick={() =>
                              this.props.history.push(
                                `/show?${
                                  anime.node.type.includes("ANIME") ? "s" : "m"
                                }=${anime.node.id}`
                              )
                            }
                            key={anime.id}
                            title={
                              anime.node.title.english
                                ? anime.node.title.english
                                : anime.node.title.romaji
                            }
                            subtitle={anime.staffRole}
                            image={anime.node.coverImage.large}
                          />
                        ))}
                      </M.Grid>
                    </M.Grid>
                  ) : null}
                  {data.Character ? (
                    <M.Grid item xs style={{ zIndex: 10 }}>
                      <M.Typography type="title" className={classes.secTitle}>
                        Stars in
                      </M.Typography>
                      <M.Grid container className={classes.itemcontainer}>
                        {data.Character.media.edges.map(anime => (
                          <CardButton
                            title={
                              anime.node.title.english
                                ? anime.node.title.english
                                : anime.node.title.romaji
                            }
                            key={anime.id}
                            image={anime.node.coverImage.large}
                            onClick={() =>
                              this.openEntity(
                                `/show?${
                                  anime.node.type.includes("ANIME") ? "s" : "m"
                                }=${anime.node.id}`
                              )
                            }
                            role={anime.characterRole}
                          />
                        ))}
                      </M.Grid>
                    </M.Grid>
                  ) : null}
                </M.Grid>
              </div>
            </Grid>
          ) : null}
        </Root>
      </div>
    );
  }
}

export const updateMirTitle = title => ({
  type: MIR_SET_TITLE,
  title
});

const mapPTS = dispatch => ({
  sendTitleToMir: title => dispatch(updateMirTitle(title))
});

export default firebaseConnect()(
  connect(({ firebase: { profile } }) => ({ profile }), mapPTS)(
    M.withStyles(style)(Fig)
  )
);
