import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import classnames from 'classnames';
import * as actions from '../actions/index';

import * as utils from '../lib/Utils';
import { setTimeout } from 'timers';

import MessageRowText from './MessageRowText';
import MessageRowFile from './MessageRowFile';
import MessageRowTyping from './MessageRowTyping';

class ConversationContainer extends Component {

    constructor() {
        super();

        this.topMessage = null;
        this.bottomMessage = null;
        this.lastScrollHeight = 0;
    }

    onScroll = e => {

        if (e.target.scrollTop === 0) {

            if (this.topMessage)
                this.props.loadPastMessage(this.topMessage._id);


        }

    };

    componentWillUpdate(prevProps, nextProps) {

        this.lastScrollHeight = this.domScrollableConversation.scrollHeight;

    }

    componentDidUpdate(prevProps) {

        // initial load
        if (prevProps.messages.length !== this.props.messages.length) {

            const firstMessage = this.props.messages[0];
            const firstMessageOld = prevProps.messages[0];

            const lastMessage = this.props.messages[this.props.messages.length - 1];
            const lastMessageOld = prevProps.messages[prevProps.messages.length - 1];

            this.topMessage = firstMessage;
            this.bottomMessage = lastMessage;

            if (prevProps.messages.length == 0) {
                return utils.scrollElemBottom(this.domScrollableConversation, false);
            }

            // new messeage
            if ((lastMessageOld && lastMessage && lastMessage._id != lastMessageOld._id) ||
                lastMessageOld == undefined
            ) {

                if (lastMessageOld.type != -1)
                    utils.scrollElemBottom(this.domScrollableConversation, true);
                else {
                    // work around to fix scroll animation
                    const elm = this.domScrollableConversation;
                    elm.scrollTop = elm.scrollHeight - elm.clientHeight - 1;
                }

            }

            // load old message
            if (firstMessage && firstMessageOld && firstMessage._id != firstMessageOld._id) {

                this.domScrollableConversation.scrollTop =
                    this.domScrollableConversation.scrollHeight - this.lastScrollHeight
            }

            // receive typing
            if (lastMessage.type == -1) {
                utils.scrollElemBottom(this.domScrollableConversation, true);
            }
        }


    }

    componentDidMount = () => {

        return utils.scrollElemBottom(this.domScrollableConversation, false);

    }

    render() {
        return <div className="conversation row">
            <div className="shadow" />

            <div
                ref={scrollableConversation => {
                    this.domScrollableConversation = scrollableConversation;
                }}
                className="conversation-col col-md-12"
                onScroll={this.onScroll}
            >
                <div className="conversation-container">

                    {this.props.messages.map((message) => {

                        if (message.type == -1) {
                            return <MessageRowTyping message={message} key={message.localID} />
                        } else if (message.type == 2) {
                            return <MessageRowFile message={message} key={message._id} />
                        } else {
                            return <MessageRowText message={message} key={message._id} />
                        }

                    })}

                </div>
            </div>
        </div>
    }

}

function mapStateToProps(state) {
    return {
        messages: state.conversation.messages,
        agengId: state.agent.agentId,
        userId: state.user.userId,
        agentURL: state.agent.avatarURL,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadPastMessage: messageId => dispatch(actions.chat.loadPastMessage(messageId)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConversationContainer);


