import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

class Init extends Component {


    render () {
        const { children } = this.props;
        return [children]
    }
}

export default withRouter(connect(state => state)(Init));