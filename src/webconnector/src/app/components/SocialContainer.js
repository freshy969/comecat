import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import classnames from 'classnames';
import * as actions from '../actions/index';
import * as config from '../lib/config';

import loadingGif from '../../image/loading.gif';
import iconMessenger from '../../image/messenger.svg';
import iconLine from '../../image/line.svg';
import iconWechat from '../../image/wechat.svg';
import iconViber from '../../image/viber.svg';
import iconKik from '../../image/kik.svg';
import iconTelegram from '../../image/telegram.svg';

class SocialContainer extends Component {

    constructor() {
        super();
    }

    render() {


        return <div className="social-container">

            {this.props.connectors.facebook ?
                <a href={"https://m.me/" + this.props.connectors.facebook.pageName} >
                    <img src={iconMessenger} />
                </a> : null}


            {this.props.connectors.line ?
                <a href={"https://line.me/R/ti/p/" + this.props.connectors.line.lineID} >
                    <img src={iconLine} />
                </a> : null}

            {/*<img src={iconWechat} /> need to show QR code */}

            {this.props.connectors.viber ?
                <a href={"viber://pa?chatURI=" + this.props.connectors.viber.URI} >
                    <img src={iconViber} />
                </a> : null}

            {this.props.connectors.kik ?
                <a href={"https://kik.me/" + this.props.connectors.kik.botName} >
                    <img src={iconKik} />
                </a> : null}

            {this.props.connectors.telegram ?
                <a href={"https://telegram.me/" + this.props.connectors.telegram.botName} >
                    <img src={iconTelegram} />
                </a> : null}
        </div>

    }

}

function mapStateToProps(state) {
    return {
        connectors: state.userform.connectors
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SocialContainer);


