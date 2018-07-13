import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import classnames from 'classnames';
import * as actions from '../actions/index';

class MessageRowTyping extends Component {

    render() {
        if(this.props.userId == this.props.message.userID){

            return <div />

        }else{

            return <div className="bubble row typing" key={this.props.message.localID}>

                <div className="avatar-container col-2">
                    <img className="avatar" src={this.props.agentURL} alt="user avatar" />
                </div>
                <div className="typing-container col-8">

                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                </div>

            </div>

        }
    }

}

function mapStateToProps(state) {
    return {
        agengId:state.agent.agentId,
        userId:state.user.userId,
        agentURL : state.agent.avatarURL,
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MessageRowTyping);

  
