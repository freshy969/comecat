import PropTypes, { string } from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classNames from 'classnames';

import * as actions from '../actions';

import * as constant from '../lib/const';
import * as strings from '../lib/strings';
import * as util from '../lib/utils';
import * as config from '../lib/config';

import user from '../lib/user';
import { store } from '../index';

import Base from './Base';

import Modals from '../components/Modals';
import SideBar from '../components/chat/SideBar';
import Header from '../components/chat/Header';
import History from '../components/chat/History';
import AvatarImage from '../components/AvatarImage';
import DateTime from '../components/DateTime';

import ChatbotConversation from '../components/chatbot/ChatbotConversation';
import ChatbotCustom from '../components/chatbot/ChatbotCustom';

class Chatbot extends Base {

    constructor() {
        super();
    }

    static propTypes = {
    }

    copyDone() {
        this.props.showToast(strings.ConnectorCopied[user.lang]);
    }

    componentDidMount() {
        this.props.initConnectorsView(user.userData);
        this.props.tabClick('conversation');
    }

    componentWillUnmount() {
    }

    render() {

        let sideBarClass = "pace-done sidebar-folded";
        if (this.props.sidebarState)
            sideBarClass += " sidebar-open";

        let asideBarHolderClass = "layout-chat";
        if (this.props.historyBarState)
            asideBarHolderClass += " aside-open";


        return (

            <div className={sideBarClass} onClick={this.globalClick}>

                <SideBar />
                <Header />

                <main className={asideBarHolderClass}>

                    <History />

                    <header className="header bg-ui-general">
                        <div className="header-info form-type-line">
                            <h1 className="header-title">
                                <strong>{strings.ChatbotTitle[user.lang]}</strong>
                            </h1>
                        </div>
                        <div className="header-action">
                            <nav className="nav">
                                <span className={classNames("nav-link", "cursor-pointer", { active: this.props.tab == 'conversation' })} onClick={e => { this.props.tabClick('conversation') }}>{strings.ChatbotTab1[user.lang]}</span>
                                <span className={classNames("nav-link", "cursor-pointer", { active: this.props.tab == 'custom' })} onClick={e => { this.props.tabClick('custom') }}>{strings.ChatbotTab2[user.lang]}</span>
                            </nav>
                        </div>
                    </header>

                    <div className="main-content integration">

                        <ChatbotConversation />
                        <ChatbotCustom />

                    </div>

                </main>

                <Modals />

            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        tab: state.chatbot.tab,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        hideNotifications: () => dispatch(actions.chatUI.hideNotification()),
        hideUsersView: () => dispatch(actions.chatUI.hideUsersView()),
        hideGroupsView: () => dispatch(actions.chatUI.hideGroupsView()),
        hideStickersView: () => dispatch(actions.chatUI.hideStickersView()),
        hideSidebar: () => dispatch(actions.chatUI.hideSidebar()),
        hideHistory: () => dispatch(actions.chatUI.hideHistory()),
        hideProfileView: () => dispatch(actions.chatUI.hideProfileView()),

        initConnectorsView: (userData) => dispatch(actions.connector.initConnectorsView(userData)),
        showToast: (text) => dispatch(actions.notification.showToast(text)),
        tabClick: (tab) => dispatch(actions.chatbot.tabClick(tab)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chatbot);
