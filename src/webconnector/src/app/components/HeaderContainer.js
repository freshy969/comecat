import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import classnames from 'classnames';
import * as actions from '../actions/index';

class HeaderContainer extends Component {

    render() {
        return <div
            className="header row"
            style={
                {
                    backgroundImage: `url(${this.props.coverImage})`
                }
            }
        >
            <div className="col-sm-12 col-3">
                <img className="agentavatar" src={this.props.agentURL} alt="user avatar" />
            </div>

            <div className="col-sm-12 col-9 description">
                <div className="agentname">{this.props.agentName}</div>
                <div className="agentdescription"> {this.props.agentDescription} </div>
            </div>
        </div>
    }

}

function mapStateToProps(state) {
    return {
        agentName: state.agent.name,
        agentURL: state.agent.avatarURL,
        agentDescription: state.agent.description,
        coverImage: state.agent.coverURL
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onTyping: text => dispatch(actions.chat.typeText(text)),
        onSendText: text => dispatch(actions.chat.sendMessage(text)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HeaderContainer);


