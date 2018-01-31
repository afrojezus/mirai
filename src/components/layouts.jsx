import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'material-ui/styles/withStyles';
import Grid from 'material-ui/Grid/Grid';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import Paper from 'material-ui/Paper/Paper';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import Typography from 'material-ui/Typography/Typography';
import { blue } from 'material-ui/colors';
import withTheme from 'material-ui/styles/withTheme';

const style = theme => ({
    compacMode: {
        background: 'transparent'
    },
    container: {
        padding: theme.spacing.unit * 3,
        boxSizing: 'border-box',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
        background: 'transparent !important',
        transition: theme.transitions.create(['all']),
    },
    root: {
        paddingTop: theme.spacing.unit * 8,
        transition: theme.transitions.create(['all']),
        animation: 'load .3s ease',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: 1970,
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
        [theme.breakpoints.down('sm')]: {
            paddingLeft: 0,
            paddingRight: 0
        },
        boxSizing: 'border-box'
    },
    commandoBar: {
        width: '100%',
        display: 'inline-flex',
        boxSizing: 'border-box',
        background: '#222',
        borderBottom: `1px solid rgba(255,255,255,.1)`
    },
    commandoText: {
        margin: 'auto',
        textAlign: 'center',
    },
    commandoTextBox: {
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        margin: 'auto',
    },
    commandoTextLabel: {
        fontSize: 12,
        textAlign: 'center',
        color: 'rgba(255,255,255,.8)',
    },
    bigBar: {
        width: '100%',
        height: 'auto',
        //boxShadow: '0 2px 24px rgba(0,0,0,.2)',
        background: '#111',
        marginTop: theme.spacing.unit * 8,
        position: 'relative',
        //overflow: 'hidden',
        paddingBottom: theme.spacing.unit * 4,
        marginBottom: theme.spacing.unit * 8,
        transition: theme.transitions.create(['all']),
    },
    header: {
        position: 'absolute',
        zIndex: -1,
        opacity: .3,
        top: 0,
        width: '100%',
        objectFit: 'cover',
        left: 0,
        transition: theme.transitions.create(['all']),
        animation: 'fadeInSlowly 1.1s ease',
        textIndent: -999,
        border: 'none',
        height: '100vh'
    },
    headerD: {
        position: 'fixed',
        zIndex: -1,
        opacity: .8,
        top: 0,
        width: '100%',
        objectFit: 'cover',
        left: 0,
        transition: theme.transitions.create(['all']),
        animation: 'fadeInSlowly 1.1s ease',
        textIndet: -999,
        border: 'none',
        height: '100vh'
    },
    loading: {
        height: '100%',
        width: '100%',
        zIndex: 1200,
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        padding: 0,
        margin: 'auto',
        color: 'white',
        transition: theme.transitions.create(['all']),
    },
    titleheader: {
        width: '100%',
        minHeight: 300,
        background: `linear-gradient(to top, transparent, ${blue.A200})`,
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        zIndex: -1
    },
    titleheadertitle: {
        color: 'white',
        margin: 'auto',
        flex: 1,
        fontSize: 64,
        fontWeight: 800,
        textAlign: 'center'
    }
});

export const Container = withStyles(style, { withTheme: true })(({ classes, theme, children, spacing, special, hasHeader, ...props }) => (
    <Grid container style={hasHeader ? { marginTop: theme.spacing.unit * 16 }  :  null} spacing={spacing} {...props} className={special ? 'containerS' : classes.container}>
        {children}
    </Grid>
))

export const Root = withStyles(style)(({ classes, theme, children, ...props }) => (
    <div className={classes.root} {...props}>
        {children}
    </div>
))

export const CommandoBar = withStyles(style)(({ classes, children, ...props }) => (
    <Toolbar
        id='commandoBar'
        className={classes.commandoBar}
        {...props}
    >
        {children}
    </Toolbar>
))

export const MainCard = withStyles(style)(({ classes, children, ...props }) => (
    <Paper id='mainCard'
        className={classes.bigBar}
        {...props}
    >
        {children}
    </Paper>
))

export const TitleHeader = withStyles(style)(({ classes, children, title, ...props }) => (
    <div className={classes.titleheader} {...props}>
        <div style={{ flex: 1 }} />
        <Typography className={classes.titleheadertitle} type={'display2'}>{title}</Typography>
        <div style={{ flex: 1 }} />
        {children}
    </div>
))


class HeaderRaw extends React.Component {


    componentWillReceiveProps = (nextProps) => {
        if (!this.props.image) {
            document.documentElement.style.background = nextProps.color;
        }
    }

    componentWillUnmount = () => {
        if (this.props.color && !this.props.image) {
            document.documentElement.style.background = null;
        }
    }

    render() {
        const { image, color, classes } = this.props;
        if (image) {
            return (
                <img
                    id='header'
                    style={{ opacity: 0 }}
                    onLoad={e => e.currentTarget.style.opacity = null}
                    className={classes.header}
                    src={image}
                    alt=''
                    {...this.props}
                />
            )
        } else {
            return <div />
        }
    }
}

export const Header = withStyles(style)(HeaderRaw);

export const LoadingIndicator = withStyles(style)(({ classes, loading }) => (
    <CircularProgress
        className={classes.loading}
        style={!loading ? { opacity: 0 } : null}
    />
))

// Proptypes
Container.propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.any,
    spacing: PropTypes.number
}
Container.defaultProps = {
    spacing: 0
}
Root.propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.any
}
