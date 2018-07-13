import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import linkify from 'linkifyjs/string';

import classnames from 'classnames';
import * as actions from '../actions/index';
import DisplayDate from './DisplayDate';
import * as config from '../lib/config';

class MessageRowText extends Component {

    convertText(text){

        // link html and escape HTML
        text = linkify(text, {
            defaultProtocol: 'https'
        });

        // new line to BR
        text = text.replace(/\n/g,'<br />');
        
        return text;

    }

    render() {

        const message = this.convertText(this.props.message.message);

        let className = "bubble row text";

        if(this.props.message.sending)
            className += " sending";
        else
            className += " sent";
            
        if(this.props.userId == this.props.message.userID)
            className += " mine";

        if(this.props.userId == this.props.message.userID){

            return <div className={className}>
                <div className="avatar-container col-4 order-1">
                
                </div>
                <div className="text-container col-8 order-2">
                    <span dangerouslySetInnerHTML={{ __html: message }} />
                </div>
                <div className="date-container col-12 text-right order-3">
                    <DisplayDate date={this.props.message.created} />
                </div>
            </div>

        }else{

            let avatarURL = config.AvatarBaseURL + this.props.message.user._id;

            if(
                this.props.message.user &&
                this.props.message.user.avatar &&
                this.props.message.user.avatar.thumbnail){

                    avatarURL = config.AvatarBaseURL + this.props.message.user.avatar.thumbnail.nameOnServer;

            }
            
            return <div className={className}>
                    <div className="avatar-container col-2">
                        <img className="avatar" src={avatarURL} alt="user avatar" />
                    </div>
                    <div className="text-container col-8">
                        <span dangerouslySetInnerHTML={{ __html: message }} />
                    </div>
                    <div className="col-2"></div>
                    <div className="date-container col-10 text-right">
                        <DisplayDate date={this.props.message.created} />
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
)(MessageRowText);

  
