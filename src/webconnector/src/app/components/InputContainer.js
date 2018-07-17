import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import classnames from 'classnames';
import * as actions from '../actions/index';

import attachIcon from '../../image/attachment.svg';

class InputContainer extends Component {

    handleClickFileUpload = (e) => {

        if (this.props.fileUploading)
            return alert('Please wait to finish upload.');

        if (!e.target.files[0])
            return;

        this.props.startFileUpload(e.target.files[0]);
    }

    handleKeyPress = (e) => {
        this.props.onTyping(e.target.value);
    }

    handleEnterKeyPress = (e) => {
        if (e.keyCode === 13) {
            if (e.target.value.length > 0) {

                this.props.onSendText(e.target.value);
                this.props.onTyping("");

            }

        }
    }

    componentDidMount = () => {

        /*
        let progress = 0;

        setTimeout(() => {

            this.props.startFileUpload({
                name: "Screen Shot 2018-05-22 at 14.13.04.png",
                size: 607845
            });

        }, 500);

        const timer = setInterval(() => {

            progress += 10;
            this.props.updateFileUploadProgress(progress);

            if (progress > 70) {
                clearTimeout(timer);
            }

        }, 1000);
        */

    }

    render() {
        return <div className="input-container row">

            <div className="input-col col-md-12">

                <input
                    onChange={e => this.handleKeyPress(e)}
                    onKeyDown={e => this.handleEnterKeyPress(e)}
                    type="text"
                    value={this.props.messageText}
                    placeholder="Type here message..."
                />

                <input type="file" style={{ "display": "none" }}
                    ref={input => this.fileInputElement = input}
                    onChange={this.handleClickFileUpload}
                />
                <img className="attachment" src={attachIcon} onClick={e => this.fileInputElement.click()} />

            </div>
        </div>
    }

}

function mapStateToProps(state) {
    return {
        messageText: state.conversation.messageText,
        fileUploading: state.conversation.fileUploading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onTyping: text => dispatch(actions.chat.typeText(text)),
        onSendText: text => dispatch(actions.chat.sendMessage(text)),
        startFileUpload: file => dispatch(actions.chat.startFileUpload(file)),
        updateFileUploadProgress: progress => dispatch(actions.chat.updateFileUploadProgress(progress))
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InputContainer);


