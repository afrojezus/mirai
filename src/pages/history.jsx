import React, { Component } from 'react';
import { Root, CommandoBar, Container,  LoadingIndicator,   TitleHeader } from "../components/layouts";
import { withStyles } from 'material-ui/styles'
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";

const style = theme => ({

})

class History extends Component {
    render = () => (
        <Root>
            <TitleHeader title={'History'}/>
            <Container>

            </Container>
        </Root>
    )
}

export default firebaseConnect()(
    connect(({ firebase: { profile } }) => ({ profile }))(
        withStyles(style)(History)
    )
);