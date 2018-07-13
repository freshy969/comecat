import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';

import classnames from 'classnames';
import * as actions from '../actions/index';
import * as config from '../lib/config';

import fileIcon from '../../image/file.svg';

class DisplayDate extends Component {

    render() {

        let timestamp = this.props.date;
        const day = moment(timestamp);
        const friendlyText = day.fromNow();
        return <span>{friendlyText}</span>

    }

}

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DisplayDate);

  
