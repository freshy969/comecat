import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as constant from '../../lib/const';
import * as actions from '../../actions';
import * as utils from '../../lib/utils';

import AvatarImage from '../AvatarImage';

class UserList extends Component {

    static propTypes = {
    }

    constructor() {
        super();
        this.currentPage = 1;
        this.lastSearchTimeout;
    }

    onScroll = (e) => {

        const scrollPos = e.target.scrollTop + 0;
        const realScrollPos = scrollPos + e.target.clientHeight;
        const scrollHeight = e.target.scrollHeight;

        // if scroll position is between 2px from bottom
        if (Math.abs(realScrollPos - scrollHeight) < 1) {

            if (!this.props.isLoading) {
                this.currentPage++;
                this.props.loadUserList(this.currentPage);
            }

        }
    }

    onInputChange = (e) => {
        e.persist();

        clearTimeout(this.lastSearchTimeout);

        this.lastSearchTimeout = setTimeout(() => {
            this.props.searchUserList(e.target.value)
        }, constant.SearchInputTimeout);
    }

    searchOnSubmit = e => {
        e.preventDefault();

        const inputElement = e.target.firstElementChild;

        this.props.searchUserList(inputElement.value);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.usersViewState && nextProps.usersViewState) {
            this.inputField.select();
        }
    }

    render() {

        return (
            <div>
                {this.props.usersLoading ?
                    <div className="spinner-linear">
                        <div className="line"></div>
                    </div> : null
                }

                <div onScroll={this.onScroll} className="usersview">

                    <header className="media-list-header b-0">
                        <form className="lookup lookup-lg w-100 bb-1 border-light" onSubmit={this.searchOnSubmit}>
                            <input
                                ref={inputField => this.inputField = inputField}
                                onChange={this.onInputChange}
                                className="w-100 no-radius no-border input--height60"
                                type="text"
                                placeholder="Search..." />
                        </form>
                    </header>

                    <div className="media-list-body bg-white">

                        {this.props.users.map((user) => {

                            let fileId = null;

                            if (user.avatar && user.avatar.thumbnail)
                                fileId = user.avatar.thumbnail.nameOnServer;
                            else
                                fileId = user._id;

                            return (
                                <div className="media align-items-center" key={user._id}
                                    onClick={() => {
                                        let chatId = utils.chatIdByUser(user);
                                        this.props.openChat(user);
                                        this.props.loadChatMessages(chatId);
                                        this.props.changeCurrentChat(chatId)
                                    }}>

                                    <span className="flexbox flex-grow gap-items text-truncate">

                                        <AvatarImage fileId={fileId} type={constant.AvatarUser} />

                                        <div className="media-body text-truncate">
                                            <h6>{user.name}</h6>
                                            <small>
                                                <span>{user.description}</span>
                                            </small>
                                        </div>

                                    </span>

                                </div>
                            )

                        })}


                    </div>

                </div>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        usersLoading: state.userlist.loading,
        users: state.userlist.users,
        usersViewState: state.chatUI.usersViewState,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadUserList: (page) => dispatch(actions.userlist.loadUserList(page)),
        searchUserList: (value) => dispatch(actions.userlist.searchUserList(value)),
        openChat: user => dispatch(actions.chat.openChatByUser(user)),
        loadChatMessages: (chatId) => dispatch(actions.chat.loadChatMessages(chatId)),
        changeCurrentChat: chatId => dispatch(actions.chat.changeCurrentChat(chatId))

    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserList);
