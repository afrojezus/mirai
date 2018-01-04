import React, { Component } from 'react'
import * as M from 'material-ui';
import * as Icon from 'material-ui-icons';
import Aqua3 from '../assets/aqua3.gif'

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
    },
    header: {
        position: 'relative',
        margin: 'auto',
        paddingTop: theme.spacing.unit * 3
    },
    title: {
        color: 'white',
        fontSize: 64,
        fontWeight: 700,
        textShadow: '0 3px 16px rgba(0,0,0,.4)',
        position: 'absolute',
        bottom: -theme.spacing.unit * 2,
        padding: theme.spacing.unit,
        textAlign: 'center',
        margin: 'auto',
        left: -theme.spacing.unit * 8
    },
    icon: {
        boxShadow: '0 1px 12px rgba(0,0,0,.2)',
        color: 'white',
        height: 92,
        width: 92,
        zIndex: -1,
        background: 'linear-gradient(to top, #999900 0%, #ffff00 70%)',
        borderRadius: '50%',
        padding: theme.spacing.unit * 2
    }
})

class Rankings extends Component {

    render () {
        const { classes, user, history, meta } = this.props;
        return (
            <div className={classes.root}>
                <img src={Aqua3} alt='' className={classes.bgImage} />
                <M.Grid container spacing={0} className={classes.content}>
                <div className={classes.header}>
                <Icon.Star className={classes.icon} />
                <M.Typography type='display3' className={classes.title}>Rankings</M.Typography>
                </div>
                </M.Grid>
            </div>
        )
    }
}

export default M.withStyles(style)(Rankings);