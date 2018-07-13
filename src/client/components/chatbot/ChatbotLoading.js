import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classNames from 'classnames';

import * as actions from '../../actions';
import * as constant from '../../lib/const';
import * as strings from '../../lib/strings';
import * as util from '../../lib/utils';
import * as config from '../../lib/config';
import user from '../../lib/user';


class ChatbotLoading extends Component {

    static propTypes = {
    }

    render() {

        return (

            <div>{this.props.isLoading ?
                <div className="spinner-linear">
                    <div className="line"></div>
                </div> : null
            }</div>

        );
    }

}

const mapStateToProps = (state) => {
    return {
        isLoading: state.chatbot.loading,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatbotLoading);
