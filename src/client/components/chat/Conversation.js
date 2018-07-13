import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import * as actions from "../../actions";
import * as constant from "../../lib/const";
import * as strings from "../../lib/strings";
import * as config from "../../lib/config";
import * as util from "../../lib/utils";
import user from "../../lib/user";

import SocketManager from "../../lib/SocketManager";
import Encryption from "../../lib/encryption/encryption";
import AvatarImage from "../AvatarImage";
import DateTime from "../DateTime";
import Stickers from "./Stickers";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";
import Message from "./Message";

class Conversation extends Component {
    constructor() {
        super();

        this.todayDateObject = new Date();
        this.todayDate = `${this.todayDateObject.getFullYear()}-${this.todayDateObject.getMonth()}-${this.todayDateObject.getDate()}`;
        this.stickersLoaded = false;
        this.lockedForAutoScroll = false;
    }

    static propTypes = {};

    onScroll = e => {

        if (e.target.scrollTop === 0 && !this.props.isLoading) {

            if (this.props.messageList[0]) {
                this.props.loadOldMessages(this.props.currentChatId, this.props.messageList[0]._id);
                this.setLockedForScrolling();
            }

        }

    };

    onWheel = e => {
        this.lockedForAutoScroll = util.getScrollBottom(this.scrollableConversation) > constant.scrollBoundary;
    }

    componentWillUpdate(nextProps) {
        this.lastConversationHeight = this.scrollableConversation.scrollHeight;
    }

    componentDidUpdate(prevProps) {

        if (prevProps.loadingDirection !== constant.ChatDirectionAllTo) {
            if (this.lockedForAutoScroll) {
                if (this.scrollableConversation.scrollHeight > this.lastConversationHeight && this.props.messageList.length - prevProps.messageList.length > 1) {
                    this.scrollableConversation.scrollTop = this.scrollableConversation.scrollHeight - this.lastConversationHeight;
                }
            }
            else {
                if (this.scrollableConversation.scrollHeight !== this.lastConversationHeight) {
                    util.scrollElemBottom(this.scrollableConversation);
                }
            }
        }
    }

    setLockedForScrolling = (value = true) => {
        this.lockedForAutoScroll = value;
    }

    checkFileUploadSupport = (showMessage) => {
        if (this.props.room &&
            this.props.room.external) {

            const externalInfo = this.props.room.external;

            if (!util.checkFileUploadSupport(externalInfo.serviceIdentifier)) {

                if (showMessage) this.props.showToast(strings.ChatFileUploadDoesntSupport[user.lang]);
                return false;
            }
        }

        return true;
    }

    handleDragEnter = e => {
        e.preventDefault();

        if (!this.checkFileUploadSupport()) return;

        if (e.currentTarget.classList.contains("chat-content")) {
            e.currentTarget.classList.add("dragging-over");
            this.dropIndicator.classList.add('drag-drop-indicator-visible')
        }
    };

    handleDrop = e => {
        e.preventDefault();

        if (!this.checkFileUploadSupport(true)) return;

        Array.from(e.dataTransfer.files).forEach(file => {
            const data = new FormData();
            data.append("file", file);
            this.props.startFileUpload(data);
            this.setLockedForScrolling(false);
        });
        if (e.target.classList.contains("chat-content")) {
            e.target.classList.remove("dragging-over");
            this.dropIndicator.classList.remove('drag-drop-indicator-visible')
        }
    };

    handleDragLeave = e => {
        e.preventDefault();

        if (!this.checkFileUploadSupport()) return;

        if (e.target.classList.contains("chat-content")) {
            e.target.classList.remove("dragging-over");
            this.dropIndicator.classList.remove('drag-drop-indicator-visible')
        }

    };

    handleDragOver = e => {
        e.preventDefault();
    };

    render() {
        var sortedMsgs = new Map();
        let messageList = [...this.props.messageList];

        if (typeof this.props.files[this.props.currentChatId] !== "undefined") {
            let filesInProgress = Object.values(
                this.props.files[this.props.currentChatId]
            );
            filesInProgress = filesInProgress.filter(
                file =>
                    this.props.messageList.find(msg => msg.localID === file.localID) ===
                    undefined
            );

            messageList = messageList.concat(filesInProgress);
        }

        if (messageList.length > 0) {

            if (this.props.searchTarget) {
                let searchTargetIndex = messageList.findIndex(message => message._id === this.props.searchTarget)
                if (searchTargetIndex > -1) {
                    messageList[searchTargetIndex].searchTarget = true;
                }
            }

            let currUsr = messageList[0].userID;
            let currDatObject = new Date(messageList[0].created);
            //YYYY-MM-DD
            let currDat = `${currDatObject.getFullYear()}-${currDatObject.getMonth()}-${currDatObject.getDate()}`;
            let currMsgs = [];

            sortedMsgs.set(currDat, []);

            for (let msg of messageList) {
                let msgUsr = msg.userID;
                let msgDatObject = new Date(msg.created);
                //YYYY-MM-DD
                let msgDat = `${msgDatObject.getFullYear()}-${msgDatObject.getMonth()}-${msgDatObject.getDate()}`;

                if (currDat !== msgDat) {
                    if (currMsgs.length > 0) sortedMsgs.get(currDat).push(currMsgs);
                    currMsgs = [];
                    sortedMsgs.set(msgDat, []);
                }

                if (currUsr !== msgUsr) {
                    if (currMsgs.length > 0) sortedMsgs.get(currDat).push(currMsgs);
                    currMsgs = [];
                }

                currMsgs.push(msg);
                currUsr = msgUsr;
                currDat = msgDat;
            }

            sortedMsgs.get(currDat).push(currMsgs);
        }

        let conversationItems = [];

        sortedMsgs.forEach((messagesByDate, date) => {
            if (this.todayDate === date) {
                conversationItems.push(
                    <div key={date} className="media media-meta-day">
                        Today
          </div>
                );
            }

            messagesByDate.forEach(messagesByUser => {
                const firstMessage = messagesByUser[0];
                const lastMessage = messagesByUser[messagesByUser.length - 1];
                const user = firstMessage.user;
                const userId = user ? user._id : firstMessage.userID;

                let groupedMessages;

                if (userId === this.props.user._id) {
                    groupedMessages = (
                        <div
                            className="media media-chat mymessage"
                            key={firstMessage._id || firstMessage.localID}
                        >
                            <div className="media-body">
                                {messagesByUser.map(message => (
                                    <Message
                                        key={message._id || message.localID}
                                        messageData={message}
                                        lockForScroll={this.setLockedForScrolling}
                                    />
                                ))}

                                <p className="meta">
                                    <DateTime timestamp={lastMessage.created} />
                                </p>
                            </div>
                        </div>
                    );
                } else {
                    groupedMessages = (
                        <div className="media media-chat" key={firstMessage._id}>
                            <AvatarImage type={constant.AvatarUser} user={user} />

                            <div className="media-body">
                                {messagesByUser.map(message => (
                                    <Message
                                        key={message._id}
                                        messageData={message}
                                        lockForScroll={this.setLockedForScrolling}
                                    />
                                ))}

                                <p className="meta">
                                    <DateTime timestamp={lastMessage.created} /><time> by: {user.name}</time>
                                </p>
                            </div>
                        </div>
                    );
                }

                conversationItems.push(groupedMessages);
            });
        });

        let chatContainerClass = "chat-container card card-bordered flex-column";
        if (this.props.infoViewState) chatContainerClass += " hide";

        return (
            <div className={chatContainerClass}>
                {!this.props.currentChatId ? (

                    <div className="col-12">

                        <div className="card">

                            <div className="card-body">
                                <div className="callout callout-danger" role="alert">
                                    <h5>Welcome To ComeCat Open Beta</h5>
                                    <p>
                                        ComeCat is opensource team chat + user support platform.
                                        For details please see <a target="blank" href="https://come.cat"> Web Site </a> <br />
                                        Here is the <a target="blank" href="https://doc.come.cat">Documentation</a>
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>

                ) : null}

                {this.props.isLoading ? (
                    <div className="spinner-linear">
                        <div className="line" />
                    </div>
                ) : null}

                <ChatHeader />
                <div
                    ref={scrollableConversation => {
                        this.scrollableConversation = scrollableConversation;
                    }}
                    onWheel={this.onWheel}
                    onScroll={this.onScroll}
                    onDragEnter={this.handleDragEnter}
                    onDrop={this.handleDrop}
                    onDragLeave={this.handleDragLeave}
                    onDragOver={this.handleDragOver}
                    className="scrollable flex-grow chat-content"
                >
                    {conversationItems}
                </div>

                <ChatInput setLockedForScrolling={this.setLockedForScrolling} />
                <Stickers />

                <div className="drag-drop-indicator" ref={dropIndicator => this.dropIndicator = dropIndicator}>
                    <i className="fa fa-cloud-upload" ></i>
                    <p> Drop files now </p>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentChatId: state.chat.chatId,
        chatAvatar: state.chat.chatAvatar,
        isLoading: state.chat.isLoading,
        messageList: state.chat.messageList,
        user: user.userData,
        UsersTyping: state.chat.typing,
        infoViewState: state.chatUI.infoViewState,
        files: state.files,
        loadingDirection: state.chat.loadingDirection,
        searchTarget: state.chat.loadAllToTarget,
        room: state.infoView.room
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadOldMessages: (chatID, lastMessage) =>
            dispatch(actions.chat.loadOldMessages(chatID, lastMessage)),
        startFileUpload: file => dispatch(actions.chat.startFileUpload(file)),
        showToast: message => dispatch(actions.notification.showToast(message)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);
