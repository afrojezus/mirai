import React, { Component } from "react";
import * as M from "material-ui";
import * as Icon from "material-ui-icons";
import Aqua4 from "../assets/Ripple.mp4";

import Segoku from "../utils/segoku/segoku";
import Twist from "../twist-api";

import corrector from "../utils/bigfuck";

const style = theme => ({
  root: {
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
    opacity: 0.4,
    height: "100vh",
    objectFit: "cover",
    width: "100%",
    zIndex: -1
  },
  content: {
    marginLeft: "auto",
    marginRight: "auto",
    padding: 24,
    maxWidth: 1200,
    paddingTop: theme.spacing.unit * 8,
    [theme.breakpoints.up("md")]: {
      maxWidth: "calc(100% - 64px)"
    }
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
    position: "absolute",
    bottom: -theme.spacing.unit * 2,
    padding: theme.spacing.unit,
    textAlign: "center",
    margin: "auto",
    left: -theme.spacing.unit * 8
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
  searchContainer: {
    flexGrow: 1,
    position: "relative",
    width: 700
  },
  suggestionsContainerOpen: {
    position: "absolute",
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  textField: {
    width: "100%",
    padding: 0,
    "label + &": {
      marginTop: theme.spacing.unit * 3
    }
  },
  input: {
    borderRadius: 4,
    fontSize: 20,
    textAlign: "center",
    padding: theme.spacing.unit * 2,
    width: "100%",
    transition: theme.transitions.create(["all"]),
    "&:focus": {
      boxShadow: "0 1pt 0.2rem rgba(0,0,0,.25)"
    }
  },
  searchBar: {
    marginTop: theme.spacing.unit * 8
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
  }
});

class Search extends Component {
  state = {
    searchVal: "",
    loading: true,
    data: []
  };

  componentDidMount = () => {
    setTimeout(() => this.setState({ loading: false }, () => this.uwu()), 300);
  };

  uwu = async () => {
    const { data } = await new Segoku().get({
      search: this.state.searchVal,
      isAdult: false,
      page: 1
    });

    if (data) {
      var filtArray = data.Page.media.filter(array_el => {
        return (
          this.props.twist.filter(anotherOne_el => {
            return (
              anotherOne_el.name.toLowerCase() ===
              corrector(array_el.title.romaji.toLowerCase())
            );
          }).length === 0
        );
      });
      this.setState({ data: data.Page.media });
    }
  };

  openEntity = link => {
    this.props.history.push(link);
  };

  handleChange = e => {
    this.setState(
      {
        searchVal: e.target.value
      },
      async () => this.uwu()
    );
  };

  render() {
    const { classes, user, history, meta, twist } = this.props;
    const { searchVal, loading, data } = this.state;
    return (
      <div className={classes.root} style={loading ? { opacity: 0 } : null}>
        <M.Toolbar className={classes.searchBar}>
          <M.TextField
            placeholder="Search"
            className={classes.input}
            value={searchVal}
            onChange={this.handleChange}
            type="search"
          />
        </M.Toolbar>
        <img src={Aqua4} alt="" className={classes.bgImage} />
        <M.Grid container spacing={0} className={classes.content}>
          <M.Grid container className={classes.itemcontainer}>
            {data
              ? data.map((anime, index) => (
                  <M.Grid
                    className={
                      anime.type.includes("ANIME")
                        ? classes.entityCard
                        : classes.entityCardDisabled
                    }
                    item
                    xs
                    key={index}
                  >
                    <M.Card
                      style={{ background: "transparent" }}
                      onClick={
                        anime.type.includes("ANIME")
                          ? () => this.openEntity(`/show?s=${anime.id}`)
                          : null
                      }
                    >
                      <div className={classes.gradientCard}>
                        <M.CardMedia
                          className={classes.entityImage}
                          image={anime.coverImage.large}
                        />
                      </div>
                      <M.Typography
                        type="headline"
                        className={classes.entityTitle}
                      >
                        {anime.title.english
                          ? anime.title.english
                          : anime.title.romaji}
                      </M.Typography>
                      <M.Typography
                        type="headline"
                        className={classes.entitySubTitle}
                      >
                        {!anime.type.includes("ANIME") ? anime.type : null}
                      </M.Typography>
                    </M.Card>
                  </M.Grid>
                ))
              : null}
          </M.Grid>
        </M.Grid>
      </div>
    );
  }
}

export default M.withStyles(style)(Search);
