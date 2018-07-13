import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import classnames from 'classnames';
import * as actions from '../actions/index';
import * as config from '../lib/config';

import fileIcon from '../../image/file.svg';
import DisplayDate from './DisplayDate';

class MessageRowFile extends Component {

    render() {

        let className = "bubble row ";
        let thumbURL = config.ImageBaseURL;
        let imageURL = config.ImageBaseURL;
        let fileName = "";
        if (this.props.message.file &&
            this.props.message.file.file) {

            imageURL = imageURL + this.props.message.file.file.id;
            fileName = this.props.message.file.file.name;

        }

        if (this.props.message.file &&
            this.props.message.file.thumb &&
            this.props.message.file.thumb.id) {

            thumbURL = thumbURL + this.props.message.file.thumb.id;

        }

        if (this.props.message.sending)
            className += " sending";
        else
            className += " sent";

        if (this.props.userId == this.props.message.userID)
            className += " mine";

        // image

        if (this.props.message.sending) {

            className += " file sending";
            let fileUploadingProgress = this.props.progress + '%';

            return <a className={className} target="_blank" href={imageURL} >
                <div className="avatar-container col-2">

                </div>
                <div className="icon-container col-2 order-1">
                    <img src={fileIcon} className="file" />
                </div>
                <div className="text-container col-8 order-2">

                    <div className="progressbar-container">
                        <div className="progress-bar progress-bar-striped progress-bar-animated" style={{
                            width: fileUploadingProgress
                        }
                        }>

                        </div>
                        <div className="progress-filename">

                        </div>
                    </div>

                </div>
                <div className="date-container col-12 text-right order-3">

                </div>

            </a >
        }
        else if (this.props.message.file.thumb) {

            className += " image";

            if (this.props.userId == this.props.message.userID) {

                return <div className={className}>
                    <div className="image-container col-12">

                        <a href={imageURL} target="_blank">
                            <img className="image" src={thumbURL} alt="image" />
                        </a>

                        <div className="filename-container">
                            {fileName}
                        </div>

                    </div>
                    <div className="date-container col-12 text-right">
                        <DisplayDate date={this.props.message.created} />
                    </div>

                </div>

            } else {

                return <div className={className}>
                    <div className="image-container col-12">

                        <a href={imageURL} target="_blank">
                            <img className="image" src={thumbURL} alt="image" />
                        </a>

                        <div className="filename-container">
                            <img className="avatar" src={this.props.agentURL} alt="user avatar" />
                            {fileName}
                        </div>

                    </div>
                    <div className="date-container col-12 text-right">
                        <DisplayDate date={this.props.message.created} />
                    </div>

                </div>
            }
        }
        // file
        else {

            className += " file";

            if (this.props.userId == this.props.message.userID) {

                return <a className={className} target="_blank" href={imageURL} >
                    <div className="avatar-container col-2">

                    </div>
                    <div className="icon-container col-2 order-1">
                        <img src={fileIcon} className="file" />
                    </div>
                    <div className="text-container col-8 order-2">
                        {this.props.message.file.file.name}
                    </div>
                    <div className="date-container col-12 text-right order-3">
                        <DisplayDate date={this.props.message.created} />
                    </div>

                </a>

            } else {

                return <a className={className} target="_blank" href={imageURL} >
                    <div className="avatar-container col-2">
                        <img className="avatar" src={this.props.agentURL} alt="user avatar" />
                    </div>
                    <div className="icon-container col-2">
                        <img src={fileIcon} className="file" />
                    </div>
                    <div className="text-container col-8">

                        {this.props.message.file.file.name}
                    </div>
                    <div className="date-container col-12 text-right">
                        <DisplayDate date={this.props.message.created} />
                    </div>

                </a>
            }
        }

    }

}

function mapStateToProps(state) {
    return {
        agengId: state.agent.agentId,
        userId: state.user.userId,
        agentURL: state.agent.avatarURL,
        progress: state.conversation.fileUploadingProgress,
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MessageRowFile);


