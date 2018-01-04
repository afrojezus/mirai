import React, { Component } from 'react'
import * as M from 'material-ui';
import * as Icon from 'material-ui-icons';

const style = theme => ({
    root: {
        height: '100%',
        width: '100%',
        position: 'relative'
    },
    bgImage: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: .4,
        height: '100vh',
        objectFit: 'cover',
        width: '100%',
        zIndex: -1
    },
    content: {
        marginLeft: "auto",
    marginRight: "auto",
    padding: 24,
    maxWidth: 1200,
    paddingTop: theme.spacing.unit * 8,
    [theme.breakpoints.up('md')]: {
      maxWidth: 'calc(100% - 64px)',
    }
    }
})

class User extends Component {

    render () {
        const { classes, user, history, meta } = this.props;
        if (!user) return null;
        return (
            <div className={classes.root}>
                <img src={user.headers} alt='' className={classes.bgImage} />
                <M.Grid container spacing={0} className={classes.content}>
                </M.Grid>
            </div>
        )
    }
}

export default M.withStyles(style)(User);